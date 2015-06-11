var Iterator = function() {
};

Iterator.prototype = {
    identifier : 'Iterator',
    constructor : Iterator,
    each : function(collection, map) {
        var keys = Object.keys(collection);
        for (var i = 0; i < keys.length; i++) {
            map(keys[i], collection[keys[i]]);
        }
    }
};

for (var fn in Iterator.prototype) {
    if (Iterator.prototype.hasOwnProperty(fn)) {
        Iterator[fn] = Iterator.prototype[fn];
    }
}

exports.Iterator = Iterator;