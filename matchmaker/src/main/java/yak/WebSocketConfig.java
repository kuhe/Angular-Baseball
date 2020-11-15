package yak;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import yak.annotation.TeamToken;
import yak.controller.Base;
import yak.field.Organizer;
import yak.message.PartnerDisconnect;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    /**
     * Clients will subscribe to /matchmaker/{TeamToken} and send traffic to /action/{EventType}
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/matchmaker"); // @todo root of Stomp subscription in step 2?
        config.setApplicationDestinationPrefixes("/action"); // Stomp.send target root (Step 3).
    }

    /**
     * Currently unrestricted access to the EB url.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/match-socks") // SockJS client initializes against this route (Step 1).
                .setAllowedOrigins(
                        "http://kuhe.github.io",
                        "https://kuhe.github.io",
                        "http://localhost:4200",
                        "http://localhost:63342",
                        "*"
                )
                .withSockJS();
    }

    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setSendBufferSizeLimit(50000);
        registration.setMessageSizeLimit(50000);
    }

    /**
     * @see <a href="https://github.com/savaskoc/WebSocketTest/blob/master/src/main/java/com/savaskoc/wstest/WebSocketConfig.java"></a>
     * No action taken on connect, until subscription.
     */
    @EventListener
    public void onSocketConnected(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("[Connected] " + sha.getSessionId());
    }

    /**
     * Inform the disconnecting user's opponent.
     * @param event indicating which user has disconnected.
     */
    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("[Disonnected] " + sha.getSessionId());

        Organizer org = Organizer.instance;

        final @TeamToken String disconnecter = org.team(sha.getSessionId());
        final @TeamToken String opponent = org.opponent(disconnecter);

        if (opponent != null) {
            Base.send(new PartnerDisconnect(opponent));
        }

        org.remove(sha.getSessionId());
    }

    /**
     * Register the session id as an active player/TeamToken.
     * No [metaphorical baseball] field is assigned until reception of the field-request action.
     * @param event with session id.
     */
    @EventListener
    public void onSocketSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        final @TeamToken String team = sha.getDestination().substring(Base.matchmaker.length());
        Organizer.instance.add(team, sha.getSessionId());
    }

}