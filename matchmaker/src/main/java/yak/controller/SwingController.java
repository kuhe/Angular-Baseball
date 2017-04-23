package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import yak.message.Swing;

/**
 *
 * Forward the swing data to the opponent (battery).
 *
 */
@Controller
public class SwingController extends Base {

    @MessageMapping("/swing")
    public final Swing response(Swing swing) {

        forwardToOpponent(swing);

        return swing;

    }

}
