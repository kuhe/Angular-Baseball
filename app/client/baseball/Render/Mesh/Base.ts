import { AbstractMesh } from './AbstractMesh';
import { THREE } from '../../Api/externalRenderer';
import { key_base_name_t } from '../../Api/baseName';
import { Loop } from '../Loop';
import { Mesh } from 'three';

/**
 * "Base" ball.
 */
class Base extends AbstractMesh {
    constructor(loop: Loop, public base: key_base_name_t) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }

    public getMesh(): Mesh {
        const material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.5, 8, 8, 8), material);

        mesh.rotation.x = (-0 / 180) * Math.PI;
        mesh.rotation.y = (45 / 180) * Math.PI;
        mesh.rotation.z = (0 / 180) * Math.PI;

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

    public animate(): void {}
}

export { Base };
