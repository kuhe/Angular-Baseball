package yak.message;

import yak.annotation.TeamToken;

/**
 * Represents any websocket traffic payload.
 */
public abstract class Message {

    public Message() {}

    public Message(final @TeamToken String team) {
        this.team = team;
    }

    /*
     * This field is used as the event trigger key on the client.
     */
    public final String type = "message";

    /**
     * Every message is identified by its sender
     * with the @TeamToken team field in addition to the session id.
     */
    private @TeamToken String team;
    public final @TeamToken String getTeam() {
        return team;
    }
    public void setTeam(final @TeamToken String team) {
        this.team = team;
    }

}
