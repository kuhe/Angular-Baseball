package yak.message;

import yak.annotation.TeamToken;

public class PartnerDisconnect extends Message {

    public PartnerDisconnect(final @TeamToken String opponent) {
        setTeam(opponent);
    }

    public final String type = "partner_disconnect";

}
