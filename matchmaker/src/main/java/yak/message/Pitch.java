package yak.message;
import yak.annotation.Coordinate;
import yak.annotation.Rating;

import java.util.List;

/**
 * Pitch data forwarded to the opponent.
 */
public class Pitch extends Message {

    /**
     * Where the pitch was aimed or set up, not necessarily where it goes.
     */
    public class Target {
        public @Coordinate double x;
        public @Coordinate double y;
    }

    /**
     * Actual pitch position, vs. Target.
     */
    public class InFlight {

        public @Rating int velocity;

        /**
         * Severity of the breaking ball movement.
         */
        private @Rating int _break;
        public int getBreak() {
            return _break;
        }
        public void setBreak(int b) {
            _break = b;
        }

        /**
         * Precision toward actual vs target location.
         */
        public @Rating int control;

        /**
         * E.g. four-seam.
         */
        public String name;

        /**
         * @deprecated
         * Only used by the client side iterator.
         */
        public String key;

        /**
         * Also an X, Y pair.
         */
        public List<@Coordinate Integer> breakDirection = null;

        /**
         * Actual location crossing the plate, contrast Target.
         */
        public @Coordinate int x;
        public @Coordinate int y;

    }

    public InFlight inFlight;
    public Target target;

    public final String type = "pitch";

}
