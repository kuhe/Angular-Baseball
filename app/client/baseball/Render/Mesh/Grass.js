import { AbstractMesh } from './AbstractMesh';

class Grass extends AbstractMesh {
    constructor(loop, infield) {
        super();
        this.infield = infield;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: this.infield ? 0x284c19 : 0x284c19 //0x486D1F
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.infield ? 94 : 8000, this.infield ? 94 : 8000, 16, 16),
            material
        );

        if (this.infield) {
            mesh.rotation.x = (-90 / 180) * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = (45 / 180) * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.2;
            mesh.position.z = -62;
        } else {
            mesh.rotation.x = (-90 / 180) * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = (45 / 180) * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = AbstractMesh.WORLD_BASE_Y - 0.2;
            mesh.position.z = -570;
        }

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {}
}

export { Grass };
