import { AbstractMesh } from './AbstractMesh';

class Base extends AbstractMesh {
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
            color: 0xFFFFFF
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                0.3,
                1.5,
                8, 8, 8
            ),
            material
        );

        mesh.rotation.x = -0/180 * Math.PI;
        mesh.rotation.y = 45/180 * Math.PI;
        mesh.rotation.z = 0/180 * Math.PI;

        switch (this.base) {
            case 'first':
                mesh.position.x = 69;
                mesh.position.z = -64;
                break;
            case 'second':
                mesh.position.x = 0;
                mesh.position.z = -128;
                break;
            case 'third':
                mesh.position.x = -69;
                mesh.position.z = -64;
                break;
            case 'home':
                mesh.position.x = 0;
                mesh.position.z = 0;

                mesh.rotation.y = 0;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.5;
        mesh.position.z -= 0;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}

export { Base }