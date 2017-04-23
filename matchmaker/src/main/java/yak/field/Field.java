package yak.field;

import yak.annotation.FieldId;
import yak.annotation.TeamToken;
import yak.struct.Pair;

import java.text.MessageFormat;

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

    public final String away = "away"; // Pair::first.
    public final String home = "home"; // Pair::second.
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
     * @param team name.
     * @return opponent name of the given teamField, provided they are playing on the field.
     */
    public final @TeamToken String opponent(final @TeamToken String team) {
        if (team.equals(first)) {
            return second;
        }
        if (team.equals(second)) {
            return first;
        }
        return null;
    }

    /**
     * @param team to be removed.
     * @return whether removal did occur.
     */
    public boolean remove(final @TeamToken String team) {
        boolean deletion = false;
        if (team.equals(first)) {
            first = null;
            deletion = true;
        }
        if (team.equals(second)) {
            second = null;
            deletion = true;
        }
        return deletion;
    }

    /**
     * @param team to be added.
     * @return whether team is now on the field.
     */
    public boolean add(final @TeamToken String team) {

        if (contains(team)) {
            return true;
        }

        switch (size()) {
            case 0:
                second = team;
                return true;
            case 1:
                if (first != null) {
                    second = team;
                } else {
                    first = team;
                }
                return true;
        }

        return false;
    }

    /**
     * @return Whether the teamField is on the field.
     */
    public boolean contains(final @TeamToken String team) {
        return team.equals(first) || team.equals(second);
    }

    /**
     * @return where is the teamField on this field?
     */
    public final String positionOf(final @TeamToken String team) {
        if (team.equals(first)) {
            return away;
        }
        if (team.equals(second)) {
            return home;
        }
        return notPresent;
    }

    public final @FieldId String name;

    public final String toString() {

        return MessageFormat.format("field: {0}, away: {1}, home: {2}", name, first, second);

    }

    /**
     * @return whether field is fully occupied (home and away teams).
     */
    public boolean full() {
        return size() == 2;
    }

}
