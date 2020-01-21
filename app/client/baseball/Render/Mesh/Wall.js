import { AbstractMesh } from './AbstractMesh';

class Wall extends AbstractMesh {
    constructor(loop, angle) {
        super();
        this.angle = angle;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0x3f4045
        });

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(120, 15, 4, 16, 16, 16), material);

        const radians = (this.angle / 180) * Math.PI;
        mesh.rotation.y = -radians;

        const hypotenuse = 300;
        const distance = Math.cos(radians) * hypotenuse;
        const offset = Math.sin(radians) * hypotenuse;

        mesh.position.x += offset;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0;
        mesh.position.z -= distance;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {}
}

export { Wall };
