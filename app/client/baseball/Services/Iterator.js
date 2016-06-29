const Iterator = () => {
};

Iterator.prototype = {
    identifier : 'Iterator',
    constructor : Iterator,
    each(collection, map) {
        let keys, i;
        if (collection instanceof Array) {
            for (i = 0; i < collection.length; i++) {
                map(i, collection[i]);
            }
        } else {
            keys = Object.keys(collection);
            for (i = 0; i < keys.length; i++) {
                map(keys[i], collection[keys[i]]);
            }
        }
    }
};

for (const fn in Iterator.prototype) {
    if (Iterator.prototype.hasOwnProperty(fn)) {
        Iterator[fn] = Iterator.prototype[fn];
    }
}

export { Iterator }