import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';
import { Sky } from './Sky';

/**
 *
 * Big Sol.
 *
 */
class Sun extends AbstractMesh {
    /**
     * The time of day that the sun should animate toward.
     * Affects light levels.
     */
    public targetTime: {
        h: number;
        m: number;
    };
    public time: {
        h: number;
        m: number;
    };

    constructor(loop?: Loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
        this.targetTime = {
            h: 6,
            m: 0
        };
        this.time = {
            h: 6,
            m: 0
        };
    }

    public setTargetTime(hours: number, minutes: number): void {
        this.targetTime.h = hours;
        this.targetTime.m = minutes;
    }

    public getMesh(): Mesh {
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        sun.position.z = -950000; // initialize away from scene
        sun.position.y = -100000;
        sun.position.x = -200000;
        sun.visible = false;

        this.mesh = sun;
        return this.mesh;
    }

    public derivePosition(sky: Sky): void {
        const distance = 400000;
        const uniforms = sky.uniforms;

        const theta = Math.PI * (uniforms.inclination - 0.5);
        const phi = 2 * Math.PI * (uniforms.azimuth - 0.5);

        const mesh = this.mesh;

        mesh.position.z = distance * Math.cos(phi);
        mesh.position.y = distance * Math.sin(phi) * Math.sin(theta);
        mesh.position.x = -(distance * Math.sin(phi) * Math.cos(theta));

        mesh.visible = uniforms.sun;

        sky.uniforms.sunPosition.value.copy(mesh.position);
    }

    public animate(): void {
        if (this.time.h !== this.targetTime.h || this.time.m !== this.targetTime.m) {
            this.loop.addMinutes(1);
            this.time.m += 1;
            if (this.time.m >= 60) {
                this.time.h++;
                this.time.m -= 60;
                this.time.h %= 24;
            }
        }
    }
}

export { Sun };
