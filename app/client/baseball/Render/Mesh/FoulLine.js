import { AbstractMesh } from './AbstractMesh';

class FoulLine extends AbstractMesh {
    constructor(loop, side) {
        super();
        this.side = side;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                0.35,
                300,
                1,
                1
            ),
            material
        );

        const left = this.side === 'left';

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0/180 * Math.PI;

        if (left) {
            mesh.rotation.z = 45/180 * Math.PI;
            mesh.position.x = -108;
            mesh.position.z = -102;
        } else {
            mesh.rotation.z = -45/180 * Math.PI;
            mesh.position.x = 108;
            mesh.position.z = -102;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.35;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {
    }
}

export { FoulLine }