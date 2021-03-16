var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ThreeSelectionTool } from './three-selection-tool';
import { ThreeTool } from './three-tool';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
var ThreeRotationTool = (function (_super) {
    __extends(ThreeRotationTool, _super);
    function ThreeRotationTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'rotate';
        _this.rotating = false;
        _this.rotationStart = null;
        _this.objectsOriginalMatrixes = {};
        _this.objectsOriginalPositions = {};
        _this.objectsOriginalRotations = {};
        _this.subscriptions = [];
        _this.log = getLogger('three-admin-rotation');
        return _this;
    }
    ThreeRotationTool.prototype.rotate90Ground = function () {
        this.rotate(90, 'Y', 'degree');
    };
    ThreeRotationTool.prototype.rotate = function (angle, plane, unit) {
        if (unit === void 0) { unit = 'radian'; }
        var axis;
        if (plane === 'X')
            axis = new THREE.Vector3(1, 0, 0);
        if (plane === 'Y')
            axis = new THREE.Vector3(0, 1, 0);
        if (plane === 'Z')
            axis = new THREE.Vector3(0, 0, 1);
        angle = unit === 'radian' ? angle : angle / 180 * Math.PI;
        var boxCentroid = this.select.center.clone();
        for (var _i = 0, _a = this.select.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            this.rotateObjectAroundPoint(obj, boxCentroid, axis, angle);
        }
    };
    ThreeRotationTool.prototype.rotateObjectAroundPoint = function (object, point, axis, angle) {
        var translation = object.position.clone().sub(point).projectOnPlane(axis);
        var p = object.position.clone();
        object.position.set(p.x - translation.x, p.y - translation.y, p.z - translation.z);
        object.rotateOnWorldAxis(axis, angle);
        var p2 = object.position.clone();
        var translation2 = translation.clone().applyAxisAngle(axis, angle);
        object.position.set(p2.x + translation2.x, p2.y + translation2.y, p2.z + translation2.z);
    };
    ThreeRotationTool.prototype.activeRotationTool = function () {
        this.setConstraint(null);
    };
    ThreeRotationTool.prototype.canRegister = function () {
        var selectTool = this.service.getRegisteredTool('select');
        return selectTool instanceof ThreeSelectionTool;
    };
    ThreeRotationTool.prototype.onActivate = function () {
        var _this = this;
        var selectTool = this.service.getRegisteredTool('select');
        if (selectTool instanceof ThreeSelectionTool) {
            this.select = selectTool;
        }
        else {
            this.select = new ThreeSelectionTool(this.service);
            throw new Error('Translation tool requires the tool service to have the selection tool registered with `select` name');
        }
        if (!this.select.objects.length)
            return;
        this.rotationCentroid = this.select.center.clone();
        this.displayRotateOverlayTool();
        var ea = Container.instance.get(EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', function (data) {
            if (!_this.active)
                return;
            if (_this.rotating)
                return;
            for (var _i = 0, _a = data.map(function (i) { return i.object; }); _i < _a.length; _i++) {
                var object = _a[_i];
                if (object.userData.axis) {
                    return _this.setConstraint(object.userData.axis);
                }
            }
            return _this.setConstraint(null);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', function (data) {
            if (!_this.active)
                return;
            _this.handlePlanesIntersects(data);
        }));
        this.subscriptions.push(ea.subscribe('three-camera:moved', function () {
            if (!_this.active)
                return;
            _this.adjustOverlayToolZoom();
        }));
    };
    ThreeRotationTool.prototype.onDeactivate = function () {
        this.hideRotateOverlayTool();
        this.axisConstraint = null;
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
    };
    ThreeRotationTool.prototype.toggleRotationTool = function () {
        if (this.active) {
            this.service.activate(this.select);
        }
        else {
            this.setConstraint(null);
        }
    };
    ThreeRotationTool.prototype.setConstraint = function (constraint) {
        this.service.activate(this);
        if (constraint) {
            this.axisConstraint = constraint;
        }
        else {
            this.axisConstraint = null;
        }
        this.adjustActiveTool();
    };
    ThreeRotationTool.prototype.handlePlanesIntersects = function (data) {
        if (!this.active)
            return;
        if (!this.axisConstraint)
            return;
        if (data.type === 'down') {
            this.objectsOriginalMatrixes = {};
            for (var _i = 0, _a = this.select.objects; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.objectsOriginalMatrixes[obj.uuid] = obj.matrix.clone();
                this.objectsOriginalPositions[obj.uuid] = obj.position.clone();
                this.objectsOriginalRotations[obj.uuid] = obj.rotation.clone();
                if (obj.__selectGhost) {
                    var ghost = obj.__selectGhost;
                    this.objectsOriginalMatrixes[ghost.uuid] = ghost.matrix.clone();
                    this.objectsOriginalPositions[ghost.uuid] = ghost.position.clone();
                    this.objectsOriginalRotations[ghost.uuid] = ghost.rotation.clone();
                }
            }
            this.rotationStart = data.intersects;
            this.rotating = true;
            this.three.navigation.controls.enablePan = false;
            this.three.navigation.controls.enableRotate = false;
        }
        else if (data.type === 'move' && this.rotationStart && this.rotationCentroid && this.rotating) {
            var originalPoint = void 0;
            var currentPoint = void 0;
            var axis = void 0;
            if (this.axisConstraint === 'X') {
                originalPoint = this.rotationStart['xz'] || this.rotationStart['xy'];
                currentPoint = data.intersects['xz'] || data.intersects['xy'];
                originalPoint.x = 0;
                currentPoint.x = 0;
                axis = new THREE.Vector3(1, 0, 0);
            }
            if (this.axisConstraint === 'Y') {
                originalPoint = this.rotationStart['yz'] || this.rotationStart['xy'];
                currentPoint = data.intersects['yz'] || data.intersects['xy'];
                originalPoint.y = 0;
                currentPoint.y = 0;
                axis = new THREE.Vector3(0, 1, 0);
            }
            if (this.axisConstraint === 'Z') {
                originalPoint = this.rotationStart['xz'] || this.rotationStart['xz'];
                currentPoint = data.intersects['xz'] || data.intersects['xz'];
                originalPoint.z = 0;
                currentPoint.z = 0;
                axis = new THREE.Vector3(0, 0, 1);
            }
            var direction1 = new THREE.Vector3().subVectors(originalPoint, this.rotationCentroid);
            var direction2 = new THREE.Vector3().subVectors(currentPoint, this.rotationCentroid);
            this.rotationAngle = direction2.angleTo(direction1);
            for (var _b = 0, _c = this.select.objects; _b < _c.length; _b++) {
                var obj = _c[_b];
                var p = this.objectsOriginalPositions[obj.uuid];
                var r = this.objectsOriginalRotations[obj.uuid];
                obj.position.set(p.x, p.y, p.z);
                obj.rotation.set(r.x, r.y, r.z, r.order);
                this.rotateObjectAroundPoint(obj, this.rotationCentroid, axis, this.rotationAngle);
            }
        }
        else if (data.type === 'up') {
            this.rotationStart = null;
            this.rotationCentroid = null;
            this.rotationAngle = null;
            this.rotating = false;
            this.three.navigation.controls.enablePan = true;
            this.three.navigation.controls.enableRotate = true;
        }
    };
    ThreeRotationTool.prototype.updateGhostRotation = function (object, vector) {
        if (object.__selectGhost) {
            var ghost = object.__selectGhost;
            var newPosition = this.objectsOriginalPositions[ghost.uuid].clone().add(vector);
            ghost.position.set(newPosition.x, newPosition.y, newPosition.z);
        }
    };
    ThreeRotationTool.prototype.displayRotateOverlayTool = function () {
        if (!this.overlayTool) {
            this.createOverlayTool();
        }
        if (this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').add(this.overlayTool);
        this.overlayTool.userData.displayed = true;
        this.adjustOverlayToolPosition();
        this.adjustOverlayToolZoom();
        this.adjustActiveTool();
    };
    ThreeRotationTool.prototype.hideRotateOverlayTool = function () {
        if (!this.overlayTool || !this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayTool);
        this.overlayTool.userData.displayed = false;
    };
    ThreeRotationTool.prototype.createOverlayTool = function () {
        var group = new THREE.Group();
        var xCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
        var xCurveGeometry = new THREE.BufferGeometry().setFromPoints(xCurve.getPoints(50));
        var xLine = new THREE.Line(xCurveGeometry, new THREE.LineBasicMaterial({ color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        xLine.rotateOnAxis(new THREE.Vector3(0, 1, 0), -90 / 180 * Math.PI);
        var yCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
        var yCurveGeometry = new THREE.BufferGeometry().setFromPoints(yCurve.getPoints(50));
        var yLine = new THREE.Line(yCurveGeometry, new THREE.LineBasicMaterial({ color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        yLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);
        var zCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
        var zCurveGeometry = new THREE.BufferGeometry().setFromPoints(zCurve.getPoints(50));
        var zLine = new THREE.Line(zCurveGeometry, new THREE.LineBasicMaterial({ color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        xLine.userData = { axis: 'X' };
        yLine.userData = { axis: 'Y' };
        zLine.userData = { axis: 'Z' };
        group.add(xLine);
        group.add(yLine);
        group.add(zLine);
        group.name = '__rotate-tools__';
        var groupContainer = new THREE.Group;
        groupContainer.name = '__rotate-tools-container__';
        groupContainer.add(group);
        groupContainer.traverse(function (obj) {
            obj.renderOrder = 10;
            if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line) && (obj.material instanceof THREE.MeshBasicMaterial || obj.material instanceof THREE.LineBasicMaterial)) {
                obj.material.depthTest = false;
            }
        });
        this.overlayTool = groupContainer;
        this.adjustOverlayToolZoom();
    };
    ThreeRotationTool.prototype.adjustOverlayToolPosition = function () {
        if (!this.rotationCentroid)
            return;
        if (!this.overlayTool)
            return;
        var p = this.rotationCentroid;
        this.overlayTool.position.set(p.x, p.y, p.z);
    };
    ThreeRotationTool.prototype.adjustOverlayToolZoom = function () {
        if (!this.overlayTool)
            return;
        var camera = this.three.getCamera();
        if (camera instanceof THREE.OrthographicCamera) {
            var cameraZoom = camera.zoom;
            var tool = this.overlayTool.getObjectByName('__rotate-tools__');
            tool.scale.setScalar(10 / cameraZoom);
        }
    };
    ThreeRotationTool.prototype.adjustActiveTool = function () {
        var _this = this;
        if (!this.overlayTool)
            return;
        var tool = this.overlayTool.getObjectByName('__rotate-tools__');
        tool.traverse(function (obj) {
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                var material = obj.material;
                if (!_this.axisConstraint)
                    material.opacity = 0.5;
                else {
                    if (obj.userData.axis === _this.axisConstraint)
                        material.opacity = 1;
                    else
                        material.opacity = 0.1;
                }
            }
        });
    };
    return ThreeRotationTool;
}(ThreeTool));
export { ThreeRotationTool };
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;
    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position);
    }
    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);
    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position);
    }
    obj.rotateOnAxis(axis, theta);
}

//# sourceMappingURL=three-rotation-tool.js.map
