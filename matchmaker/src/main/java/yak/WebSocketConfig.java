package yak;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
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

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/matchmaker"); // @todo root of Stomp subscription in step 2?
        config.setApplicationDestinationPrefixes("/action"); // Stomp.send target root (Step 3).
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/match-socks") // SockJS client initializes against this route (Step 1).
                .setAllowedOrigins(
                        "http://kuhe.github.io",
                        "http://localhost:63342",
                        "*"
                )
                .withSockJS();
    }

    /**
     * @see <a href="https://github.com/savaskoc/WebSocketTest/blob/master/src/main/java/com/savaskoc/wstest/WebSocketConfig.java"></a>
     */
    @EventListener
    public void onSocketConnected(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("[Connected] " + sha.getSessionId());
    }

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

    @EventListener
    public void onSocketSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        final @TeamToken String team = sha.getDestination().substring(Base.matchmaker.length());
        Organizer.instance.add(team, sha.getSessionId());
    }

}