var lighting = {
    addTo: function(scene) {
        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0);
        scene.add(light);
        var sun = new THREE.DirectionalLight(0xffffbb, 0.45);
        light.position.set(-1, 1, 1);
        this.light = light;
        this.sun = sun;
        scene.add(sun);
    },
    setLuminosity(level) {
        this.light.intensity = level;
        this.sun.intensity = level/2;
    }
};

export { lighting }