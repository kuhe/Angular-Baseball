import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';

class HomeDirt extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop instanceof Loop) {
            this.join(loop);
        }
    }
    getMesh() {
        var material = new THREE.MeshLambertMaterial({
            color: 0xDCB096
        });

        var mesh = new THREE.Mesh(
            new THREE.CircleGeometry(
                18, 32
            ),
            material
        );

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = 45/180 * Math.PI;

        mesh.position.x = 0;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.3;
        mesh.position.z = 0;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}

export { HomeDirt }