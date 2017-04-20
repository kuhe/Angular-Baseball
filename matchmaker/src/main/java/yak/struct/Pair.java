package yak.struct;

public class Pair<T, R> {

    public T first = null;
    public R second = null;

    public Pair() {}

    public Pair(T t) {
        first = t;
    }

    public Pair(T t, R r) {
        first = t;
        second = r;
    }

    /**
     * @return number of active members in the pair
     */
    public int size() {
        int size_ = 0;
        if (first != null) ++size_;
        if (second != null) ++size_;
        return size_;
    }

}
