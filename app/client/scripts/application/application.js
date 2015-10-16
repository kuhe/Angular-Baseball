var app = angular.module('YakyuuAikoukai', ['directives'])
    .service('socket', SocketService)
    .controller('IndexController', ['$scope', 'socket', IndexController]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}');
});

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective)
    .directive('batters', BattersDirective)
    .directive('battery', BatteryDirective);