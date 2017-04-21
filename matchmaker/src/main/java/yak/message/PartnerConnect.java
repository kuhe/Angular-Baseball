package yak.message;

import yak.annotation.TeamToken;

public class PartnerConnect extends Message {

    public PartnerConnect(final @TeamToken String opponent) {
        team = opponent;
    }

    public final String type = "partner_connect";

}
