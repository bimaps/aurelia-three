"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeLogger = void 0;
var THREE = require("three");
var ThreeLogger = (function () {
    function ThreeLogger(three) {
        this.three = three;
        this.log = false;
    }
    ThreeLogger.prototype.logPoints = function (points, name, color, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 0; }
        if (!this.log) {
            return;
        }
        var original = this.three.getScene('tools').getObjectByName(name);
        if (original) {
            this.three.getScene('tools').remove(original);
        }
        if (points === null) {
            return;
        }
        var group = new THREE.Group();
        var allPoints = Array.isArray(points) ? points : [points];
        for (var _i = 0, allPoints_1 = allPoints; _i < allPoints_1.length; _i++) {
            var point = allPoints_1[_i];
            var geometry = new THREE.SphereBufferGeometry(0.2);
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color, depthTest: false }));
            mesh.renderOrder = 10;
            mesh.position.set(point.x, point.y, point.z);
            group.add(mesh);
        }
        group.name = name;
        this.three.getScene('tools').add(group);
        if (timeout) {
            setTimeout(function () {
                _this.logPoints(null, name, '');
            }, timeout);
        }
    };
    ThreeLogger.prototype.logAxis = function (axis, name, color, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 0; }
        if (!this.log) {
            return;
        }
        var original = this.three.getScene('tools').getObjectByName(name);
        if (original) {
            this.three.getScene('tools').remove(original);
        }
        if (axis === null) {
            return;
        }
        var p1 = axis.clone().multiplyScalar(20);
        var p2 = p1.clone().negate();
        var geometry = new THREE.Geometry();
        geometry.vertices.push(p1, p2);
        var mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color, depthTest: false }));
        mesh.name = name;
        mesh.renderOrder = 10;
        this.three.getScene('tools').add(mesh);
        if (timeout) {
            setTimeout(function () {
                _this.logAxis(null, name, '');
            }, timeout);
        }
    };
    ThreeLogger.prototype.logPlane = function (plane, name, color, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 0; }
        if (!this.log) {
            return;
        }
        var original = this.three.getScene('tools').getObjectByName(name);
        if (original) {
            this.three.getScene('tools').remove(original);
        }
        if (plane === null) {
            return;
        }
        var planeHelper = new THREE.PlaneHelper(plane, 15);
        planeHelper.material.color = new THREE.Color(color);
        planeHelper.name = name;
        planeHelper.renderOrder = 10;
        this.three.getScene('tools').add(planeHelper);
        if (timeout) {
            setTimeout(function () {
                _this.logPlane(null, name, '');
            }, timeout);
        }
    };
    return ThreeLogger;
}());
exports.ThreeLogger = ThreeLogger;

//# sourceMappingURL=three-logger.js.map
