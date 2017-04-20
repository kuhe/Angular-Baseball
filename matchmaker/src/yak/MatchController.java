package yak;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import yak.message.State;

@Controller
public class MatchController {

    @MessageMapping("/state")
    @SendTo("/game")
    public State response(State message) throws Exception {

        Thread.sleep(1000);

        return new State();

    }

}
