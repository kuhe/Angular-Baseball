(function(app) {

    app.ToIterableService = ng.core
        .Pipe({
            name: 'toIterable'
        })
        .Class({
            constructor: function() {

            },
            transform : function(value) {
                if (typeof value === 'object') {
                    var keys = Object.keys(value);
                    var primitive = window;
                    return keys.map(function(key) {
                        var val = value[key];
                        if (val instanceof Object) {

                        } else {
                            var type = (typeof val).toUpperCase()[0] + (typeof val).slice(1);
                            if (primitive[type]) {
                                val = new primitive[type](val);
                            } else {
                                val = {};
                            }
                        }
                        val.__key = key;
                        return val;
                    });
                }
            }
        });

})(window.app || (window.app = {}));