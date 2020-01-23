import { AbstractMesh } from './AbstractMesh';
import { loadSkyShader } from '../Shaders/SkyShader';
import { Loop } from '../Loop';
import { THREE, VECTOR3 } from '../../Api/externalRenderer';
import { Mesh } from 'three';

export type uniforms_t = {
    luminance: { type: 'f'; value: number };
    turbidity: { type: 'f'; value: number };
    reileigh: { type: 'f'; value: number };
    mieCoefficient: { type: 'f'; value: number };
    mieDirectionalG: { type: 'f'; value: number };
    sunPosition: { type: 'v3'; value: VECTOR3 };
    inclination: number; // elevation / inclination
    azimuth: number;
    sun: boolean;
};

/**
 *
 * That thing up there.
 *
 */
class Sky extends AbstractMesh {
    public uniforms: uniforms_t;

    constructor(loop?: Loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }

    setUniforms(uniforms: uniforms_t) {
        this.uniforms = uniforms;
    }

    public getMesh(): Mesh {
        const uniforms = (this.uniforms = {
            luminance: { type: 'f', value: 1.1 },
            turbidity: { type: 'f', value: 1 },
            reileigh: { type: 'f', value: 1.3 },
            mieCoefficient: { type: 'f', value: 0.0022 },
            mieDirectionalG: { type: 'f', value: 0.99 },
            sunPosition: { type: 'v3', value: new THREE.Vector3() },
            inclination: 0.18, // elevation / inclination
            azimuth: 0.75,
            sun: false
        });
        if (!AbstractMesh.getSkyMeshAndUniforms) {
            AbstractMesh.getSkyMeshAndUniforms = loadSkyShader();
        }
        const { skyMesh, skyUniforms } = AbstractMesh.getSkyMeshAndUniforms();
        this.mesh = skyMesh;

        this.setUniforms(uniforms);

        return this.mesh;
    }

    public animate(): void {}
}

export { Sky };
