import { AbstractMesh } from './AbstractMesh';
import { loadSkyShader } from '../Shaders/SkyShader';
import { Loop } from '../Loop';
import { THREE, VECTOR3 } from '../../Api/externalRenderer';
import { Mesh } from 'three';

export type uniforms_t = {
    luminance: { type: 'f'; value: number };
    turbidity: { type: 'f'; value: number };
    rayleigh: { type: 'f'; value: number };
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
    public uniforms: uniforms_t = {
        luminance: { type: 'f', value: 1.1 },
        turbidity: { type: 'f', value: 1 },
        rayleigh: { type: 'f', value: 1.3 },
        mieCoefficient: { type: 'f', value: 0.0022 },
        mieDirectionalG: { type: 'f', value: 0.99 },
        sunPosition: { type: 'v3', value: new THREE.Vector3() },
        inclination: 0.18, // elevation / inclination
        azimuth: 0.75,
        sun: false
    };
    private sky: AbstractMesh & Partial<{ uniforms: uniforms_t }>;

    constructor(loop?: Loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }

    public getMesh(): Mesh {
        if (!AbstractMesh.getSkyMeshAndUniforms) {
            AbstractMesh.getSkyMeshAndUniforms = loadSkyShader();
        }

        const sky = new AbstractMesh.getSkyMeshAndUniforms();

        this.sky = sky;
        this.mesh = sky.mesh;

        this.setUniforms(this.uniforms);

        return this.mesh;
    }

    /**
     * Assign uniforms values to the inner HiddenSky class generated from the SkyShader.
     * @param uniforms - see type def.
     */
    public setUniforms(uniforms: uniforms_t) {
        this.uniforms = uniforms;
        const { sky } = this;
        for (const key in uniforms) {
            const k = key as keyof uniforms_t;

            if (!sky.uniforms[k] || typeof sky.uniforms[k] !== 'object') {
                Object.assign(sky.uniforms, {
                    k: uniforms[k]
                });
            } else {
                Object.assign(sky.uniforms[k], {
                    value: (uniforms[k] as { value: unknown }).value
                });
            }
        }
    }

    public animate(): void {}
}

export { Sky };
