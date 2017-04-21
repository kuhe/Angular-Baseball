package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import yak.annotation.TeamToken;
import yak.field.Field;
import yak.message.FieldRequest;
import yak.message.PartnerConnect;
import yak.message.State;

@Controller
public class GroundsController extends Base {

    @MessageMapping("/field_request")
    public State response(final FieldRequest fr) {

        boolean assigned = organizer.request(fr);
        final Field field = organizer.field(fr.field);
        final @TeamToken String team = fr.team;

        System.out.println(field.toString());

        State answer = new State(field.positionOf(team));
        messagingTemplate.convertAndSend(routeSelf(team), answer);

        final @TeamToken String opponent = field.opponent(team);

        if (field.full() && assigned) {
            // field request has filled the field.
            Base.send(new PartnerConnect(opponent));
            Base.send(new PartnerConnect(team));
        }

        return answer;

    }

}
