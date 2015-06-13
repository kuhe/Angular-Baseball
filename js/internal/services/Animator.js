var Animator = function() {
    this.init();
};

Animator.prototype = {
    identifier : 'Animator',
    constructor : Animator,
    console : false,
    init : function() {

    },
    pitchTarget : null,
    pitchBreak : null,
    updateFlightPath: function(callback) {
        if (Animator.console) return;
        var $scope = this,
            game = $scope.y,
            top = 200-game.pitchTarget.y,
            left = game.pitchTarget.x,
            breakTop = 200-game.pitchInFlight.y,
            breakLeft = game.pitchInFlight.x,
            $baseballs = jQ('.baseball'),
            flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400,
            originTop = 50,
            originLeft = 110 + (game.pitcher.throws == 'left' ? 20 : -20);
        var pitch = this.pitchTarget = jQ('.main-area .target .baseball.pitch'),
            henka = this.pitchBreak = jQ('.main-area .target .baseball.break'),
            quarter = flightSpeed/4;

        var pitchTransition = Mathinator.pitchTransition(top, left, originTop, originLeft, quarter);

        var transitions = [
            pitchTransition(0, 0),
            pitchTransition(10, 0),
            pitchTransition(30, 1),
            pitchTransition(50, 2),

            pitchTransition(100, 3),
            pitchTransition(100, 3, breakTop, breakLeft)
        ];

        //var horizontalBreak = (60 - Math.abs(game.pitchTarget.x - game.pitchInFlight.x))/10;
        //jQ('.baseball').addClass('spin');
        //jQ('.baseball').css('animation', 'spin '+horizontalBreak+'s 5 0s linear');

        TweenMax.set([pitch, henka], transitions[0]);
        TweenMax.to([pitch, henka], quarter, transitions[1]);
        TweenMax.to([pitch, henka], quarter, transitions[2]);
        TweenMax.to([pitch, henka], quarter, transitions[3]);
        TweenMax.to(pitch, quarter, transitions[4]);
        TweenMax.to(henka, quarter, transitions[5]);

        $scope.lastTimeout = setTimeout(function() {
            $scope.allowInput = true;
            if (typeof callback == 'function') {
                callback();
                $scope.$apply();
            }
        }, flightSpeed*1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting() && Math.random()*180 > game.batter.skill.offense.eye) {
                jQ('.baseball.break').addClass('hide');
            } else {
                jQ('.baseball.break').removeClass('hide');
            }
            jQ('.baseball.pitch').removeClass('hide');
        }

        if ($scope.y.humanBatting() && !$scope.y.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(function() {
                $scope.holdUp();
            }, (flightSpeed + 1.2) * 1000));
        }
    },
    animateFieldingTrajectory: function(game) {
        if (Animator.console) return game.swingResult;
        var ball = jQ('.splay-indicator-ball');
        TweenMax.killAll();
        var result = game.swingResult;

        var linearApproximateDragScalar = {
            distance: 1,
            apexHeight: 0.37,
            airTime: 0.66
        };

        var angle = result.flyAngle,
            distance = Math.abs(result.travelDistance),
            scalar = result.travelDistance < 0 ? -1 : 1;

        Mathinator.memory.bounding = angle < 0;
        angle = 1 + Math.abs(angle);
        if (angle > 90) angle = 180 - angle;

        var velocity = linearApproximateDragScalar.distance * Math.sqrt(9.81 * distance / Math.sin(2*Math.PI*angle/180));
        var apexHeight = velocity*velocity/(2*9.81) * linearApproximateDragScalar.apexHeight;
        var airTime = Math.sqrt(2*apexHeight/9.81) * linearApproximateDragScalar.airTime;

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        var quarter = airTime/4;
        var mathinator = new Mathinator();
        var transitions = [
            mathinator.transitionalTrajectory(0, quarter, 0, apexHeight, scalar * distance, result.splay),
            mathinator.transitionalTrajectory(25, quarter, 0),
            mathinator.transitionalTrajectory(50, quarter, 1),
            mathinator.transitionalTrajectory(75, quarter, 2),
            mathinator.transitionalTrajectory(100, quarter, 3)
        ];
        TweenMax.set(ball, transitions[0]);
        TweenMax.to(ball, quarter, transitions[1]);
        TweenMax.to(ball, quarter, transitions[2]);
        TweenMax.to(ball, quarter, transitions[3]);
        TweenMax.to(ball, quarter, transitions[4]);

        return game.swingResult;
    }
};

for (var fn in Animator.prototype) {
    if (Animator.prototype.hasOwnProperty(fn)) {
        Animator[fn] = Animator.prototype[fn];
    }
}

exports.Animator = Animator;