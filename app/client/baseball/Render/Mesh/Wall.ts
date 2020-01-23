import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { splay_t } from '../../Api/math';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';

/**
 * Outfield walls.
 */
class Wall extends AbstractMesh {
    /**
     * @param loop
     * @param angle - viewed from home plate.
     */
    constructor(loop: Loop, public angle: splay_t) {
        super();
        this.angle = angle;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }

    public getMesh(): Mesh {
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
        mesh.position.y = AbstractMesh.WORLD_BASE_Y;
        mesh.position.z -= distance;

        this.mesh = mesh;
        return this.mesh;
    }

    public animate(): void {}
}

export { Wall };
