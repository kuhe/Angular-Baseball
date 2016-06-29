import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';

class FoulPole extends AbstractMesh {
    constructor(loop, side) {
        super();
        this.side = side;
        this.getMesh();
        if (loop instanceof Loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xE3EF6E
        });

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35, 0.35,
                180,
                8,
                8
            ),
            material
        );

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
    animate() {
    }
}

export { FoulPole }