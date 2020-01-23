import { THREE } from '../../Api/externalRenderer';
import { ratio_t } from '../../Api/math';

const lighting = {
    light: null as THREE.HemisphereLight,
    sun: null as THREE.DirectionalLight,
    addTo(scene: THREE.Scene) {
        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0);
        scene.add(light);
        const sun = new THREE.DirectionalLight(0xffffbb, 0.45);
        light.position.set(-1, 1, 1);
        this.light = light;
        this.sun = sun;
        scene.add(sun);
    },
    setLuminosity(level: ratio_t) {
        this.light.intensity = level;
        this.sun.intensity = level / 2;
    }
};

export { lighting };
