FlagDirective = function() {
    return {
        scope: {
            rating: '='
        },
        transclude: true,
        templateUrl: 'public/html/views/directives/flag.html?cache='+cacheKey,
        link: function(scope) {
        }
    };
};

(function(app) {
    app.FlagComponent = ng.core
        .Component({
            selector: 'flag',
            templateUrl: FlagDirective().templateUrl,
            inputs: ['team'],
            directives: [ng.common.NgStyle]
        })
        .Class({
            constructor: function() {

            }
        });
})(window.app || (window.app = {}));