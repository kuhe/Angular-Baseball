import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { THREE } from '../../Api/externalRenderer';
import { Mesh } from 'three';
import { Base } from './Base';

/**
 * Grassless area around the bases.
 */
class BaseDirt extends AbstractMesh {
    public constructor(loop: Loop, public base: Base) {
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

    public animate(): void {}
}

export { BaseDirt };
