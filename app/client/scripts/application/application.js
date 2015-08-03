var app = angular.module('YakyuuAikoukai', ['directives']);

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective);

angular.module('controllers', [])
    .controller('IndexController', IndexController);

// var socket = io('ws://' + window.location.hostname + ':3000');