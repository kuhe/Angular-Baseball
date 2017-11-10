import { AbstractMesh } from './AbstractMesh';

class Sun extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
        this.targetTime = {
            h: 0,
            m: 0
        };
        this.time = {
            h: 0,
            m: 0
        };
    }
    setTargetTime(hours, minutes) {
        this.targetTime.h = hours;
        this.targetTime.m = minutes;
    }
    getMesh() {
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry( 20000, 16, 8 ),
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true })
        );
        sun.position.z = -950000; // initialize away from scene
        sun.position.y = -100000;
        sun.position.x = -200000;
        sun.visible = false;

        this.mesh = sun;
        return this.mesh;
    }

    /**
     * @param sky Sky
     */
    derivePosition(sky) {
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
    animate() {
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

export { Sun }