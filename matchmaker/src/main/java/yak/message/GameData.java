package yak.message;

import yak.annotation.Todo;

/**
 * Used to transfer the game state to the secondary connection as synchronization.
 */
@Todo
public class GameData extends Message {

    public final String type = "game_data";
    public String json;

}
