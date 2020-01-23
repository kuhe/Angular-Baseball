import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';

/**
 *
 * Pitcher's mound.
 *
 */
class Mound extends AbstractMesh {
    constructor(loop?: Loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    public getMesh(): Mesh {
        const material = new THREE.MeshLambertMaterial({
            color: 0xdcb096
        });

        const mesh = new THREE.Mesh(new THREE.CircleGeometry(9), material);

        mesh.rotation.x = (-90 / 180) * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = (45 / 180) * Math.PI;

        mesh.position.x = 0;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.9;
        mesh.position.z = -60.5;

        this.mesh = mesh;
        return this.mesh;
    }
    public animate(): void {}
}

export { Mound };
