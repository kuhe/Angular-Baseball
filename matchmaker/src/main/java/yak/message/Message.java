package yak.message;

import yak.annotation.TeamToken;

public class Message {

    public Message() {}

    public Message(final @TeamToken String team) {
        this.team = team;
    }

    public final String type = "message";

    private @TeamToken String team;

    public final @TeamToken String getTeam() {
        return team;
    }

    public void setTeam(final @TeamToken String team) {
        this.team = team;
    }

}
