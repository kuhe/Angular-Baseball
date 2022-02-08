import { AbstractMesh } from './AbstractMesh';
import { Mathinator } from '../../Services/Mathinator';
import { Indicator } from './Indicator';
import { helper } from '../../Utility/helper';
import { VERTICAL_CORRECTION } from '../LoopConstants';
import { Loop } from '../Loop';
import { THREE, VECTOR3 } from '../../Api/externalRenderer';
import { Game } from '../../Model/Game';
import { swing_result_t } from '../../Api/swingResult';
import { pitch_in_flight_t } from '../../Api/pitchInFlight';
import { pitches_t } from '../../Api/pitches';
import { degrees_t, feet_t, fps_t, fpss_t, splay_t } from '../../Api/math';
import { Mesh } from 'three';

/**
 * on the DOM the pitch zone is 200x200 pixels
 * here we scale the strike zone to 4.2 units (feet)
 * for display purposes. It is only approximately related to actual pitch zone dimensions.
 */
const SCALE = 2.1 / 100;

const INDICATOR_DEPTH = -5;

/**
 * Baseball, that is.
 */
class Ball extends AbstractMesh {
    public static readonly DEFAULT_RPM = 1000;
    public static readonly RPM = 1000;
    public static readonly RPS = 1000 / 60;
    public static readonly RP60thOfASecond = 1000 / 60 / 60;
    public static readonly rotation = {
        x: (Ball.RP60thOfASecond * 360 * Math.PI) / 180, // in radians per 60th of a second
        y: (Ball.RP60thOfASecond * 360 * Math.PI) / 180
    };

    public airTime: number;

    public RPM: number = 0;
    public RPS: number = 0;
    public RP60thOfASecond: number = 0;
    public rotation: {
        x: number;
        y: number;
    } = {
        x: 0,
        y: 0
    };
    public hasIndicator = false;
    public breakingTrajectory: VECTOR3[] = [];

    /**
     *
     * @param loop
     * @param trajectory - incremental vectors applied each frame
     * e.g. for 1 second of flight time there should be 60 incremental vectors
     */
    constructor(loop?: Loop | VECTOR3[], public trajectory: VECTOR3[] = []) {
        super();
        if (!(loop && (loop as Loop).loop) && loop instanceof Array) {
            this.trajectory = loop as VECTOR3[];
        }
        this.trajectory = trajectory ? trajectory : [];
        this.getMesh();
        if (loop && (loop as Loop).loop) {
            this.join(loop as Loop);
        }
        this.setType('4-seam', 1);
    }

    public getMesh(): Mesh {
        /** @see threex.sportballs */
        const baseURL = 'public/';
        const loader = new THREE.TextureLoader();
        const textureColor = loader.load(`${baseURL}images/BaseballColor.jpg`);
        const textureBump = loader.load(`${baseURL}images/BaseballBump.jpg`);
        const geometry = new THREE.SphereGeometry(0.36, 32, 16); // real scale is 0.12
        const material = new THREE.MeshPhongMaterial({
            map: textureColor,
            bumpMap: textureBump,
            bumpScale: 0.01
        });
        this.mesh = new THREE.Mesh(geometry, material);
        return this.mesh;
    }

    /**
     * Leave an indicator when crossing the home plate front plane,
     * and rotate while moving (default 1000 RPM)
     */
    public animate(): void {
        const frame = this.trajectory.shift(),
            pos = this.mesh.position;

        if (frame) {
            pos.x += frame.x;
            pos.y += frame.y;
            pos.z += frame.z;
            if (frame.x + frame.y + frame.z !== 0) {
                this.rotate();
            }
        }
        if (pos.z > INDICATOR_DEPTH && !this.hasIndicator) {
            this.spawnIndicator();
        }
        if (!frame) {
            this.detach();
            this.loop.resetCamera();
        }
    }

    /**
     * @param type
     * @param handednessScalar - inverts for left-handedness, I think.
     */
    public setType(type: pitches_t, handednessScalar?: 1 | -1): void {
        const rpm = helper.pitchDefinitions[type][4];
        const rotationAngle = helper.pitchDefinitions[type][3];
        this.setRotation(rpm, rotationAngle * (handednessScalar || 1));
    }

    public rotate(): void {
        const rotation = this.rotation;
        const meshRotation = this.mesh.rotation;
        meshRotation.x += rotation.x;
        meshRotation.y += rotation.y;
    }

    /**
     * Look for the seams!
     * @param rpm
     * @param rotationAngle
     */
    public setRotation(rpm: number, rotationAngle: degrees_t): void {
        this.RPM = rpm;
        this.RPS = this.RPM / 60;
        const rotationalIncrement = (this.RP60thOfASecond = this.RPS / 60);

        // calculate rotational components
        // +x is CCW along x axis increasing
        // +y is CW along y axis increasing
        // +z (unused) is CW along z axis increasing

        // 0   --> x:1 y:0
        // 45  --> x:+ y:+
        // 90  --> x:0 y:1
        // 180 --> x:-1 y:0

        const xComponent = rotationalIncrement * Math.cos((rotationAngle / 180) * Math.PI);
        const yComponent = rotationalIncrement * Math.sin((rotationAngle / 180) * Math.PI);

        this.rotation = {
            x: (xComponent * 360 * Math.PI) / 180,
            y: (yComponent * 360 * Math.PI) / 180
        };
    }

