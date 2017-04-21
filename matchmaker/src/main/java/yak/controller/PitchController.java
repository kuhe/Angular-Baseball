package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import yak.message.Pitch;

/**
 *
 * Forward pitch data to the opponent (batter).
 *
 */
@Controller
public class PitchController extends Base {

    @MessageMapping("/pitch")
    public final Pitch response(final Pitch pitch) {

        forwardToOpponent(pitch);

        return pitch;

    }

}
