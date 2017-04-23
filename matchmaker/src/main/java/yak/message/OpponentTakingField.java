package yak.message;

import yak.annotation.Todo;

/**
 * A signal to send the game data to the opponent.
 */
@Todo
public class OpponentTakingField extends Message {

    public final String type = "opponent_taking_field";

}
