package yak.message;

import yak.annotation.FieldId;
import yak.annotation.TeamToken;

/**
 *
 * A request for access to a baseball field.
 *
 */
public class FieldRequest {

    public FieldRequest(final @FieldId String field, final @TeamToken String team) {
        this.field = field;
        this.team = team;
    }

    public final @FieldId String field;
    public final @TeamToken String team;

    public final String type = "FieldRequest";

}
