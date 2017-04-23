if (typeof angular === 'object') {

    var app = angular.module('YakyuuAikoukai', ['directives'])
        .controller('IndexController', ['$scope', IndexController]);

    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{{');
        $interpolateProvider.endSymbol('}}');
    });

    angular.module('directives', [])
        .directive('scoreboard', ScoreboardDirective)
        .directive('batters', BattersDirective)
        .directive('battery', BatteryDirective)
        .directive('field', FieldDirective)
        .directive('ratingBlock', RatingBlockDirective)
        .directive('teamFlag', FlagDirective);

} else {

    (function(app) {
        document.addEventListener('DOMContentLoaded', function() {
            ng.core.enableProdMode();
            ng.platformBrowserDynamic.bootstrap(app.Main);
        });
    })(window.app || (window.app = {}));

}