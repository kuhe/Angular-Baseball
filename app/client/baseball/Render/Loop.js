import { Ball } from './mesh/Ball';
import { Mound } from './mesh/Mound';
import { Base } from './mesh/Base';
import { FoulLine } from './mesh/FoulLine';
import { FoulPole } from './mesh/FoulPole';
import { Field } from './mesh/Field';
import { Grass } from './mesh/Grass';
import { BaseDirt } from './mesh/BaseDirt';
import { BattersEye } from './mesh/BattersEye';
import { Wall } from './mesh/Wall';
import { Sky } from './mesh/Sky';
import { Sun } from './mesh/Sun';
import { lighting } from './scene/lighting';
import { loadSkyShader } from './Shaders/SkyShader';
import { VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE } from './LoopConstants';

if (typeof THREE !== 'undefined') {
    var AHEAD = new THREE.Vector3(0, VERTICAL_CORRECTION, -60.5);
    var INITIAL_POSITION = new THREE.Vector3(0, VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE);
}

/**
 * manager for the rendering loop
 */
class Loop {

    /**
     * @param {string} elementClass
     * @param {boolean} background
     * @param {Class} Animator
     */
    constructor(elementClass, background, Animator) {
        this.Animator = Animator;
        loadSkyShader();
        this.elementClass = elementClass;
        window.loop = this;
        this.timeOfDay = {
            h: 5,
            m: 30
        };
        this.main(background);
    }

    /**
     * individual objects<AbstractMesh> can attach and detach to the manager to be rendered
     */
    loop() {
        requestAnimationFrame(this.loop.bind(this));
        this.panToward(this.target);
        const omt = this.overwatchMoveTarget;
        this.moveToward(this.moveTarget || {
            x: omt.x,
            y: omt.y + 12,
            z: omt.z
        });
        this.objects.map(i => i.animate());
        //this.breathe();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * initialize lights, camera, action
     */
    main(background) {
        this.objects = [];
        const giraffe = this;

        if (this.getThree()) {

            const THREE = this.THREE;

            const scene = this.scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0x838888, 0.002 );
            if (this.attach()) {
                this.lighting = lighting;
                lighting.addTo(scene);
                const camera = this.camera = new THREE.PerspectiveCamera(60, this.getAspect(), 0.1, 1000000);

                this.target = new THREE.Vector3(0, 0, -60.5);
                this._target = new THREE.Vector3(0, 0, -60.5);
                this.moveTarget = camera.position;

                this.resetCamera();
                this.loop();
                if (background) {
                    this.addStaticMeshes();
                }
            } else {
                setTimeout(() => {
                    giraffe.main(background);
                }, 2000);
            }

        }
    }

    /**
     * @param addition
     */
    addMinutes(addition) {
        let hours = this.timeOfDay.h, minutes = this.timeOfDay.m;
        minutes += addition;
        while (minutes >= 60) {
            minutes -= 60;
            hours += 1;
            hours %= 24;
        }
        this.setTimeOfDay(hours, minutes);
    }

