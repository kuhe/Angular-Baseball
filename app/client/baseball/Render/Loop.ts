import { THREE, VECTOR3 } from '../Api/externalRenderer';
import { Ball } from './Mesh/Ball';
import { Mound } from './Mesh/Mound';
import { Base } from './Mesh/Base';
import { FoulLine } from './Mesh/FoulLine';
import { FoulPole } from './Mesh/FoulPole';
import { Field } from './Mesh/Field';
import { Grass } from './Mesh/Grass';
import { BaseDirt } from './Mesh/BaseDirt';
import { BattersEye } from './Mesh/BattersEye';
import { Wall } from './Mesh/Wall';
import { Sky } from './Mesh/Sky';
import { Sun } from './Mesh/Sun';
import { lighting } from './scene/lighting';
import { VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE } from './LoopConstants';
import { AbstractMesh } from './Mesh/AbstractMesh';
import { Animator } from '../Services/Animator';
import { swing_result_t } from '../Api/swingResult';
import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { pitch_in_flight_t } from '../Api/pitchInFlight';

let ahead: VECTOR3, initialPosition: VECTOR3;

const AHEAD = () => {
    if (ahead) {
        return ahead;
    }
    if (typeof THREE !== 'undefined') {
        return (ahead = new THREE.Vector3(0, VERTICAL_CORRECTION, -60.5));
    }
};
const INITIAL_POSITION = () => {
    if (initialPosition) {
        return initialPosition;
    }
    if (typeof THREE !== 'undefined') {
        return (initialPosition = new THREE.Vector3(
            0,
            VERTICAL_CORRECTION,
            INITIAL_CAMERA_DISTANCE
        ));
    }
};

/**
 * manager for the rendering loop
 */
class Loop {
    public overwatchMoveTarget: VECTOR3;
    public lighting: typeof lighting;
    public element: HTMLElement;
    public foreground: Loop;
    public background: Loop;
    public active: boolean;
    public timeOfDay = {
        h: 12,
        m: 30
    };
    public renderer: WebGLRenderer;
    public target: VECTOR3;
    /**
     * Camera is panning.
     */
    public panning: boolean;
    public _target: Vector3;
    public bob: number;
    public moveTarget: VECTOR3;
    public moveSpeed: number;
    public panSpeed: number;
    public objects: AbstractMesh[];
    public scene: Scene;
    public camera: PerspectiveCamera;
    public sun: Sun;
    public sky: Sky;

    public Animator: typeof Animator;

    /**
     * @param elementClass
     * @param isBackground - is the background loop, otherwise is the foreground loop.
     */
    constructor(public elementClass: string, isBackground: boolean) {
        this.overwatchMoveTarget = null;
        this.lighting = lighting;
        this.loop = this.loop.bind(this);
        this.onResize = this.onResize.bind(this);

        ((window as unknown) as { loop: Loop }).loop = this;
        this.timeOfDay = {
            h: 12,
            m: 30
        };
        this.main(isBackground);
    }

