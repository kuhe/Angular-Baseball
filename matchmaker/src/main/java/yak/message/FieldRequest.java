package yak.message;

import yak.annotation.FieldId;
import yak.annotation.TeamToken;

/**
 *
 * A request for access to a baseball field.
 *
 */
public class FieldRequest extends Message {

    public FieldRequest() {}

    public FieldRequest(final @FieldId String field, final @TeamToken String team) {
        this.field = field;
        this.team = team;
    }

    public @FieldId String field;
    public @TeamToken String team;

    public String type = "field_request";

}
