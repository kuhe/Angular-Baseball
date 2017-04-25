package yak;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;

import java.lang.reflect.Type;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiConsumer;

public class TestSessionHandler implements StompSessionHandler {

    public TestSessionHandler(AfterConnected afterConnect,
                              AtomicReference<Throwable> failure) {

        this.afterConnect = afterConnect;
        this.failure = failure;

    }

    /**
     * typedef
     */
    public interface AfterConnected extends BiConsumer<StompSession, StompHeaders> {}

    @Override
    public Type getPayloadType(StompHeaders headers) {
        return Object.class;
    }

    @Override
    public void afterConnected(final StompSession session, StompHeaders connectedHeaders) {
        afterConnect.accept(session, connectedHeaders);
    }

    @Override
    public void handleFrame(StompHeaders headers, Object payload) {

        failure.set(
            new Exception(headers.toString()
        ));

    }

    @Override
    public void handleException(StompSession session,
                                StompCommand command,
                                StompHeaders headers,
                                byte[] payload,
                                Throwable exception) {

        failure.set(exception);

    }

    @Override
    public void handleTransportError(StompSession session, Throwable exception) {

        failure.set(exception);

    }

    private final AtomicReference<Throwable> failure;

    private final AfterConnected afterConnect;


};