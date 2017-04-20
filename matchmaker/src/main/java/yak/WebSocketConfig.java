package yak;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

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

}