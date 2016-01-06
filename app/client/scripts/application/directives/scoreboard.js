ScoreboardDirective = function() {
    return {
        scope: {
            game: '=',
            text: '='
        },
        templateUrl: 'public/html/views/directives/scoreboard.html?cache='+cacheKey,
        link: function(scope) {
            window.s2 = scope;
            scope.t = scope.text;
            scope.y = scope.game;
        }
    };
};

(function(app) {
    app.ScoreboardComponent = ng.core
        .Component({
            selector: 'scoreboard',
            templateUrl: ScoreboardDirective().templateUrl,
            inputs: ['y', 't'],
            pipes: [app.ToIterableService]
        })
        .Class({
            constructor: function() {
                window.s2 = this;
                this.expandScoreboard = false;
            }
        });
})(window.app || (window.app = {}));