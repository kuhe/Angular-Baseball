package yak.message;

import yak.annotation.TeamToken;

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
