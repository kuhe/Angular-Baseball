import { AbstractMesh } from './AbstractMesh';
import { Loop } from '../Loop';
import { Mesh } from 'three';
import { THREE } from '../../Api/externalRenderer';

/**
 *
 * A stationary circle indicating where the pitched ball has crossed the strike zone plane.
 *
 */
class Indicator extends AbstractMesh {
    public trajectory: number[] = [];
    constructor(loop?: Loop) {
        super();
        let n = 60;
        while (n-- > 0) {
            this.trajectory.push(1);
        }
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    public getMesh(): Mesh {
        const geometry = new THREE.CircleGeometry(0.3, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        this.mesh = new THREE.Mesh(geometry, material);
        return this.mesh;
    }
    public animate(): void {
        this.trajectory.shift();

        if (!this.trajectory.length) {
            this.detach();
        }
    }
}

export { Indicator };
