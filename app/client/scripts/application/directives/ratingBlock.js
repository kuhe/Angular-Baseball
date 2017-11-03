import ng from '@angular/core';

const RatingBlockDirective = function() {
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

(function(app) {
    app.RatingBlockComponent = ng.core
        .Component({
            selector: 'rating-block',
            templateUrl: RatingBlockDirective().templateUrl,
            inputs: ['rating'],
            directives: [ng.common.NgStyle]
        })
        .Class({
            constructor: function() {
            }
        });
})(window.app || (window.app = {}));

export default RatingBlockDirective;
