import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';

class Sky extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop instanceof Loop) {
            this.join(loop);
        }
    }
    setUniforms(uniforms) {
        this.uniforms = uniforms;
        const sky = this.sky;
        for (const key in uniforms) { if (uniforms.hasOwnProperty(key)) {
            if (!sky.uniforms[key]) {
                sky.uniforms[key] = uniforms[key];
            }
            if (typeof uniforms[key] === 'object') {
                sky.uniforms[key].value = uniforms[key].value;
            }
        }}
    }
    getMesh() {
        const uniforms = this.uniforms = {
            luminance:	 { type: "f", value: 1.10 },
            turbidity:	 { type: "f", value: 1 },
            reileigh:	 { type: "f", value: 1.30 },
            mieCoefficient:	 { type: "f", value: 0.0022 },
            mieDirectionalG: { type: "f", value: 0.99 },
            sunPosition: 	 { type: "v3", value: new THREE.Vector3() },
            inclination: 0.18, // elevation / inclination
            azimuth: 0.75,
            sun: false
        };

        const sky = new THREE.Sky();
        this.sky = sky;
        this.mesh = sky.mesh;

        this.setUniforms(uniforms);

        return this.mesh;
    }
    animate() {

    }
}

export { Sky }