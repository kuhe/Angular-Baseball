import { AbstractMesh } from './AbstractMesh';

class Indicator extends AbstractMesh {
    constructor(loop) {
        super();
        let n = 60;
        this.trajectory = [];
        while (n--) {
            this.trajectory.push(1);
        }
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const THREE = window.THREE;
        const geometry = new THREE.CircleGeometry(0.3, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        this.mesh = new THREE.Mesh(geometry, material);
        return this.mesh;
    }
    animate() {
        this.trajectory.shift();

        if (!this.trajectory.length) {
            this.detach();
        }
    }
}

export { Indicator };
