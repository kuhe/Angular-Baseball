import { Loop } from '../Loop';
import { loadSkyShader } from '../Shaders/SkyShader';
import { Mesh } from 'three';

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
abstract class AbstractMesh {
    public static getSkyMeshAndUniforms: ReturnType<typeof loadSkyShader>;

    /**
     * since we are using (0, 0, 0) vector for the center of the strike zone, the actual ground level will be offset
     * downward
     */
    public static WORLD_BASE_Y = -4;

    public loop: Loop;

    public mesh: Mesh;

    /**
     * Join the scene.
     * @param loop
     */
    public join(loop?: Loop): void {
        this.loop = loop || this.loop;
        // Non-circular typecheck for [Loop]
        if (this.loop && this.loop.loop) {
            this.attach();
        }
    }

    /**
     * Remove from the scene.
     */
    public detach(): void {
        const objects = this.loop.objects;
        const index = objects.indexOf(this);
        if (index !== -1) {
            this.loop.objects.splice(index, 1);
        }
        this.loop.scene.remove(this.mesh);
    }

    public abstract animate(): void;

    /**
     * attach and detach should be used to maintain the correct object list
     * todo use the built in object list of the scene object
     */
    protected attach(): void {
        const objects = this.loop.objects;
        if (objects.indexOf(this) === -1) {
            objects.push(this);
        }
        this.loop.scene.add(this.mesh);
    }
}

export { AbstractMesh };
