RatingBlockDirective = function() {
    return {
        scope: {
            rating: '='
        },
        transclude: true,
        templateUrl: 'public/html/views/directives/ratingBlock.html?cache='+cacheKey,
        link: function(scope) {
        }
    };
};