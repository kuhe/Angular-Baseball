BatteryDirective = function() {
    return {
        //scope: {
        //    game: '=',
        //    text: '='
        //},
        templateUrl: 'public/html/views/directives/battery.html?cache='+cacheKey,
        transclude : true,
        //link: function(scope) {
        //    scope.t = scope.text;
        //    scope.y = scope.game;
        //}
    };
};

(function(app) {
    app.BatteryDataComponent = ng.core
        .Component({
            selector: 'battery-data',
            templateUrl: BatteryDirective().templateUrl,
            inputs : ['y', 't'],
            directives: []
        })
        .Class({
            constructor: function() {
                this.abbreviatePosition = s.abbreviatePosition;
            }
        });
})(window.app || (window.app = {}));