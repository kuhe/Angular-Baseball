import { AbstractMesh } from './AbstractMesh';

class Field extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xDCB096
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                160,
                160,
                32,
                32
            ),
            material
        );

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = 45/180 * Math.PI;

        mesh.position.x = 0;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y;
        mesh.position.z = -102;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}

export { Field }