import { Mathinator } from './Mathinator';
import { Loop } from '../Render/Loop';
import { helper } from '../Utility/helper';
import { INITIAL_CAMERA_DISTANCE } from '../Render/LoopConstants';
import { ratio_t } from '../Api/math';
import { THREE_t, TweenMax_t } from '../Api/externalRenderer';
import { Game } from '../Model/Game';
import { Ball } from '../Render/Mesh/Ball';
import { pitches_t } from '../Api/pitches';
import { swing_result_t } from '../Api/swingResult';

declare var $: any;

class Animator {
    /**
     * console mode disables most animator functions
     */
    public static console: boolean;

    public static TweenMax: TweenMax_t | null = null;
    public static THREE: THREE_t | null = null;

    public static loop: Loop;
    public static background: Loop & {
        foreground: Loop;
    };

    public static readonly TIME_FROM_SET = 2300; //ms
    public static readonly TIME_FROM_WINDUP = 3600; //ms
    public static readonly HOLD_UP_ALLOWANCE = 0.25; // seconds
    public static readonly pitchTarget = null;
    public static readonly pitchBreak = null;
    public static _ball: Ball;

    /**
     * anything other than webgl will use TweenMax for JS animations
     */
    public static readonly renderingMode: 'webgl' = 'webgl';

    public static init() {
        if (Animator.console) return;
        if (!Animator.loop && Animator.renderingMode === 'webgl') {
            Animator.beginRender();
        }
    }

    /**
     * @returns main foreground loop.
     */
    public static beginRender() {
        Animator.background = new Loop('webgl-bg-container', true, Animator);
        Animator.loop = new Loop('webgl-container', false, Animator);

        Animator.loop.background = Animator.background;
        Animator.background.foreground = Animator.loop;

        return Animator.loop;
    }

    /**
     * Sunlight level, basically.
     * @param level - 0 to 1.
     */
    public static setLuminosity(level: ratio_t) {
        if (Animator.console) return;
        Animator.loop.lighting.setLuminosity(level);
        Animator.background.lighting.setLuminosity(level);
    }

    /**
     * Lazy-load of TweenMax.
     */
    public static loadTweenMax() {
        if (Animator.console || typeof window !== 'object') {
            Animator.TweenMax = {
                set() {},
                to() {},
                from() {},
                killAll() {}
            };
        } else {
            Animator.TweenMax = ((window as unknown) as { TweenMax: TweenMax_t }).TweenMax;
        }
        return Animator.TweenMax;
    }

    /**
     * Animator is called with $scope context binding
     * @param callback
     */
    public static updateFlightPath(callback: () => void) {
        if (Animator.console) return;

        return Animator.renderFlightPath(callback, Animator);
    }

    /**
     * @param callback
     * @param $scope Angular scope
     * webgl version of tweenFlightPath
     */
    public static renderFlightPath(callback: () => void, $scope: any) {
        const TweenMax = Animator.loadTweenMax();
        TweenMax.killAll();
        const game = $scope.y,
            flightSpeed = Mathinator.getFlightTime(
                game.pitchInFlight.velocity,
                helper.pitchDefinitions[game.pitchInFlight.name as pitches_t][2]
            );

        game.expectedSwingTiming = Date.now() + flightSpeed * 1000;

        if (!Animator.loop) {
            Animator.beginRender();
        }
        const ball = new Animator.loop.constructors.Ball();
        Animator._ball = ball;
        ball.derivePitchingTrajectory(game);
        ball.trajectory = ball.breakingTrajectory;
        ball.join(Animator.loop);

        $scope.lastTimeout = setTimeout(() => {
            $scope.allowInput = true;
            if (typeof callback === 'function') {
                callback();
            }
        }, flightSpeed * 1000);

        const $baseballs = $('.baseball');
        $baseballs.addClass('hide');

        if (game.humanBatting()) {
            $scope.holdUpTimeouts.push(
                setTimeout(() => {
                    $scope.holdUp();
                }, (flightSpeed + Animator.HOLD_UP_ALLOWANCE) * 1000)
            );
        }
    }

    /**
     * @param game
     * @returns {*}
     * Animator only animates the flight arc of the ball in play.
     */
    public static animateFieldingTrajectory(game: Game) {
        if (Animator.console) return game.swingResult;

        setTimeout(() => {
            Animator.tweenFieldingTrajectory(game);
        }, 50);
        return Animator.renderFieldingTrajectory(game);
    }

    /**
     * Formerly handled the CSS/JS animation for the ball, but that was taken over
     * by WebGL.
     *
     * @param game
     * @returns swing result
     */
    public static tweenFieldingTrajectory(game: Game): swing_result_t {
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

        const velocity =
            linearApproximateDragScalar.distance *
            Math.sqrt((9.81 * distance) / Math.sin((2 * Math.PI * angle) / 180));
        const velocityVerticalComponent = Math.sin(Mathinator.RADIAN * angle) * velocity;
        const apexHeight =
            ((velocityVerticalComponent * velocityVerticalComponent) / (2 * 9.81)) *
            linearApproximateDragScalar.apexHeight;
        const airTime =
            1.5 * Math.sqrt((2 * apexHeight) / 9.81) * linearApproximateDragScalar.airTime; // 2x freefall equation

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        const quarter = airTime / 4;
        const mathinator = Mathinator;
        let transitions = [
            mathinator.transitionalTrajectory(
                0,
                quarter,
                0,
                apexHeight,
                scalar * distance,
                result.splay
            ),
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

    /**
     * @param game
     * @returns swing result.
     * WebGL animation frames of the batted ball's flight and/or bounce path.
     */
    public static renderFieldingTrajectory(game: Game) {
        if (!Animator.loop) {
            Animator.beginRender();
        }
        const result = game.swingResult;

        const ball = Animator._ball || new Animator.loop.constructors.Ball();
        ball.deriveTrajectory(result, game.pitchInFlight);
        ball.join(Animator.loop);

        if (result.thrownOut || result.caught || result.bases) {
            if (
                (Math.random() < 0.15 && ball.airTime > 1.5) ||
                (Math.random() < 0.5 && ball.airTime > 2.5)
            ) {
                var scale = 1;
                if (result.splay > 0) {
                    scale = -1;
                }
                Animator.loop.setLookTarget(ball.mesh.position, 0.3);
                Animator.loop.setOverwatchMoveTarget(ball.mesh.position, 0.32);
            } else {
                Animator.loop.setLookTarget(ball.mesh.position, 0.5);
                Animator.loop.setMoveTarget({ x: 0, y: 6, z: INITIAL_CAMERA_DISTANCE }, 0.05);
            }
        } else if (Math.abs(result.splay) < 60) {
            Animator.loop.setLookTarget(ball.mesh.position, 0.5);
            Animator.loop.setMoveTarget({ x: 0, y: 6, z: INITIAL_CAMERA_DISTANCE }, 0.05);
        }

        return game.swingResult;
    }
}

export { Animator };
