package yak.message;

import yak.annotation.TeamToken;

/**
 * Reverts opponent control to AI.
 * Triggered by socket close from the opposing session id.
 */
public class PartnerDisconnect extends Message {

    public PartnerDisconnect(final @TeamToken String team) {
        setTeam(team);
    }

    public final String type = "partner_disconnect";

}
