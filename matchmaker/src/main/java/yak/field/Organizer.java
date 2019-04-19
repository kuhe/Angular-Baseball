package yak.field;

import yak.annotation.FieldId;
import yak.annotation.TeamToken;
import yak.annotation.Todo;
import yak.message.FieldRequest;

import javax.validation.constraints.NotNull;
import java.util.HashMap;

/**
 *
 * The organizer assigns players to available fields.
 *
 */
public class Organizer {

    private Organizer() {}

    public static Organizer instance = new Organizer();

    /**
     * Attempt to fulfill the field request.
     * @param fieldRequest
     */
    public boolean request(final FieldRequest fieldRequest) {
        return assign(fieldRequest.getTeam(), fieldRequest.field);
    }

    /**
     * @param name of the field.
     * @return field with given name, and may provision such a field if it did not exist.
     */
    public Field field(final @FieldId String name) {
        return fields.computeIfAbsent(name, (Field) -> new Field(name));
    }

    /**
     * @param team token.
     * @return team token of the opponent.
     */
    public final @TeamToken String opponent(final @TeamToken String team) {
        return teamField(team).opponent(team);
    }

    /**
     * @param team name.
     * @return field on which the given teamField is playing.
     */
    public Field teamField(final @TeamToken String team) {
        return locations.get(team);
    }

    /**
     * Adds the teamField to the field, if there is room.
     * @param team name.
     * @param name of the field.
     * @return whether there was room, and the teamField was assigned. But also true when the teamField is already on the field.
     */
    public boolean assign(final @TeamToken String team, final @FieldId String name) {
        return assign(team, field(name));
    }
    public boolean assign(final FieldRequest fieldRequest) {
        return assign(fieldRequest.getTeam(), fieldRequest.field);
    }
    public boolean assign(final @TeamToken String team, @NotNull Field field) {

        boolean result = field.add(team);
        if (result) {
            locations.put(team, field);
        }
        return result;

    }

    /**
     * Remove the teamField from their field of play.
     * @param team token.
     * @return whether a deletion did occur.
     */
    public boolean unassign(final @TeamToken String team) {
        Field field = teamField(team);
        boolean result = false;
        if (field != null) {
            result = field.remove(team);
            locations.remove(team);
        }
        return result;
    }

    /**
     * Teams on field one are moved to another.
     */
    public Organizer transfer(Field one, Field another) {
        one.transferTo(another);
        return this;
    }

    /**
     * @return a readable list of fields and their occupants.
     */
    public final String toString() {
        String output = "";

        for (@FieldId String key : fields.keySet()) {
            Field field = fields.get(key);
            output += field.toString() + "\n";
        }

        return output;
    }

    /**
     * Register a session ID with a team token (1-to-1).
     */
    public void add(final @TeamToken String team, final String sessionId) {
        teamSession.put(team, sessionId);
        sessionTeam.put(sessionId, team);
    }

    /**
     * De-register a session ID and its associated team token.
     */
    public void remove(final String sessionId) {
        final @TeamToken String team = sessionTeam.get(sessionId);
        sessionTeam.remove(sessionId);
        teamSession.remove(team);
        unassign(team);
    }

    public final @TeamToken String team(final String sessionId) {
        return sessionTeam.get(sessionId);
    }

    /**
     * Fields keyed by name.
     */
    private HashMap<@FieldId String, Field> fields = new HashMap<>();

    /**
     * Fields keyed by teamField token.
     */
    private HashMap<@TeamToken String, Field> locations = new HashMap<>();

    /**
     * Teams keyed by session id, and inverse.
     */
    private HashMap<@TeamToken String, String> teamSession = new HashMap<>();
    private HashMap<String, @TeamToken String> sessionTeam = new HashMap<>();


}
