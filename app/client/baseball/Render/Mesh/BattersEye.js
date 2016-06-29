import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';

class BattersEye extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop instanceof Loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0x3F4045
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                200,
                45,
                4,
                16, 16, 16
            ),
            material
        );

        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0;
        mesh.position.z -= 310;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}

export { BattersEye }