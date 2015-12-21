if (typeof angular === 'object') {

    var app = angular.module('YakyuuAikoukai', ['directives'])
        .service('socket', SocketService)
        .controller('IndexController', ['$scope', 'socket', IndexController]);

    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{{');
        $interpolateProvider.endSymbol('}}');
    });

    angular.module('directives', [])
        .directive('scoreboard', ScoreboardDirective)
        .directive('batters', BattersDirective)
        .directive('battery', BatteryDirective)
        .directive('field', FieldDirective)
        .directive('ratingBlock', RatingBlockDirective);

} else {

    (function(app) {
        document.addEventListener('DOMContentLoaded', function() {
            ng.core.enableProdMode();
            ng.platform.browser.bootstrap(app.Main);
        });
    })(window.app || (window.app = {}));

}