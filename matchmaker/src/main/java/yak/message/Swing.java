package yak.message;

import yak.annotation.Coordinate;
import yak.annotation.Degrees;
import yak.annotation.Feet;
import yak.annotation.Seconds;

import java.util.ArrayList;

public class Swing extends Message {

    /**
     * Launch angle, 0 being flat forward and 90 being a vertical popup.
     */
    public @Degrees double angle;

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
     * Somewhat abstract, but 0 meaning perfect timing, negative being late, and positive being early.
     * Possibly milliseconds.
     */
    public double timing;

    /**
     * Offset of the swing from the actual ball position, where positive values are to the right (catcher POV).
     */
    public @Coordinate double x;

    /**
     * Offset of the swing from the actual ball position, where positive values are to high (catcher POV).
     */
    public @Coordinate double y;

    /**
     * Resulting bases for the batter.
     */
    public int bases;

    /**
     * Caught fly.
     */
    public boolean caught;

    /**
     * Fielding error occurred.
     */
    public boolean error;

    /**
     * Position name of fielder.
     */
    public String fielder;

    /**
     * Abstract value indicating how far the fielder travelled.
     */
    public @Feet double fielderTravel;

    /**
     * Abstract value for how long fielder took to send the ball to a base.
     */
    public @Seconds double fieldingDelay;

    /**
     * Launch angle, 0 being flat forward and 90 being a vertical popup.
     */
    public @Degrees double flyAngle;

    /**
     * Was fielding by an outfielder.
     */
    public boolean outfielder;

    /**
     * Any runners which advanced on the sacrifice.
     */
    public ArrayList<String> sacrificeAdvances;

    /**
     * Degree foul to foul, with -45 being the left field foul line and 45 being the right.
     */
    public @Degrees double splay;

    /**
     * Runner was thrown out.
     */
    public boolean thrownOut;

    /**
     * How far the ball went (abstract approximation) in feet.
     */
    public @Feet int travelDistance;

    /**
     * Foul ball.
     */
    public boolean foul;

    public final String type = "swing";

}
