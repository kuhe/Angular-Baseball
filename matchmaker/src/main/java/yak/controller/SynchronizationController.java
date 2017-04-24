package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import yak.message.GameData;

@Controller
public class SynchronizationController extends Base {

    @MessageMapping("/game_data")
    public final GameData response(GameData data) {

        forwardToOpponent(data);

        return data;

    }

}
