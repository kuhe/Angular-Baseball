package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import yak.annotation.Todo;
import yak.message.Swing;

/**
 *
 * Forward the swing data to the opponent (battery).
 *
 */
@Todo
public class SwingController extends Base {

    @MessageMapping("/swing")
    public final Swing response(final Swing swing) {

        forwardToOpponent(swing);

        return swing;

    }

}
