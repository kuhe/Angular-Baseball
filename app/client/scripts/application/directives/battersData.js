BattersDirective = function() {
    return {
        //scope: {
        //    game: '=',
        //    text: '='
        //},
        templateUrl: 'public/html/views/directives/batters.html?cache='+cacheKey,
        transclude : true,
        //link: function(scope) {
        //    scope.t = scope.text;
        //    scope.y = scope.game;
        //}
    };
};

(function(app) {
    app.BattersDataComponent = ng.core
        .Component({
            selector: 'batters-data',
            templateUrl: BattersDirective().templateUrl,
            inputs : ['y', 't']
        })
        .Class({
            constructor: function() {
                this.abbreviatePosition = s.abbreviatePosition;
            }
        });
})(window.app || (window.app = {}));