    public exportPositionTo(mesh: Mesh): void {
        mesh.position.x = this.mesh.position.x;
        mesh.position.y = this.mesh.position.y;
        mesh.position.z = this.mesh.position.z;
    }

    /**
     * This leaves a shadow as the ball crosses the strike zone serving
     * as a pitch location indicator.
     */
    public spawnIndicator(): void {
        if (this.hasIndicator) {
            return;
        }
        this.hasIndicator = true;
        const indicator = new Indicator();
        indicator.mesh.position.x = this.mesh.position.x;
        indicator.mesh.position.y = this.mesh.position.y;
        indicator.mesh.position.z = this.mesh.position.z;
        indicator.join(this.loop.background);
    }

    /**
     * @param game
     * @returns the positional increments for animating a pitch.
     */
    public derivePitchingTrajectory(game: Game): VECTOR3[] {
        this.setType(game.pitchInFlight.name, game.pitcher.throws === 'right' ? 1 : -1);
        const top = 200 - game.pitchTarget.y,
            left = game.pitchTarget.x,
            breakTop = 200 - game.pitchInFlight.y,
            breakLeft = game.pitchInFlight.x,
            flightTime = Mathinator.getFlightTime(
                game.pitchInFlight.velocity,
                helper.pitchDefinitions[game.pitchInFlight.name][2]
            );

        const scale = SCALE;
        const origin = {
            x: game.pitcher.throws == 'left' ? 1.5 : -1.5,
            y: AbstractMesh.WORLD_BASE_Y + 6,
            z: -60.5 // mound distance
        };
        this.mesh.position.x = origin.x;
        this.mesh.position.y = origin.y;
        this.mesh.position.z = origin.z;

        const ARC_APPROXIMATION_Y_ADDITIVE = 38; // made up number
        const terminus = {
            x: (left - 100) * scale,
            y: (100 - top + 2 * ARC_APPROXIMATION_Y_ADDITIVE) * scale + VERTICAL_CORRECTION,
            z: INDICATOR_DEPTH
        };
        const breakingTerminus = {
            x: (breakLeft - 100) * scale,
            y: (100 - breakTop) * scale + VERTICAL_CORRECTION,
            z: INDICATOR_DEPTH
        };

        let lastPosition = {
                x: origin.x,
                y: origin.y,
                z: origin.z
            },
            lastBreakingPosition = {
                x: origin.x,
                y: origin.y,
                z: origin.z
            };

        const frames: VECTOR3[] = [];
        const breakingFrames: VECTOR3[] = [];
        const frameCount = (flightTime * 60) | 0;
        let counter = (frameCount * 1.08) | 0;
        let frame = 0;

        const xBreak = breakingTerminus.x - terminus.x,
            yBreak = breakingTerminus.y - terminus.y;
        const breakingDistance = Math.sqrt(Math.pow(xBreak, 2) + Math.pow(yBreak, 2));
        /**
         * 1.0+, an expression of how late the pitch breaks
         */
        const breakingLateness = breakingDistance / (2 * ARC_APPROXIMATION_Y_ADDITIVE) / scale,
            breakingLatenessMomentumExponent = 0.2 + Math.pow(0.45, breakingLateness);

        while (counter--) {
            const progress = ++frame / frameCount;

            // linear position
            const position = {
                x: origin.x + (terminus.x - origin.x) * progress,
                y: origin.y + (terminus.y - origin.y) * progress,
                z: origin.z + (terminus.z - origin.z) * progress
            };
            // linear breaking position
            const breakingInfluencePosition = {
                x: origin.x + (breakingTerminus.x - origin.x) * progress,
                y: origin.y + (breakingTerminus.y - origin.y) * progress,
                z: origin.z + (breakingTerminus.z - origin.z) * progress
            };
            if (progress > 1) {
                var momentumScalar = 1 - Math.pow(progress, breakingLateness);
            } else {
                momentumScalar = Math.pow(1 - progress, breakingLatenessMomentumExponent);
            }
            const breakingScalar = 1 - momentumScalar,
                scalarSum = momentumScalar + breakingScalar;
            // adjustment toward breaking ball position
            const breakingPosition = {
                x:
                    (position.x * momentumScalar + breakingInfluencePosition.x * breakingScalar) /
                    scalarSum,
                y:
                    (position.y * momentumScalar + breakingInfluencePosition.y * breakingScalar) /
                    scalarSum,
                z:
                    (position.z * momentumScalar + breakingInfluencePosition.z * breakingScalar) /
                    scalarSum
            };
            const increment = {
                x: position.x - lastPosition.x,
                y: position.y - lastPosition.y,
                z: position.z - lastPosition.z
            };
            const breakingIncrement = {
                x: breakingPosition.x - lastBreakingPosition.x,
                y: breakingPosition.y - lastBreakingPosition.y,
                z: breakingPosition.z - lastBreakingPosition.z
            };

            lastPosition = position;
            lastBreakingPosition = breakingPosition;

            breakingFrames.push(breakingIncrement);
            frames.push(increment);
        }

        let pause = 60;
        while (pause--) {
            breakingFrames.push({ x: 0, y: 0, z: 0 });
            frames.push({ x: 0, y: 0, z: 0 });
        }

        this.breakingTrajectory = breakingFrames;
        this.trajectory = frames;
        return frames;
    }

