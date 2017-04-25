package yak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import yak.annotation.TeamToken;
import yak.field.Field;
import yak.message.*;

@Controller
public class GroundsController extends Base {

    @MessageMapping("/field_request")
    public void response(final FieldRequest fr) {

        boolean assigned = organizer.request(fr);
        final Field field = organizer.field(fr.field);
        final @TeamToken String team = fr.getTeam();

        debug(field.toString());

        final @TeamToken String opponent = field.opponent(team);

        if (field.full() && assigned) {
            // field request has filled the field.
            Base.send(new PartnerConnect(opponent));
            Base.send(new PartnerConnect(team));

            Base.send(new OpponentTakingField(opponent));

            switch (field.positionOf(team)) {
                case "away":
                    Base.send(new Register(team, Register.Side.away));
                    Base.send(new Register(opponent, Register.Side.home));
                    break;
                case "home":
                    Base.send(new Register(team, Register.Side.home));
                    Base.send(new Register(opponent, Register.Side.away));
                    break;
            }
        }

    }

}
