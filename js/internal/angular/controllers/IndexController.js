app.controller('IndexController', function($scope) {
    window.s = $scope;
    $scope.y = new Game();
    $scope.proceedToGame = function() {
        jQ('.blocking').remove();
    };
    $scope.selectPitch = function(pitchName) {
        if ($scope.y.stage == 'pitch') {
            $scope.y.pitchInFlight = jQ.extend({}, $scope.y.pitcher.pitching[pitchName]);
            $scope.y.pitchInFlight.name = pitchName;
            $scope.y.swingResult.looking = true;
        }
    };
    $scope.indicate = function($event) {
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        $scope.y.receiveInput(relativeOffset.x, relativeOffset.y);
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
    };
});