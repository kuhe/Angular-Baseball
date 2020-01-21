/**
 *
 * Historically this was used to provide K-V iteration to
 * Angular 2's early versions.
 *
 */
class Iterator {
    public static each<T>(collection: T[], map: (index: number, value: T) => void): void;
    public static each<K extends string | number, V>(
        collection: Record<K, V>,
        map: (index: K, value: V) => void
    ): void;

    public static each<T, K extends string | number, V>(
        collection: Record<K, V> | T[],
        map: (index: number | K, value: T | V) => void
    ) {
        let keys, i;
        if (collection instanceof Array) {
            for (i = 0; i < collection.length; i++) {
                map(i, collection[i]);
            }
        } else {
            keys = Object.keys(collection);
            for (i = 0; i < keys.length; i++) {
                map(keys[i] as K, collection[keys[i] as keyof typeof collection]);
            }
        }
    }
}

export { Iterator };
