import { AbstractMesh } from './AbstractMesh';

class FoulPole extends AbstractMesh {
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
    animate() {}
}

export { FoulPole };
