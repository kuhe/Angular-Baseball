package yak.message;

import yak.annotation.TeamToken;

public class Message {

    public Message() {}

    public Message(final @TeamToken String team) {
        this.team = team;
    }

    public @TeamToken String team;

    public final String type = "message";

}
