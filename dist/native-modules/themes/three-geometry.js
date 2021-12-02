import * as THREE from 'three';
export class ThreeGeometry {
    static init() {
        if (ThreeGeometry.inited) {
            return;
        }
        ThreeGeometry.register('cone', () => {
            return new THREE.ConeGeometry(20, 80, 32);
        });
        ThreeGeometry.register('cube', () => {
            let translation = new THREE.Matrix4().makeTranslation(10, 10, 10);
            return new THREE.BoxGeometry(20, 20, 20).applyMatrix4(translation);
        });
        ThreeGeometry.register('sphere', () => {
            return new THREE.SphereGeometry(20, 32, 32);
        });
        ThreeGeometry.register('cylinder', () => {
            return new THREE.CylinderGeometry(20, 20, 20, 32);
        });
        ThreeGeometry.inited = true;
    }
    static register(name, callback) {
        ThreeGeometry.registered[name] = callback;
    }
    static get(name, context = null, ...params) {
        ThreeGeometry.init();
        if (!ThreeGeometry.registered[name])
            return null;
        return ThreeGeometry.registered[name].call(context, ...params);
    }
}
ThreeGeometry.registered = {};
ThreeGeometry.inited = false;

//# sourceMappingURL=three-geometry.js.map
