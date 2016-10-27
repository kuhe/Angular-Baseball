import { Mathinator } from '../services/_services';
import { Loop } from '../Render/Loop';
import { helper } from '../Utility/helper';

const Animator = function() {
    this.init();
    throw new Error('No need to instantiate Animator');
};
Animator.TweenMax = {};
Animator.prototype = {
    identifier : 'Animator',
    constructor : Animator,
    /**
     * console mode disables most animator functions
     */
    console : false,
    TweenMax : {},
    THREE : {},
    /**
     * anything other than webgl will use TweenMax for JS animations
     */
    renderingMode : 'webgl',
    init() {
        if (Animator.console) return;
        if (!this.loop && this.renderingMode === 'webgl') {
            this.beginRender();
        }
    },
    /**
     * @returns {Loop}
     */
    beginRender() {
        this.background = new Loop('webgl-bg-container', true);
        this.loop = new Loop('webgl-container');

        this.loop.background = this.background;
        this.background.foreground = this.loop;

        return this.loop;
    },
    /**
     * @param level {Number} 0 to 1
     */
    setLuminosity(level) {
        if (this.console) return;
        this.loop.lighting.setLuminosity(level);
        this.background.lighting.setLuminosity(level);
    },
    loadTweenMax() {
        if (this.console || typeof window !== 'object') {
            Animator.TweenMax = {
                'set'() {},
                'to'() {},
                'from'() {},
                killAll() {}
            }
        } else {
            Animator.TweenMax = window.TweenMax;
        }
        return Animator.TweenMax;
    },
    TIME_FROM_SET : 2300, //ms
    TIME_FROM_WINDUP : 3600, //ms
    HOLD_UP_ALLOWANCE : 0.25, // seconds
    pitchTarget : null,
    pitchBreak : null,
    /**
     * this is called with $scope context binding
     * @param callback
     */
    updateFlightPath(callback) {
        if (Animator.console) return;

        if (Animator.renderingMode === 'webgl') {
            return Animator.renderFlightPath(callback, this);
        }
        return Animator.tweenFlightPath(callback, this);
    },
    /**
     * @param callback
     * @param $scope
     * animates the pitch's flight path
     */
    tweenFlightPath(callback, $scope) {
        const TweenMax = Animator.loadTweenMax();
        TweenMax.killAll();
        const game = $scope.y, top = 200-game.pitchTarget.y, left = game.pitchTarget.x, breakTop = 200-game.pitchInFlight.y, breakLeft = game.pitchInFlight.x, $baseballs = $('.baseball'), flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400, originTop = 50, originLeft = 110 + (game.pitcher.throws == 'left' ? 20 : -20);
        const pitch = this.pitchTarget = $('.main-area .target .baseball.pitch'), henka = this.pitchBreak = $('.main-area .target .baseball.break'), quarter = flightSpeed/4;

        const pitchTransition = Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 12, 4), targetTransition = Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 10, 3);

        const transitions = [
            pitchTransition(0, 0),
            pitchTransition(10, 0),
            pitchTransition(30, 1),
            pitchTransition(50, 2),

            targetTransition(100, 3),
            pitchTransition(100, 3, breakTop, breakLeft)
        ];

        TweenMax.set([pitch, henka], transitions[0]);
        TweenMax.to([pitch, henka], quarter, transitions[1]);
        TweenMax.to([pitch, henka], quarter, transitions[2]);
        TweenMax.to([pitch, henka], quarter, transitions[3]);
        TweenMax.to(pitch, quarter, transitions[4]);
        TweenMax.to(henka, quarter, transitions[5]);

        $scope.lastTimeout = setTimeout(() => {
            $scope.allowInput = true;
            if (typeof callback == 'function') {
                callback();
            }
        }, flightSpeed*1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting() && Math.random()*180 > game.batter.skill.offense.eye) {
                $('.baseball.break').addClass('hide');
            } else {
                $('.baseball.break').removeClass('hide');
            }
            $('.baseball.pitch').removeClass('hide');
        }

        if (game.humanBatting() && !game.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(() => {
                $scope.holdUp();
            }, (flightSpeed + Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param callback
     * @param $scope Angular scope
     * webgl version of tweenFlightPath
     */
    renderFlightPath(callback, $scope) {
        const TweenMax = Animator.loadTweenMax();
        TweenMax.killAll();
        const game = $scope.y,
              flightSpeed = Mathinator.getFlightTime(game.pitchInFlight.velocity,
                  helper.pitchDefinitions[game.pitchInFlight.name][2]);

        game.expectedSwingTiming = Date.now() + flightSpeed * 1000;

        if (!this.loop) {
            this.beginRender();
        }
        const ball = new this.loop.constructors.Ball();
        Animator._ball = ball;
        ball.derivePitchingTrajectory(game);
        ball.trajectory = ball.breakingTrajectory;
        ball.join(this.loop);

        $scope.lastTimeout = setTimeout(() => {
            $scope.allowInput = true;
            if (typeof callback === 'function') {
                callback();
            }
        }, flightSpeed * 1000);

        const $baseballs = $('.baseball');
        $baseballs.addClass('hide');

        if (game.humanBatting()) {
            $scope.holdUpTimeouts.push(setTimeout(() => {
                $scope.holdUp();
            }, (flightSpeed + Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param game
     * @returns {*}
     * This only animates the flight arc of the ball in play.
     */
    animateFieldingTrajectory(game) {
        if (Animator.console) return game.swingResult;

        if (this.renderingMode === 'webgl') {
            setTimeout(() => {
                Animator.tweenFieldingTrajectory(game, true);
            }, 50);
            return Animator.renderFieldingTrajectory(game);
        }
        return Animator.tweenFieldingTrajectory(game);
    },
    /**
     * @param game
     * @param splayOnly
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * JS/CSS animation
     */
    tweenFieldingTrajectory(game, splayOnly) {
        const TweenMax = Animator.loadTweenMax();
        let ball = $('.splay-indicator-ball');
        TweenMax.killAll();
        const result = game.swingResult;

        const linearApproximateDragScalar = {
            distance: 1,
            apexHeight: 0.57,
            airTime: 0.96
        };

        let angle = result.flyAngle;
        const distance = Math.abs(result.travelDistance);
        const scalar = result.travelDistance < 0 ? -1 : 1;

        Mathinator.memory.bounding = angle < 0;
        angle = 1 + Math.abs(angle);
        if (angle > 90) angle = 180 - angle;

        const velocity = linearApproximateDragScalar.distance * Math.sqrt(9.81 * distance / Math.sin(2*Math.PI*angle/180));
        const velocityVerticalComponent = Math.sin(Mathinator.RADIAN * angle) * velocity;
        const apexHeight = velocityVerticalComponent*velocityVerticalComponent/(2*9.81) * linearApproximateDragScalar.apexHeight;
        const airTime = 1.5 * Math.sqrt(2*apexHeight/9.81) * linearApproximateDragScalar.airTime; // 2x freefall equation

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        const quarter = airTime/4;
        const mathinator = new Mathinator();
        let transitions = [
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

        if (!splayOnly) {
            ball = $('.indicator.baseball.break').removeClass('hide').show();
            const time = quarter/2;
            transitions = [
                mathinator.transitionalCatcherPerspectiveTrajectory(0, time, 0, apexHeight, scalar * distance,
                    result.splay, game.pitchInFlight),
                mathinator.transitionalCatcherPerspectiveTrajectory(12.5,   time * 0.75, 0),
                mathinator.transitionalCatcherPerspectiveTrajectory(25,     time * 0.80, 1),
                mathinator.transitionalCatcherPerspectiveTrajectory(37.5,   time * 0.85, 2),
                mathinator.transitionalCatcherPerspectiveTrajectory(50,     time * 0.90, 3),
                mathinator.transitionalCatcherPerspectiveTrajectory(62.5,   time * 0.95, 4),
                mathinator.transitionalCatcherPerspectiveTrajectory(75,     time, 5),
                mathinator.transitionalCatcherPerspectiveTrajectory(87.5,   time, 6),
                mathinator.transitionalCatcherPerspectiveTrajectory(100,    time, 7)
            ];
            TweenMax.set(ball, transitions[0]);
            TweenMax.to(ball, time, transitions[1]);
            TweenMax.to(ball, time, transitions[2]);
            TweenMax.to(ball, time, transitions[3]);
            TweenMax.to(ball, time, transitions[4]);
            TweenMax.to(ball, time, transitions[5]);
            TweenMax.to(ball, time, transitions[6]);
            TweenMax.to(ball, time, transitions[7]);
            TweenMax.to(ball, time, transitions[8]);

            setTimeout(() => {
                // hack
                $('.indicator.baseball.break').removeClass('hide').show();
            }, 50);
        }

        return game.swingResult;
    },
    /**
     * @param game
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * WebGL version of tweenFieldingTrajectory
     */
    renderFieldingTrajectory(game) {
        if (!this.loop) {
            this.beginRender();
        }
        const result = game.swingResult;

        const ball = Animator._ball || new this.loop.constructors.Ball();
        ball.deriveTrajectory(result, game.pitchInFlight);
        ball.join(this.loop);

        if (result.thrownOut || result.caught || result.bases) {
            if ((Math.random() < 0.15 && ball.airTime > 1.5)
                ||
                (Math.random() < 0.50 && ball.airTime > 2.5)) {
                //var scale = 1;
                //if (result.splay > 0) {
                //    scale = -1;
                //}
                this.loop.setLookTarget(ball.mesh.position, 0.3);
                this.loop.setOverwatchMoveTarget(ball.mesh.position, 0.16);
            } else {
                this.loop.setLookTarget(ball.mesh.position, 0.5);
                this.loop.setMoveTarget({x: 0, y: 6, z: Loop.INITIAL_CAMERA_DISTANCE}, 0.05);
            }
        } else if (Math.abs(result.splay) < 60) {
            this.loop.setLookTarget(ball.mesh.position, 0.5);
            this.loop.setMoveTarget({x: 0, y: 6, z: Loop.INITIAL_CAMERA_DISTANCE}, 0.05);
        }

        return game.swingResult;
    }
};

for (const fn in Animator.prototype) {
    if (Animator.prototype.hasOwnProperty(fn)) {
        Animator[fn] = Animator.prototype[fn];
    }
}

export { Animator }