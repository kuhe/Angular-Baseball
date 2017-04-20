package yak.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import yak.annotation.TeamToken;
import yak.annotation.Todo;
import yak.message.Pitch;

/**
 *
 * Forward pitch data to the opponent (batter).
 *
 */
@Controller
public class PitchController {

    @MessageMapping("/pitch/{team}")
    @SendTo("/matchmaker/{team}")
    @Todo
    public Pitch response(
            final @DestinationVariable @TeamToken String team,
            final Pitch pitch
    ) {

        // @todo send to opponent, not original sender.

        return new Pitch();
    }

}
