import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { handedness_t } from '../../Api/handedness';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';

class FoulPole extends AbstractMesh {
    constructor(loop: Loop, public side: handedness_t) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    public getMesh(): Mesh {
        const material = new THREE.MeshLambertMaterial({
            color: 0xe3ef6e
        });

        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 180, 8, 8), material);

        const left = this.side === 'left';

        if (left) {
            mesh.position.x = -218;
            mesh.position.z = -212;
        } else {
            mesh.position.x = 218;
            mesh.position.z = -212;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y;

        this.mesh = mesh;
        return this.mesh;
    }
    public animate(): void {}
}

export { FoulPole };
