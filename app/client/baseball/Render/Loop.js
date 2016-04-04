import { Ball } from './mesh/Ball';
import { Mound } from './mesh/Mound';
import { Base } from './mesh/Base';
import { Field } from './mesh/Field';
import { Grass } from './mesh/Grass';
import { HomeDirt } from './mesh/HomeDirt';
import { BattersEye } from './mesh/BattersEye';
import { Wall } from './mesh/Wall';
import { Sky } from './mesh/Sky';
import { Sun } from './mesh/Sun';
import { lighting } from './scene/lighting';
import { loadSkyShader } from './Shaders/SkyShader';
import { Animator } from '../Services/Animator';

/**
 * the constants should be tuned so that the camera coincides with the DOM's strike zone overlay
 * @type {number}
 */
var VERTICAL_CORRECTION = -0.2;
var INITIAL_CAMERA_DISTANCE = 8;


if (typeof THREE !== 'undefined') {
    var AHEAD = new THREE.Vector3(0, VERTICAL_CORRECTION, -60.5);
    var INITIAL_POSITION = new THREE.Vector3(0, VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE);
}

/**
 * manager for the rendering loop
 */
class Loop {
    constructor(elementClass, background) {
        loadSkyShader();
        this.elementClass = elementClass;
        window.loop = this;
        this.timeOfDay = {
            h: 0,
            m: 0
        };
        this.main(background);
    }

    /**
     * individual objects<AbstractMesh> can attach and detach to the manager to be rendered
     */
    loop() {
        requestAnimationFrame(this.loop.bind(this));
        this.panToward(this.target);
        var omt = this.overwatchMoveTarget;
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
        var giraffe = this;

        if (this.getThree()) {

            var THREE = this.THREE;

            var scene = this.scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0x838888, 0.002 );
            if (this.attach()) {
                this.lighting = lighting;
                lighting.addTo(scene);
                var camera = this.camera = new THREE.PerspectiveCamera(60, this.getAspect(), 0.1, 1000000);

                this.target = new THREE.Vector3(0, 0, -60.5);
                this._target = new THREE.Vector3(0, 0, -60.5);
                this.moveTarget = camera.position;

                this.resetCamera();
                this.loop();
                if (background) {
                    this.addStaticMeshes();
                }
            } else {
                setTimeout(function() {
                    giraffe.main(background);
                }, 2000);
            }

        }
    }

    /**
     * @param addition
     */
    addMinutes(addition) {
        var hours = this.timeOfDay.h,
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
        var azimuth = ((hours - 7.5)/24 + (minutes/60)/24);
        sky.uniforms.azimuth = azimuth;

        //if (azimuth > 0.5) {
        //    sky.uniforms.inclination = 0.48;
        //} else {
            sky.uniforms.inclination = 0.31;
        //}
        sun.time.h = hours;
        sun.time.m = minutes;
        sun.derivePosition(sky);
        var luminosity = (-0.5 + Math.max(Math.abs(1.25 - azimuth), Math.abs(0.25 - azimuth))) * 2;
        Animator.setLuminosity(0.1 + luminosity/1.4);
    }

    /**
     * used by the background layer
     */
    addStaticMeshes() {
        new Field().join(this);
        new Mound().join(this);
        new HomeDirt().join(this);
        new Grass().join(this);
        new Grass(this, true);
        new BattersEye().join(this);
        var sun = new Sun(),
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

        new Base(this, 'first');
        new Base(this, 'second');
        new Base(this, 'third');
        new Base(this, 'home');
    }

    /**
     * experimental camera bobbing
     */
    breathe() {
        var pos = this.camera.position;
        var x = pos.x, y = pos.y, z = pos.z;
        var rate = 0.0005 * this.bob || 1;
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
        var element = document.getElementsByClassName(this.elementClass)[0];
        if (element) {
            element.innerHTML = '';
            var THREE = this.THREE;
            var renderer = new THREE.WebGLRenderer({ alpha: true });
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
        var element = document.getElementsByClassName(this.elementClass)[0];
        this.camera.aspect = this.getAspect();
        this.camera.fov = Math.max(90 - 30 * (element.offsetWidth / 1200), 55);
        this.camera.updateProjectionMatrix();
        this.setSize(this.renderer);
    }
    setSize(renderer) {
        var element = document.getElementsByClassName(this.elementClass)[0];
        var width = element.offsetWidth;
        renderer.setSize(width, HEIGHT);
    }
    getAspect() {
        var element = document.getElementsByClassName(this.elementClass)[0];
        return element.offsetWidth / HEIGHT;
    }

    /**
     * incrementally pan toward the vector given
     * @param vector
     */
    panToward(vector) {
        var maxIncrement = this.panSpeed;
        this.forAllLoops(function(loop) {
            var target = loop._target;
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
        var maxIncrement = this.moveSpeed;
        this.forAllLoops(function(loop) {
            var position = loop.camera && loop.camera.position;
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
        this.forAllLoops(function(loop) {
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
        this.forAllLoops(function(loop) {
            loop.moveSpeed = moveSpeed || 0.7;
            loop.moveTarget = vector;
            loop.overwatchMoveTarget = null;
        });
    }
    setOverwatchMoveTarget(vector, moveSpeed) {
        this.forAllLoops(function(loop) {
            loop.moveSpeed = moveSpeed || 0.7;
            loop.overwatchMoveTarget = vector;
            loop.moveTarget = null;
        });
    }
    resetCamera() {
        var moveSpeed = 0.5;
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
        this.forAllLoops(function(loop) {
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
        var ball = new Ball();
        window.Ball = Ball;
        window.ball = ball;
        ball.setType('4-seam');
        //with (ball.mesh.rotation) {x=0,y=0,z=0}; ball.rotation = {x:0.00, y:0.00};
        ball.animate = function() {
            ball.rotate();
        };
        ball.join(this);
        // Baseball.service.Animator.loop.test();
    }

    testTrajectory(data) {
        var ball = new Ball();
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
Loop.VERTICAL_CORRECTION = VERTICAL_CORRECTION;
Loop.INITIAL_CAMERA_DISTANCE = INITIAL_CAMERA_DISTANCE;
Loop.prototype.THREE = {};
Loop.prototype.constructors = {
    Ball : Ball,
    Mound: Mound,
    Field: Field
};

export { Loop };