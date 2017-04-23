package yak.message;

import yak.annotation.TeamToken;

/**
 * Event indicating a second team has requested access to the same field,
 * thus allowing play to begin.
 */
public class PartnerConnect extends Message {

    public PartnerConnect(final @TeamToken String team) {
        setTeam(team);
    }

    public final String type = "partner_connect";

}
