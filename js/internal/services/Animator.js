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
    transitional : function(percent, top, left, step, originLeft, originTop) {
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
    },
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

        var transitional = function(percent, top, left, step) {
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
            transitional(0, top, left, 0),

            transitional(10, top, left, 0),
            transitional(30, top, left, 1),
            transitional(50, top, left, 2),

            transitional(100, top, left, 3),
            transitional(100, breakTop, breakLeft, 3)
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
    },
    translateSwingResultToStylePosition: function(swingResult) {
        // CF HR bottom: 95px, centerline: left: 190px;
        var bottom = 0, left = 190;

        bottom = Math.cos(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300;
        left = Math.sin(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300 + 190;

        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 280), 100);

        swingResult.bottom = bottom + 'px';
        swingResult.left = left + 'px';
        return swingResult;
    },
    memory : {},
    transitionalTrajectory : function(percent, quarter, step, givenApexHeight, givenDistance, givenSplayAngle) {
        if (givenApexHeight) Animator.prototype.memory.apexHeight = givenApexHeight;
        if (givenDistance) Animator.prototype.memory.distance = givenDistance;
        if (givenSplayAngle) Animator.prototype.memory.splay = givenSplayAngle;
        var apexHeight = Animator.prototype.memory.apexHeight,
            distance = Animator.prototype.memory.distance,
            splay = Animator.prototype.memory.splay;
        var bottom, left, padding, borderWidth;
        var bounding = Animator.prototype.memory.bounding;

        bottom = Math.cos(splay / 180 * Math.PI) * percent/100 * distance * 95/300;
        left = Math.sin(splay / 180 * Math.PI) * percent/100 * distance * 95/300 + 190;
        var apexRatio = Math.sqrt((50 - Math.abs(percent - 50))/100)*(1/0.7071);
        if (bounding) {
            padding = 1;
            borderWidth = 1;
        } else {
            padding = apexRatio * apexHeight/90 * 15;
            borderWidth = 1 + (apexRatio * 2);
        }
        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 280), 100);
        return {
            bottom: bottom,
            left: left,
            padding: padding,
            borderWidth: borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        }
    },
    animateFieldingTrajectory: function(game) {
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

        Animator.prototype.memory.bounding = angle < 0;
        angle = 1 + Math.abs(angle);
        if (angle > 90) angle = 180 - angle;

        var velocity = linearApproximateDragScalar.distance * Math.sqrt(9.81 * distance / Math.sin(2*Math.PI*angle/180));
        var apexHeight = velocity*velocity/(2*9.81) * linearApproximateDragScalar.apexHeight;
        var airTime = Math.sqrt(2*apexHeight/9.81) * linearApproximateDragScalar.airTime;

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        var quarter = airTime/4;
        var transitions = [
            this.transitionalTrajectory(0, quarter, 0, apexHeight, scalar * distance, result.splay),
            this.transitionalTrajectory(25, quarter, 0),
            this.transitionalTrajectory(50, quarter, 1),
            this.transitionalTrajectory(75, quarter, 2),
            this.transitionalTrajectory(100, quarter, 3)
        ];
        TweenMax.set(ball, transitions[0]);
        TweenMax.to(ball, quarter, transitions[1]);
        TweenMax.to(ball, quarter, transitions[2]);
        TweenMax.to(ball, quarter, transitions[3]);
        TweenMax.to(ball, quarter, transitions[4]);

        return game.swingResult;
    }
};