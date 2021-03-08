var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as THREE from 'three';
var ThreeGeometry = (function () {
    function ThreeGeometry() {
    }
    ThreeGeometry.init = function () {
        if (ThreeGeometry.inited) {
            return;
        }
        ThreeGeometry.register('cone', function () {
            return new THREE.ConeGeometry(20, 80, 32);
        });
        ThreeGeometry.register('cube', function () {
            var translation = new THREE.Matrix4().makeTranslation(10, 10, 10);
            return new THREE.BoxGeometry(20, 20, 20).applyMatrix(translation);
        });
        ThreeGeometry.register('sphere', function () {
            return new THREE.SphereGeometry(20, 32, 32);
        });
        ThreeGeometry.register('cylinder', function () {
            return new THREE.CylinderGeometry(20, 20, 20, 32);
        });
        ThreeGeometry.inited = true;
    };
    ThreeGeometry.register = function (name, callback) {
        ThreeGeometry.registered[name] = callback;
    };
    ThreeGeometry.get = function (name, context) {
        var _a;
        if (context === void 0) { context = null; }
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        ThreeGeometry.init();
        if (!ThreeGeometry.registered[name])
            return null;
        return (_a = ThreeGeometry.registered[name]).call.apply(_a, __spreadArrays([context], params));
    };
    ThreeGeometry.registered = {};
    ThreeGeometry.inited = false;
    return ThreeGeometry;
}());
export { ThreeGeometry };

//# sourceMappingURL=three-geometry.js.map
