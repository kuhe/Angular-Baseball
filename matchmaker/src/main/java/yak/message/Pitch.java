package yak.message;
import java.util.List;

public class Pitch extends Message {

    public class InFlight {

        public int velocity;

        private int _break;
        public int getBreak() {
            return _break;
        }
        public void setBreak(int b) {
            _break = b;
        }

        public int control;
        public String name;
        public String key;
        public List<Integer> breakDirection = null;
        public int x;
        public int y;

    }

    public class Target {

        public double x;
        public double y;

    }

    public InFlight inFlight;
    public Target target;

    public final String type = "pitch";

}