    /**
     * @param hours
     * @param minutes
     * gradual transition
     */
    setTargetTimeOfDay(hours, minutes) {
        if (this.background) {
            var sun = this.background.sun;
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
     * @param hours {Number} 0-24
     * @param minutes {Number} 0-60
     * instant transition
     */
    setTimeOfDay(hours, minutes) {
        this.timeOfDay = {
            h: hours,
            m: minutes
        };
        if (this.background) {
            var sky = this.background.sky,
                sun = this.background.sun;
        } else {
            sky = this.sky;
            sun = this.sun;
        }
        if (hours < 7.5) {
            hours += 24;
        }
        const azimuth = ((hours - 7.5)/24 + (minutes/60)/24);
        sky.uniforms.azimuth = azimuth;

        //if (azimuth > 0.5) {
        //    sky.uniforms.inclination = 0.48;
        //} else {
            sky.uniforms.inclination = 0.31;
        //}
        sun.time.h = hours;
        sun.time.m = minutes;
        sun.derivePosition(sky);
        const luminosity = (-0.5 + Math.max(Math.abs(1.25 - azimuth), Math.abs(0.25 - azimuth))) * 2;
        if (this.Animator) {
            this.Animator.setLuminosity(0.1 + luminosity/1.4);
        }
    }

    /**
     * used by the background layer
     */
    addStaticMeshes() {
        new Field().join(this);
        new Mound().join(this);
        new Grass().join(this);
        new Grass(this, true);
        new BattersEye().join(this);
        const sun = new Sun(), sky = new Sky();
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
    breathe() {
        const pos = this.camera.position;
        const x = pos.x, y = pos.y, z = pos.z;
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
    getThree() {
        if (this.THREE === Loop.prototype.THREE && typeof window === 'object' && window.THREE) {
            return this.THREE = window.THREE;
        }
        return true;
    }

    /**
     * attach to the DOM
     * @returns {THREE.WebGLRenderer|Boolean}
     */
    attach() {
        window.removeEventListener('resize', this.onResize.bind(this), false);
        window.addEventListener('resize', this.onResize.bind(this), false);
        const element = document.getElementsByClassName(this.elementClass)[0];
        if (element) {
            element.innerHTML = '';
            const THREE = this.THREE;
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
    onResize() {
        const element = document.getElementsByClassName(this.elementClass)[0];
        this.camera.aspect = this.getAspect();
        this.camera.fov = Math.max(90 - 30 * (element.offsetWidth / 1200), 55);
        this.camera.updateProjectionMatrix();
        this.setSize(this.renderer);
    }
    setSize(renderer) {
        const element = document.getElementsByClassName(this.elementClass)[0];
        const width = element.offsetWidth;
        renderer.setSize(width, HEIGHT);
    }
    getAspect() {
        const element = document.getElementsByClassName(this.elementClass)[0];
        return element.offsetWidth / HEIGHT;
    }

    /**
     * incrementally pan toward the vector given
     * @param vector
     */
    panToward(vector) {
        const maxIncrement = this.panSpeed;
        this.forAllLoops(loop => {
            const target = loop._target;
            if (target) {
                target.x = target.x + Math.max(Math.min((vector.x - target.x)/100, maxIncrement), -maxIncrement);
                target.y = target.y + Math.max(Math.min((vector.y - target.y)/100, maxIncrement), -maxIncrement);
                target.z = target.z + Math.max(Math.min((vector.z - target.z)/100, maxIncrement), -maxIncrement);
                loop.camera.lookAt(target);
            }
        });
    }

    /**
     * incrementally move the camera to the vector
     * @param vector
     */
    moveToward(vector) {
        const maxIncrement = this.moveSpeed;
        this.forAllLoops(loop => {
            const position = loop.camera && loop.camera.position;
            if (position) {
                position.x += Math.max(Math.min((vector.x - position.x), maxIncrement), -maxIncrement);
                position.y += Math.max(Math.min((vector.y - position.y), maxIncrement), -maxIncrement);
                position.z += Math.max(Math.min((vector.z - position.z), maxIncrement), -maxIncrement);
            }
        });
    }

    /**
     * setting a target will cause the camera to pan toward it using the pan method above
     * @param vector
     * @param panSpeed
     */
    setLookTarget(vector, panSpeed) {
        this.forAllLoops(loop => {
            loop.panSpeed = panSpeed || 0.9;
            loop.panning = vector !== AHEAD;
            loop.target = vector;
        });
    }

    /**
     * setting a target will cause the camera to move toward it using the incremental method above
     * @param vector
     * @param moveSpeed
     */
    setMoveTarget(vector, moveSpeed) {
        this.forAllLoops(loop => {
            loop.moveSpeed = moveSpeed || 0.7;
            loop.moveTarget = vector;
            loop.overwatchMoveTarget = null;
        });
    }
    setOverwatchMoveTarget(vector, moveSpeed) {
        this.forAllLoops(loop => {
            loop.moveSpeed = moveSpeed || 0.7;
            loop.overwatchMoveTarget = vector;
            loop.moveTarget = null;
        });
    }
    resetCamera() {
        let moveSpeed = 0.5;
        if (this.camera.position.z !== INITIAL_POSITION.z) {
            moveSpeed = 2.5;
        }
        this.setLookTarget(AHEAD, moveSpeed);
        this.setMoveTarget(INITIAL_POSITION, moveSpeed/10);
    }
    moveCamera(x, y, z) {
        if (typeof x === 'object') {
            return this.moveCamera(x.x, x.y, x.z);
        }
        this.forAllLoops(loop => {
            loop.camera.position.x = x;
            loop.camera.position.y = y;
            loop.camera.position.z = z;
        });
    }

    /**
     * execute the function on all loops
     * @param fn {Function}
     */
    forAllLoops(fn) {
        if (this.background) {
            fn(this.background);
        }
        if (this.foreground) {
            fn(this.foreground);
        }
        fn(this);
    }

    test() {
        const ball = new Ball();
        window.Ball = Ball;
        window.ball = ball;
        ball.setType('4-seam');
        //with (ball.mesh.rotation) {x=0,y=0,z=0}; ball.rotation = {x:0.00, y:0.00};
        ball.animate = () => {
            ball.rotate();
        };
        ball.join(this);
        // Baseball.service.Animator.loop.test();
    }

    testTrajectory(data) {
        const ball = new Ball();
        window.Ball = Ball;
        window.ball = ball;
        ball.deriveTrajectory(data || {
            splay: -35,
            travelDistance: 135,
            flyAngle: -15,
            x: 100,
            y: 100
        }, {
            x: 0, y: 0
        });
        ball.join(this);
    }
}

var HEIGHT = 700;

Loop.prototype.THREE = {};
Loop.prototype.constructors = {
    Ball,
    Mound,
    Field
};

export { Loop };
