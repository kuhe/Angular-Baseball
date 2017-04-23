package yak.message;

import java.util.ArrayList;

public class Swing extends Message {

    public final String type = "swing";

    /**
     * Launch angle, 0 being flat forward and 90 being a vertical popup.
     */
    public double angle;

    /**
     * whether there was contact.
     */
    public boolean contact;

    /**
     * True if there was no swing. Necessitates contact being false.
     */
    public boolean looking;

    /**
     * Number of outs 0-3.
     */
    public int outs;

    /**
     * Somewhat abstract, but 0 meaning perfect timing.
     */
    public double timing;

    /**
     * Offset of the swing from the actual ball position, where positive values are to the right (catcher POV).
     */
    public double x;

    /**
     * Offset of the swing from the actual ball position, where positive values are to high (catcher POV).
     */
    public double y;

    public int bases;
    public boolean caught;
    public boolean error;
    public String fielder;
    public double fielderTravel;
    public double fieldingDelay;
    public double flyAngle;
    public boolean outfielder;
    public ArrayList<String> sacrificeAdvances;
    public double splay;
    public boolean thrownOut;
    public int travelDistance;
    public boolean foul;

}
