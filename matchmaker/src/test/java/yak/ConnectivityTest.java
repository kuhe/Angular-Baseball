package yak;

import org.junit.*;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;
import yak.annotation.FieldId;
import yak.annotation.TeamToken;
import yak.controller.Base;
import yak.field.Field;
import yak.field.Organizer;
import yak.message.FieldRequest;
import yak.message.PartnerConnect;
import yak.message.Pitch;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ConnectivityTest {

    @Before
    public void setup() throws Exception {
        List<Transport> transports = new ArrayList<>();
        transports.add(
            new WebSocketTransport(
                new StandardWebSocketClient()
            )
        );
        socky = new SockJsClient(transports);
        stompy = new WebSocketStompClient(socky);
        stompy.setMessageConverter(
            new MappingJackson2MessageConverter()
        );
        failure = new AtomicReference<>();
        field = Organizer.instance.field(fieldName);
    }

    /**
     * More of a setup step than test, connects a subscriber to Team1's channel.
     */
    @Test
    public void t0Connect() throws Exception {
        connect(new TestSessionHandler((StompSession session, StompHeaders headers) -> {

            final @TeamToken String team1 = team(1);
            final @TeamToken String team2 = team(2);

            final String channel = Base.routeSelf(team1);

            session.subscribe(channel, new StompFrameHandler() {

                @Override
                public Type getPayloadType(StompHeaders headers) {
                    latch.countDown();
                    return PartnerConnect.class;
                }

                @Override
                public void handleFrame(StompHeaders headers, Object payload) {}

            });

            try {
                session.send("/action/field_request", new FieldRequest(field.name, team1));
                session.send("/action/field_request", new FieldRequest(field.name, team2));
            } catch (Throwable t) {
                failure.set(t);
                latch.countDown();
            }

        }, failure), 1);
    }

    /**
     * Two field requests to the same field by separate teams should register.
     */
    @Test
    public void t1FieldRequest() throws Exception {

        assertTrue("field contains team 1", field.contains(team(1)));
        assertTrue("field contains team 2", field.contains(team(2)));
        assertTrue("team 1 opponent is team 2", field.opponent(team(1)).equals(team(2)));
        assertTrue("team 2 opponent is team 1", field.opponent(team(2)).equals(team(1)));
        assertFalse("field does not contain team 3", field.contains(team(3)));

    }

    /**
     * A pitch message is broadcast to the opponent on the same field.
     */
    @Test
    public void t2Pitch() throws Exception {

        StompSessionHandler sessionHandler = new TestSessionHandler((StompSession session, StompHeaders headers) -> {

            final @TeamToken String team1 = team(1);
            final @TeamToken String team2 = team(2);

            final String channel = Base.routeSelf(team2);

            session.subscribe(channel, new StompFrameHandler() {

                @Override
                public Type getPayloadType(StompHeaders headers) {
                    return Pitch.class;
                }

                @Override
                public void handleFrame(StompHeaders headers, Object payload) {
                    latch.countDown();
                }

            });

            Pitch pitch = new Pitch();
            pitch.setTeam(team1);
            int count = 30;
            while (count-- > 0) {
                session.send("/action/pitch", pitch);
            }

        }, failure);

        connect(sessionHandler, 25);

    }

    @After
    public void tearDown() {
        // @todo disconnect sessions.
    }

    /**
     * @param sessionHandler connect and execute the handler::afterConnect.
     * @param joins number of expected countDowns in the handler to process (fails if not met).
     */
    private void connect(StompSessionHandler sessionHandler, int joins) throws InterruptedException {
        failure = new AtomicReference<>();
        latch = new CountDownLatch(joins);

        stompy.connect("ws://localhost:{port}/match-socks", headers, sessionHandler, port);

        if (latch.await(3, TimeUnit.SECONDS)) {
            if (failure.get() != null) {
                throw new AssertionError("", failure.get());
            }
        } else {
            Assert.fail("No response received");
        }
    }

    private Field field = null;

    private final @FieldId String fieldName = "Tokyo1";
    private Integer teamId = 0;
    private @TeamToken String team() {
        return "Team" + (++teamId).toString() + "_" + fieldName;
    }
    private @TeamToken String team(Integer id) {
        return "Team" + (id).toString() + "_" + fieldName;
    }
    private CountDownLatch latch;
    private AtomicReference<Throwable> failure;

    private @LocalServerPort int port;
    private SockJsClient socky;
    private WebSocketStompClient stompy;

    private final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();

}
