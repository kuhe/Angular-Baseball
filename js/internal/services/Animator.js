var Animator = function() {
    this.init();
    Math.square = function(x) { return x*x };
};

Animator.prototype = {
    name : 'Animator',
    constructor : Animator,
    init : function() {

    },
    pitchTarget : null,
    pitchBreak : null,
    updateFlightPath: function(callback) {
        var $scope = this;
        var game = $scope.y;
        var top = 200-game.pitchTarget.y;
        var left = game.pitchTarget.x;
        var breakTop = 200-game.pitchInFlight.y,
            breakLeft = game.pitchInFlight.x;
        var $baseballs = jQ('.baseball');
        var flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400;
        var originTop = 50;
        var originLeft = 110 + (game.pitcher.throws == 'left' ? 20 : -20);
        this.pitchTarget = jQ('.main-area .target .baseball.pitch');
        this.pitchBreak = jQ('.main-area .target .baseball.break');
        var pitch = this.pitchTarget, henka = this.pitchBreak;
        var quarter = flightSpeed/4;
        var transition = function(percent, top, left, step) {
            left = originLeft + Math.square(percent/100)*(left - originLeft);
            top = originTop + Math.square(percent/100)*(top - originTop);
            var padding = Math.max(Math.square(percent/100)*13, 1);
            var borderWidth = Math.max(Math.square(percent/100)*4, 1);
            return {
                top: top,
                left: left ,
                padding: padding + 'px',
                borderWidth: borderWidth + 'px',
                transform: 'translateZ(0)',
                delay: quarter * step,
                ease: Linear.easeNone
            };
        };
        var transitions = [
            transition(0, top, left, 0),

            transition(10, top, left, 0),
            transition(30, top, left, 1),
            transition(50, top, left, 2),

            transition(100, top, left, 3),
            transition(100, breakTop, breakLeft, 3)
        ];

        var horizontalBreak = (60 - Math.abs(game.pitchTarget.x - game.pitchInFlight.x))/10;
        jQ('.baseball').addClass('spin');
        jQ('.baseball').css('animation', 'spin '+horizontalBreak+'s 5 0s linear');

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
            if (game.humanBatting() && Math.random()*100 > game.batter.skill.offense.eye) {
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
    }
};