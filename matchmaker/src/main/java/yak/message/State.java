package yak.message;

public class State {

    public State() {
        status = "nominal";
    }

    public State(final String name) {
        this.status = name;
    }

    public final String status;

    public final String type = "State";

}
