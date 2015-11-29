import { Loop } from '../Loop';

/**
 * Each class should adhere to this pattern.
 * When a scene object has been positioned correctly and its trajectory set,
 * it should use ::join to attach itself to the scene.
 *
 * While attached, the animate method will be called on each frame.
 * Typically the animate method can run through the trajectory queue and then
 * detach itself. @see Ball
 *
 * For static meshes the animate method will do nothing, leaving the mesh permanently attached.
 */
class AbstractMesh {
    /**
     * attach and detach should be used to maintain the correct object list
     * todo use the built in object list of the scene object
     */
    attach() {
        var objects = this.loop.objects;
        if (objects.indexOf(this) === -1) {
            objects.push(this);
        }
        this.loop.scene.add(this.mesh);
    }
    detach() {
        var objects = this.loop.objects;
        var index = objects.indexOf(this);
        if (index !== -1) {
            this.loop.objects.splice(index, 1);
        }
        this.loop.scene.remove(this.mesh);
    }
    join(loop) {
        this.loop = loop || this.loop;
        if (this.loop instanceof Loop) {
            this.attach();
        }
    }
    animate() {

    }
}

/**
 * since we are using (0, 0, 0) vector for the center of the strike zone, the actual ground level will be offset
 * downward
 * @type {number}
 */
AbstractMesh.WORLD_BASE_Y = -4;

export { AbstractMesh }