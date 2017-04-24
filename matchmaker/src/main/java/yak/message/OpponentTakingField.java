package yak.message;

import yak.annotation.TeamToken;

/**
 * A signal to send the game data to the opponent.
 */
public class OpponentTakingField extends Message {

    public OpponentTakingField(final @TeamToken String team) {
        setTeam(team);
    }

    public final String type = "opponent_taking_field";

}
