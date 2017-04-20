package yak.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import yak.annotation.FieldId;
import yak.annotation.TeamToken;
import yak.field.Field;
import yak.field.Allocator;
import yak.message.FieldRequest;
import yak.message.State;

@Controller
public class GroundsController {

    @MessageMapping("/field-request/{team}/{field}") // Reception route for Stomp.send (prefixed).
    @SendTo("/matchmaker/{team}") // client subscribes here (Step 2).
    public State response(
            final @DestinationVariable @TeamToken String team,
            final @FieldId String field
    ) {
        boolean result = allocator.request(new FieldRequest(field, team));
        final Field fieldOfPlay = allocator.field(field);

        return new State(fieldOfPlay.positionOf(team));
    }

    private static Allocator allocator = Allocator.instance;

}
