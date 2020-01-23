import { AbstractMesh } from './AbstractMesh';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';
import { Loop } from '../Loop';

/**
 * The contrast-providing wall at the outfield fence.
 * This is a real thing!
 */
class BattersEye extends AbstractMesh {
    constructor(loop?: Loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }

    public getMesh(): Mesh {
        const material = new THREE.MeshLambertMaterial({
            color: 0x3f4045
        });

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(200, 45, 4, 16, 16, 16), material);

        mesh.position.y = AbstractMesh.WORLD_BASE_Y;
        mesh.position.z -= 310;

        this.mesh = mesh;
        return this.mesh;
    }

    public animate(): void {}
}

export { BattersEye };
