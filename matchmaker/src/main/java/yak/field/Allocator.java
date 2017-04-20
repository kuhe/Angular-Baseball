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
public class Allocator {

    private Allocator() {}

    public static Allocator instance = new Allocator();

    /**
     * Attempt to fulfill the field request.
     * @param fieldRequest
     */
    public boolean request(final FieldRequest fieldRequest) {
        return assign(fieldRequest.team, fieldRequest.field);
    }

    /**
     * @param name of the field.
     * @return field with given name, and may provision such a field if it did not exist.
     */
    public Field field(@FieldId String name) {
        return fields.computeIfAbsent(name, (Field) -> new Field(name));
    }

    /**
     * Adds the team to the field, if there is room.
     * @param team name.
     * @param name of the field.
     * @return whether there was room, and the team was assigned. But also true when the team is already on the field.
     */
    public boolean assign(final @TeamToken String team, final @FieldId String name) {
        return assign(team, field(name));
    }
    public boolean assign(final FieldRequest fieldRequest) {
        return assign(fieldRequest.team, fieldRequest.field);
    }
    public boolean assign(final @TeamToken String team, @NotNull Field field) {

        if (field.contains(team)) {
            return true;
        }

        switch (field.size()) {
            case 0:
                field.first = team;
                locations.put(team, field);
                return true;
            case 1:
                field.second = team;
                locations.put(team, field);
                return true;
        }

        return false;

    }

    /**
     * Teams on field one are moved to another.
     */
    public Allocator transfer(Field one, Field another) {
        one.transferTo(another);
        return this;
    }

    /**
     * @return a readable list of fields and their occupants.
     */
    @Todo
    public final String toString() {
        return "";
    }

    /**
     * Fields keyed by name.
     */
    private HashMap<@FieldId String, Field> fields = new HashMap<>();

    /**
     * Fields keyed by team token.
     */
    private HashMap<@TeamToken String, Field> locations = new HashMap<>();

}
