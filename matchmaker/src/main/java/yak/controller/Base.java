package yak.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import yak.annotation.TeamToken;
import yak.field.Field;
import yak.field.Organizer;
import yak.message.Message;

@Controller
public class Base {

    public Base() {}

    @Autowired
    public Base(SimpMessagingTemplate template) {
        messagingTemplate = template;
    }

    public static final String matchmaker = "/matchmaker/";

    public void forwardToOpponent(final Message msg) {

        final @TeamToken String team = msg.getTeam();
        final Field field = organizer.teamField(team);

        if (field != null) {
            final @TeamToken String opponent = field.opponent(team);

            msg.setTeam(opponent);

            if (opponent != null) {
                messagingTemplate.convertAndSend(routeSelf(opponent), msg);
            } else {
                debug("Opponent not found for " + team);
            }
        } else {
            debug("Field not found for " + team);
        }

    }

    /**
     * @param team token.
     * @return messaging path of the opponent.
     */
    public static String routeOpponent(final @TeamToken String team) {
        return matchmaker + organizer.opponent(team);
    }

    /**
     * @param team token.
     * @return own messaging path.
     */
    public static String routeSelf(final @TeamToken String team) {
        return matchmaker + team;
    }

    /**
     * Statically send a simple message to msg.team.
     */
    public static void send(final Message msg) {
        messagingTemplate.convertAndSend(routeSelf(msg.getTeam()), msg);
    }

    protected static SimpMessagingTemplate messagingTemplate;

    protected static Organizer organizer = Organizer.instance;

    protected void debug(Object info) {
        System.out.println(info);
    }

}