package yak.message;

import yak.annotation.TeamToken;

/**
 * A signal for a client to assume the away or home team control.
 * Delivered when two players have requested the same field, to allow play to start.
 */
public class Register extends Message {

    public Register(final @TeamToken String team, final Side side) {
        setTeam(team);
        this.side = side == Side.away ? "away" : "home";
    }

    public enum Side {
        away,
        home
    }

    public final String side;

    public final String type = "register";

}
