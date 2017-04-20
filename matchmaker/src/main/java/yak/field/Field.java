package yak.field;

import yak.annotation.FieldId;
import yak.annotation.TeamToken;
import yak.struct.Pair;

/**
 *
 * A field identifies itself (@FieldId String name) and identifies up to two occupants (@OccupantId String).
 *
 */
public class Field extends Pair<@TeamToken String, @TeamToken String> {

    public Field(final @FieldId String name) {
        this.name = name;
    }

    public Field(final Field other) {
        first = other.first;
        second = other.second;
        name = other.name;
    }

    public final String away = "away";
    public final String home = "home";
    public final String notPresent = "not present";

    public Field transferTo(Field other) {
        other.first = first;
        other.second = second;
        first = second = null;
        return other;
    }

    public Field transferFrom(Field other) {
        first = other.first;
        second = other.second;
        other.second = other.first = null;
        return this;
    }

    /**
     * @return Whether the team is on the field.
     */
    public boolean contains(final @TeamToken String team) {
        return first.equals(team) || second.equals(team);
    }

    /**
     * @return where is the team on this field?
     */
    public final String positionOf(final @TeamToken String team) {
        if (first.equals(team)) {
            return away;
        }
        if (second.equals(team)) {
            return home;
        }
        return notPresent;
    }

    public final @FieldId String name;

}
