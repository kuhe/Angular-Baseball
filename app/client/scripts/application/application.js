var app = angular.module('YakyuuAikoukai', ['directives']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}');
});

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective);

angular.module('controllers', [])
    .controller('IndexController', IndexController);