    /**
     *
     * Caution: this is the main animation loop, do activate more than one per rendering layer.
     * Individual objects<AbstractMesh> can attach and detach to the manager to be rendered.
     *
     */
    public loop(): void {
        this.active = true;
        requestAnimationFrame(this.loop);

        this.panToward(this.target);
        const omt = this.overwatchMoveTarget;
        this.moveToward(
            this.moveTarget || {
                x: omt.x,
                y: omt.y + 12,
                z: omt.z
            }
        );

        this.moveSpeed = 0.05;
        this.panSpeed = 0.3;

        this.objects.forEach((object) => object.animate());
        // this.breathe();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * initialize lights, camera, action
     * @param background - is the background loop.
     */
    public main(background?: boolean): void {
        this.objects = [];

        if (this.getThree()) {
            const scene = (this.scene = new THREE.Scene());
            scene.fog = new THREE.FogExp2(0x838888, 0.002);
            if (this.attach()) {
                lighting.addTo(scene);
                const camera = (this.camera = new THREE.PerspectiveCamera(
                    60,
                    this.getAspect(),
                    0.1,
                    1000000
                ));

                this.target = new THREE.Vector3(0, 0, -60.5);
                this._target = new THREE.Vector3(0, 0, -60.5);
                this.moveTarget = camera.position;

                this.resetCamera();
                if (!this.active) {
                    this.loop();
                }
                if (background) {
                    this.addStaticMeshes();
                }
            } else {
                setTimeout(() => {
                    this.main(background);
                }, 2000);
            }
        }
    }

    /**
     * @param addition - number of minutes to add.
     */
    public addMinutes(addition: number): void {
        let hours = this.timeOfDay.h,
            minutes = this.timeOfDay.m;
        minutes += addition;
        while (minutes >= 60) {
            minutes -= 60;
            hours += 1;
            hours %= 24;
        }
        this.setTimeOfDay(hours, minutes);
    }

    /**
     * @param hours - 0-24
     * @param minutes - 0-60
     * gradual transition
     */
    public setTargetTimeOfDay(hours: number, minutes: number): void {
        let sun;
        if (this.background) {
            sun = this.background.sun;
        } else {
            sun = this.sun;
        }
        if (sun) {
            sun.setTargetTime(hours, minutes);
        } else {
            setTimeout(() => {
                this.setTargetTimeOfDay(hours, minutes);
            }, 500);
        }
    }

    /**
     * @param hours - 0-24
     * @param minutes - 0-60
     * instant transition
     */
    public setTimeOfDay(hours: number, minutes: number): void {
        this.timeOfDay = {
            h: hours,
            m: minutes
        };
        let sky, sun;

        if (this.background) {
            sky = this.background.sky;
            sun = this.background.sun;
        } else {
            sky = this.sky;
            sun = this.sun;
        }
        if (hours < 7.5) {
            hours += 24;
        }
        const azimuth = (hours - 7.5) / 24 + minutes / 60 / 24;
        sky.uniforms.azimuth = azimuth;

        //if (azimuth > 0.5) {
        //    sky.uniforms.inclination = 0.48;
        //} else {
        sky.uniforms.inclination = 0.31;
        //}
        sun.time.h = hours;
        sun.time.m = minutes;
        sun.derivePosition(sky);
        const luminosity =
            (-0.5 + Math.max(Math.abs(1.25 - azimuth), Math.abs(0.25 - azimuth))) * 2;
        if (this.Animator) {
            this.Animator.setLuminosity(0.1 + luminosity / 1.4);
        }
    }

    /**
     * used by the background layer
     */
    public addStaticMeshes(): void {
        new Field().join(this);
        new Mound().join(this);
        new Grass().join(this);
        new Grass(this, true);
        new BattersEye().join(this);
        const sun = new Sun(),
            sky = new Sky();
        sun.derivePosition(sky);
        sky.join(this);
        sun.join(this);

        this.sky = sky;
        this.sun = sun;

        new Wall(this, -34);
        new Wall(this, -15);
        new Wall(this, 15);
        new Wall(this, 34);

        const b1 = new Base(this, 'first');
        const b2 = new Base(this, 'second');
        const b3 = new Base(this, 'third');
        const b4 = new Base(this, 'home');

        new BaseDirt(this, b1);
        new BaseDirt(this, b2);
        new BaseDirt(this, b3);
        new BaseDirt(this, b4);

        new FoulLine(this, 'left');
        new FoulLine(this, 'right');

        new FoulPole(this, 'left');
        new FoulPole(this, 'right');
    }

    /**
     * experimental camera bobbing
     */
    public breathe(): void {
        const pos = this.camera.position;
        const { x, y, z } = pos;
        const rate = 0.0005 * this.bob || 1;
        if (y > 0.6) {
            this.bob = -1;
        } else if (y < -0.6) {
            this.bob = 1;
        }
        //pos.x += rate;
        pos.y += rate;
        pos.z += rate;
    }

    public getThree(): typeof THREE {
        return THREE;
    }

    /**
     * attach to the DOM
     * @returns renderer or false
     */
    public attach(): WebGLRenderer | false {
        window.removeEventListener('resize', this.onResize, false);
        window.addEventListener('resize', this.onResize, false);

        this.element = document.getElementsByClassName(this.elementClass)[0] as HTMLElement;

        const { element } = this;
        if (element) {
            element.innerHTML = '';
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            this.setSize(renderer);
            //renderer.setClearColor(0xffffff, 0);

            element.appendChild(renderer.domElement);

            this.renderer = renderer;
            return renderer;
        }
        return false;
    }

    /**
     * higher FOV on lower view widths
     */
    public onResize(): void {
        const element = this.element;
        this.camera.aspect = this.getAspect();
        this.camera.fov = Math.max(90 - 30 * (element.offsetWidth / 1200), 55);
        this.camera.updateProjectionMatrix();
        this.setSize(this.renderer);
    }
    public setSize(renderer: WebGLRenderer): void {
        const element = this.element;
        const width = element.offsetWidth;
        renderer.setSize(width, HEIGHT);
    }

    /**
     * Aspect ratio.
     */
    public getAspect(): number {
        const element = this.element;
        return element.offsetWidth / HEIGHT;
    }

    /**
     * incrementally pan toward the vector given
     * @param vector
     */
    panToward(vector: VECTOR3) {
        const maxIncrement = this.panSpeed;
        this.forAllLoops((loop: Loop) => {
            const target = loop._target;
            if (target) {
                target.x =
                    target.x +
                    Math.max(Math.min((vector.x - target.x) / 100, maxIncrement), -maxIncrement);
                target.y =
                    target.y +
                    Math.max(Math.min((vector.y - target.y) / 100, maxIncrement), -maxIncrement);
                target.z =
                    target.z +
                    Math.max(Math.min((vector.z - target.z) / 100, maxIncrement), -maxIncrement);
                loop.camera.lookAt(target);
            }
        });
    }

    /**
     * incrementally move the camera to the vector
     * @param vector
     */
    public moveToward(vector: VECTOR3): void {
        const maxIncrement = this.moveSpeed;
        this.forAllLoops((loop: Loop) => {
            const position = loop.camera && loop.camera.position;
            if (position) {
                position.x += Math.max(
                    Math.min(vector.x - position.x, maxIncrement),
                    -maxIncrement
                );
                position.y += Math.max(
                    Math.min(vector.y - position.y, maxIncrement),
                    -maxIncrement
                );
                position.z += Math.max(
                    Math.min(vector.z - position.z, maxIncrement),
                    -maxIncrement
                );
            }
        });
    }

    /**
     * setting a target will cause the camera to pan toward it using the pan method above
     * @param vector
     * @param panSpeed
     */
    public setLookTarget(vector: VECTOR3, panSpeed: number) {
        this.forAllLoops((loop: Loop) => {
            loop.panSpeed = panSpeed;
            loop.panning = vector !== AHEAD();
            loop.target = vector;
        });
    }

    /**
     * setting a target will cause the camera to move toward it using the incremental method above
     * @param vector
     * @param moveSpeed
     */
    public setMoveTarget(vector: VECTOR3, moveSpeed: number): void {
        this.forAllLoops((loop: Loop) => {
            loop.moveSpeed = moveSpeed;
            loop.moveTarget = vector;
            loop.overwatchMoveTarget = null;
        });
    }

    /**
     * View from above the target.
     * @param vector
     * @param moveSpeed
     */
    public setOverwatchMoveTarget(vector: VECTOR3, moveSpeed: number): void {
        this.forAllLoops((loop: Loop) => {
            loop.moveSpeed = moveSpeed;
            loop.overwatchMoveTarget = vector;
            loop.moveTarget = null;
        });
    }

    /**
     * Move back to the initial position.
     */
    public resetCamera(): void {
        let moveSpeed = 0.5;
        if (this.camera.position.z !== INITIAL_POSITION().z) {
            moveSpeed = 2.5;
        }
        this.setLookTarget(AHEAD(), moveSpeed);
        this.setMoveTarget(INITIAL_POSITION(), moveSpeed / 10);
    }

    /**
     * Move camera to vector.
     * Contrast {@link #setLookTarget()}, this moves the camera itself, not its
     * view angle.
     * @param x
     */
    public moveCamera(x: VECTOR3): void;
    public moveCamera(x: number, y: number, z: number): void;
    public moveCamera(x: number | VECTOR3, y?: number, z?: number): void {
        if (typeof x === 'object') {
            const _x: VECTOR3 = x;
            return this.moveCamera(_x.x, _x.y, _x.z);
        }
        this.forAllLoops((loop: Loop) => {
            loop.camera.position.x = x;
            loop.camera.position.y = y;
            loop.camera.position.z = z;
        });
    }

    /**
     * execute the function on all loops
     * @param fn {Function}
     */
    public forAllLoops(fn: (loop: Loop) => void): void {
        if (this.background) {
            fn(this.background);
        }
        if (this.foreground) {
            fn(this.foreground);
        }
        fn(this);
    }

    /**
     * @deprecated
     * Test method.
     */
    public test(): void {
        const ball = new Ball();
        Object.assign(window, {
            Ball,
            ball
        });
        ball.setType('4-seam');
        //with (ball.mesh.rotation) {x=0,y=0,z=0}; ball.rotation = {x:0.00, y:0.00};
        ball.animate = () => {
            ball.rotate();
        };
        ball.join(this);
        // Baseball.service.Animator.loop.test();
    }

    /**
     * @deprecated
     * @param data
     */
    public testTrajectory(data?: swing_result_t): void {
        const ball = new Ball();
        Object.assign(window, {
            Ball,
            ball
        });
        ball.deriveTrajectory(
            data ||
                ({
                    splay: -35,
                    travelDistance: 135,
                    flyAngle: -15,
                    x: 100,
                    y: 100
                } as swing_result_t),
            {
                x: 0,
                y: 0
            } as pitch_in_flight_t
        );
        ball.join(this);
    }
}

const HEIGHT = 700;

export { Loop };
