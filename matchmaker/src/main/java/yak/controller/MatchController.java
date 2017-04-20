package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import yak.message.State;

@Controller
public class MatchController {

    /**
     *
     * @param message ...
     * @return ...
     *
     */
    @MessageMapping("/state") // Reception route for Stomp.send (prefixed).
    @SendTo("/matchmaker/state") // Stomp client subscribes here (Step 2).
    public State response(State message) {

        return new State();

    }



}
