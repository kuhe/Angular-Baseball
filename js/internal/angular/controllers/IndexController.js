app.controller('IndexController', function($scope) {
    $scope.y = null;
    $scope.refresh = function() {
        $scope.y = window.y;
    };
    $scope.proceedToGame = function() {
        $scope.refresh();
        jQ('.blocking').remove();
    };
    $scope.selectPitch = function($event) {
        if (y.stage == 'pitch') {
            var pitchName = $event.srcElement.attributes.name.nodeValue;
            y.pitchInFlight = jQ.extend({}, y.pitcher.pitching[pitchName]);
            y.pitchInFlight.name = pitchName;
            y.swingResult.looking = true;
        }
    };
    $scope.indicate = function($event) {
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        y.receiveInput(relativeOffset.x, relativeOffset.y);
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
    angular.element(document).ready(function() {
        $scope.refresh();
    });
});