import { AbstractMesh } from './AbstractMesh';

class BaseDirt extends AbstractMesh {
    constructor(loop, base) {
        super();
        this.base = base;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xdcb096
        });
        const home = this.base.base === 'home';

        const mesh = new THREE.Mesh(new THREE.CircleGeometry(home ? 18 : 12, 32), material);

        mesh.rotation.x = (-90 / 180) * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = (45 / 180) * Math.PI;

        const base = this.base.getMesh().position;

        mesh.position.x = base.x * 0.9;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.3;
        mesh.position.z = base.z;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {}
}

export { BaseDirt };
