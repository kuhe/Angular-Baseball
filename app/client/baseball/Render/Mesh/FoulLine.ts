import { AbstractMesh } from './AbstractMesh';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';
import { Loop } from '../Loop';
import { handedness_t } from '../../Api/handedness';

/**
 *
 * Chalk lines to the left and right.
 *
 */
class FoulLine extends AbstractMesh {
    constructor(loop: Loop, public side: handedness_t) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    public getMesh(): Mesh {
        const material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 300, 1, 1), material);

        const left = this.side === 'left';

        mesh.rotation.x = (-90 / 180) * Math.PI;
        mesh.rotation.y = (0 / 180) * Math.PI;

        if (left) {
            mesh.rotation.z = (45 / 180) * Math.PI;
            mesh.position.x = -108;
            mesh.position.z = -102;
        } else {
            mesh.rotation.z = (-45 / 180) * Math.PI;
            mesh.position.x = 108;
            mesh.position.z = -102;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.35;

        this.mesh = mesh;
        return this.mesh;
    }
    public animate(): void {}
}

export { FoulLine };
