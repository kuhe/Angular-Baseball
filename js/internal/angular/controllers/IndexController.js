app.controller('IndexController', function($scope) {
    $scope.y = null;
    $scope.refresh = function() {
        $scope.y = window.y;
    };
    $scope.indicate = function($event) {
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        y.receiveInput(relativeOffset.x, relativeOffset.y);
        jQ('.indicator.pitch').css({
            top: 200 - relativeOffset.y,
            left: relativeOffset.x
        }).show();
        jQ('.indicator.break').css({
            top: 200 - y.pitchInFlight.y,
            left: y.pitchInFlight.x
        }).show();
        jQ('.indicator.swing').css({
            top: 200 - (y.pitchInFlight.y) + y.swingResult.y,
            left: y.pitchInFlight.x + y.swingResult.x
        }).show();
    };
    $scope.rate = function(rating) {
        if (rating > 95) {
            return 'A+';
        } else if (rating > 90) {
            return 'A';
        } else if (rating > 85) {
            return 'A-';
        } else if (rating > 80) {
            return 'B+';
        } else if (rating > 70) {
            return 'B';
        } else if (rating > 60) {
            return 'C';
        } else if (rating > 50) {
            return 'C-';
        } else {
            return 'D';
        }
    };
    $scope.abbreviatePosition = function(position) {
        return {
            pitcher : 'P',
            catcher : 'C',
            first : '1B',
            second : '2B',
            short : 'SS',
            third : '3B',
            left : 'LF',
            center : 'CF',
            right : 'RF'
        }[position];
    }
});