    /**
     * @param result
     * @param pitch
     * @returns incremental positions for animating a batted ball.
     */
    public deriveTrajectory(result: swing_result_t, pitch: pitch_in_flight_t): VECTOR3[] {
        const feetInMile = 5280;
        const secondsInHour = 3600;

        const gravitationAcceleration: fpss_t = 32.185; // feet per second squared.
        const scale = SCALE;

        // a.k.a. launch angle in Baseball terminology.
        let flyAngle: degrees_t = result.flyAngle;

        // distance the ball travels before hitting the ground the first time.
        let distance: feet_t = Math.abs(result.travelDistance);

        const splay: splay_t = result.splay;

        const infield = {
            first: 1,
            second: 1,
            short: 1,
            third: 1
        };
        if (result.fielder in infield) {
            // If we're using the ground ball animation trajectory,
            // have the rendered travel distance be at least to the
            // infield arc if the fielder
            // is a non-battery infielder.
            distance = Math.max(110, distance);
        }

        const origin = {
            x: pitch.x + result.x - 100,
            y: pitch.y + result.y - 100,
            z: -0
        };
        const terminal = {
            x: Math.sin((splay / 180) * Math.PI) * distance,
            y: AbstractMesh.WORLD_BASE_Y,
            z: -Math.cos((splay / 180) * Math.PI) * distance
        };

        this.mesh.position.x = origin.x * scale;
        this.mesh.position.y = origin.y * scale;
        this.mesh.position.z = origin.z;

        const frames = [];

        const startingHeight = origin.y * scale + AbstractMesh.WORLD_BASE_Y;
        const currentPosition = { ...this.mesh.position };

        const FRAME_CAP = 600;

        const velocity: fps_t = this.getVelocity(flyAngle, distance, gravitationAcceleration);
        const velocityVerticalComponent: fps_t = velocity * Math.sin((flyAngle * Math.PI) / 180);
        const velocityHorizontalComponent: fps_t = velocity * Math.cos((flyAngle * Math.PI) / 180);

        result.battedBallSpeed = (velocity * secondsInHour) / feetInMile;

        const vector: {
            x: fps_t;
            y: fps_t;
            z: fps_t;
        } = {
            x: velocityHorizontalComponent * Math.sin((splay / 180) * Math.PI),
            y: velocityVerticalComponent,
            z: -velocityHorizontalComponent * Math.cos((splay / 180) * Math.PI)
        };

        while (this.dist2d(origin, currentPosition) < distance && frames.length < FRAME_CAP) {
            const diff = {
                x: vector.x / 60,
                y: vector.y / 60,
                z: vector.z / 60
            };

            currentPosition.x += diff.x;
            currentPosition.y += diff.y;
            currentPosition.z += diff.z;

            vector.x *= 0.999;
            vector.y = Math.max(vector.y - gravitationAcceleration / 60, -140);
            vector.z *= 0.999;

            if (currentPosition.y <= AbstractMesh.WORLD_BASE_Y) {
                // velocity lost on bounce redirect.
                if (vector.y < 0) {
                    vector.y = Math.abs(vector.y) * 0.66;
                }
            }

            frames.push(diff);
        }

        this.trajectory = frames;
        return frames;
    }

    private dist2d(a: VECTOR3, b: VECTOR3): number {
        return ((a.z - b.z) ** 2 + (a.x - b.x) ** 2) ** 0.5;
    }

    private getVelocity(
        angle: degrees_t,
        distance: feet_t,
        gravitationAcceleration: fpss_t
    ): fps_t {
        // projectile motion range equation
        // distance = 2 * Vx * Vy / g
        // V = Vx / Math.cos(flyAngle)
        // V = Vy / Math.sin(flyAngle)

        const velocity = Math.sqrt(
            Math.abs(
                (distance /
                    2 /
                    Math.cos((angle / 180) * Math.PI) /
                    Math.sin((angle / 180) * Math.PI)) *
                    gravitationAcceleration
            )
        );

        return velocity;
    }
}

export { Ball };
