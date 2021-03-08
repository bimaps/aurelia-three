"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeSliceTool = void 0;
var three_logger_1 = require("./../helpers/three-logger");
var three_utils_1 = require("./../helpers/three-utils");
var slice_path_composer_1 = require("../helpers/slice-path-composer");
var three_tool_1 = require("./three-tool");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_logging_1 = require("aurelia-logging");
var THREE = require("three");
var log = aurelia_logging_1.getLogger('three-slice-tool');
var logThree;
var ThreeSliceTool = (function (_super) {
    __extends(ThreeSliceTool, _super);
    function ThreeSliceTool(service) {
        var _this = _super.call(this, service) || this;
        _this.closureMaterial = new THREE.MeshBasicMaterial({ color: '#79007A', side: THREE.DoubleSide });
        _this.offsetClosureFromPlane = 0.01;
        _this.multiplier = 10000;
        _this.refNormal = new THREE.Vector3(0, 0, 1);
        _this.xProp = 'x';
        _this.yProp = 'y';
        _this.showSliceTranslation = true;
        _this.showSliceYRotation = true;
        _this.showSliceZRotation = false;
        _this.showPlaneHelper = true;
        _this.name = 'slice';
        _this.subscriptions = [];
        _this.toolPosition = new THREE.Vector3(0, 0, 0);
        _this.toolOrientation = new THREE.Vector3(1, 0, 0);
        _this.plane = new THREE.Plane(new THREE.Vector3(1, 0, 0));
        _this.constraint = null;
        _this.movePlaneRef = new THREE.Vector3(1, 0, 0);
        _this.isSlicing = false;
        _this.movingPlane = false;
        _this.movingStart = null;
        _this.originalPosition = null;
        _this.originalOrientation = null;
        _this.originalQuaternion = null;
        _this.originalMouse = null;
        _this.yPlane = null;
        _this.zPlane = null;
        _this.originalPlanePoint = null;
        _this.originalYPoint = null;
        _this.originalZPoint = null;
        logThree = new three_logger_1.ThreeLogger(service.three);
        logThree.log = false;
        _this.three = service.three;
        return _this;
    }
    ThreeSliceTool.prototype.onActivate = function () {
        var _this = this;
        if (!this.isSlicing) {
            this.setPlane('X');
        }
        this.setPlaneFromTool();
        this.toggleSlicing(true);
        var ea = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', function (data) {
            if (data[0] && data[0].object.name === 'slice-plane-helper') {
                log.debug('hover plane helper');
                _this.planeHelper.material.opacity = 1;
            }
            else {
                _this.planeHelper.material.opacity = 0.5;
            }
            if (!_this.active)
                return;
            if (_this.movingPlane)
                return;
            for (var _i = 0, _a = data.map(function (i) { return i.object; }); _i < _a.length; _i++) {
                var object = _a[_i];
                if (object.userData.constraint) {
                    return _this.setConstraint(object.userData.constraint);
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
            _this.adjustOverlayToolPosition();
            _this.adjustOverlayToolZoom();
        }));
        this.displaySliceOverlayPlane();
        this.displaySliceOverlayTool();
        this.generateClosures();
    };
    ThreeSliceTool.prototype.onDeactivate = function () {
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
        this.hideSliceOverlayPlane();
        this.hideSliceOverlayTool();
    };
    ThreeSliceTool.prototype.toggleSliceTool = function () {
        if (this.active) {
            this.service.deactivateAll();
        }
        else {
            this.service.activate(this);
        }
    };
    ThreeSliceTool.prototype.toggleSlicing = function (value) {
        var renderer = this.three.getRenderer();
        if (renderer instanceof THREE.WebGLRenderer) {
            this.isSlicing = value !== undefined ? value : !this.isSlicing;
            if (this.isSlicing) {
                renderer.clippingPlanes = [this.plane];
            }
            else {
                renderer.clippingPlanes = [];
                this.hideClosures();
            }
        }
        else {
            this.isSlicing = false;
            this.hideClosures();
        }
    };
    ThreeSliceTool.prototype.setConstraint = function (constraint) {
        if (!this.active)
            this.service.activate(this);
        if (constraint) {
            this.constraint = constraint;
        }
        else {
            this.constraint = null;
        }
        this.adjustActiveTool();
    };
    ThreeSliceTool.prototype.setPlane = function (plane) {
        log.debug('setPlane', plane);
        this.hideClosures();
        var normal;
        if (plane === 'X')
            normal = new THREE.Vector3(1, 0, 0);
        if (plane === 'Y')
            normal = new THREE.Vector3(0, 1, 0);
        if (plane === 'Z')
            normal = new THREE.Vector3(0, 0, 1);
        if (plane instanceof THREE.Plane) {
            normal = plane.normal;
            var position = plane.normal.clone().setLength(plane.constant);
            log.debug('normal', normal);
            log.debug('position', position);
            this.toolPosition.set(position.x, position.y, position.z);
        }
        else {
            var cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.three.getCamera().quaternion);
            var normalProjected = normal.clone().projectOnVector(cameraDirection).normalize();
            if (normalProjected.angleTo(cameraDirection) > 0.1) {
                normal.negate();
            }
            var position = three_utils_1.ThreeUtils.centroidFromBbox(this.three.objects.getBbox());
            var projectedPosition = position.projectOnVector(normal);
            this.toolPosition.set(projectedPosition.x, projectedPosition.y, projectedPosition.z);
        }
        this.toolOrientation.set(normal.x, normal.y, normal.z);
        this.setPlaneFromTool();
        this.adjustOverlayToolPosition();
        this.adjustOverlayToolZoom();
        this.generateClosures();
    };
    ThreeSliceTool.prototype.revertPlane = function () {
        this.hideClosures();
        var normal = this.toolOrientation.clone().negate();
        this.toolOrientation.set(normal.x, normal.y, normal.z);
        this.setPlaneFromTool();
        this.adjustOverlayToolPosition();
        this.adjustOverlayToolZoom();
        this.generateClosures();
    };
    ThreeSliceTool.prototype.clearSlicing = function () {
    };
    ThreeSliceTool.prototype.setPlaneFromTool = function () {
        if (this.toolOrientation.length() !== 1) {
            this.toolOrientation.normalize();
        }
        var project = this.toolPosition.clone().projectOnVector(this.toolOrientation);
        var constant = 0;
        if (project.length() !== 0) {
            var angle = project.angleTo(this.toolOrientation);
            constant = (angle > 0.1) ? project.length() : project.length() * -1;
        }
        this.plane.normal.set(this.toolOrientation.x, this.toolOrientation.y, this.toolOrientation.z);
        this.plane.constant = constant;
    };
    ThreeSliceTool.prototype.handlePlanesIntersects = function (data) {
        if (!this.active)
            return;
        if (!this.constraint)
            return;
        if (data.type === 'down') {
            this.three.navigation.controls.enablePan = false;
            this.three.navigation.controls.enableRotate = false;
            this.movingPlane = true;
            this.movingStart = data.intersects;
            this.originalPosition = this.toolPosition.clone();
            this.originalOrientation = this.toolOrientation.clone();
            this.originalQuaternion = new THREE.Quaternion().setFromUnitVectors(this.movePlaneRef, this.toolOrientation);
            this.originalMouse = data.mouse.clone();
            var yPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
            var zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
            var matrix = new THREE.Matrix4().makeRotationFromQuaternion(this.originalQuaternion);
            yPlane.normal.applyMatrix4(matrix);
            zPlane.normal.applyMatrix4(matrix);
            this.yPlane = yPlane;
            this.zPlane = zPlane;
            logThree.logPlane(this.yPlane, 'y-plane', 'red', 3000);
            logThree.logPlane(this.zPlane, 'z-plane', 'green', 3000);
            var ray = new THREE.Raycaster();
            ray.setFromCamera(this.originalMouse, this.three.getCamera());
            this.originalPlanePoint = ray.ray.intersectPlane(new THREE.Plane(this.three.getCamera().getWorldDirection(new THREE.Vector3())), new THREE.Vector3());
            this.originalYPoint = ray.ray.intersectPlane(yPlane, new THREE.Vector3());
            this.originalZPoint = ray.ray.intersectPlane(zPlane, new THREE.Vector3());
            logThree.logPoints(this.originalYPoint, 'original-y', 'red');
            logThree.logPoints(this.originalZPoint, 'original-z', 'green');
            this.hideClosures();
        }
        else if (data.type === 'move' && this.movingStart && this.movingPlane) {
            var ray = new THREE.Raycaster();
            ray.setFromCamera(data.mouse, this.three.getCamera());
            if (this.constraint === 'normal') {
                var currentPoint = ray.ray.intersectPlane(new THREE.Plane(this.three.getCamera().getWorldDirection(new THREE.Vector3())), new THREE.Vector3());
                var translation = currentPoint && this.originalPlanePoint
                    ? new THREE.Vector3().subVectors(currentPoint, this.originalPlanePoint).projectOnVector(this.toolOrientation) : new THREE.Vector3(0, 0, 0);
                if (translation.length()) {
                    var newPosition = this.originalPosition.clone().add(translation);
                    this.toolPosition.set(newPosition.x, newPosition.y, newPosition.z);
                    this.setPlaneFromTool();
                    this.adjustOverlayToolPosition();
                }
            }
            if (this.constraint === 'z') {
                var currentZPoint = ray.ray.intersectPlane(this.zPlane, new THREE.Vector3());
                logThree.logPoints(currentZPoint, 'current-z', 'green');
                var quat = new THREE.Quaternion();
                quat.setFromUnitVectors(this.originalZPoint.clone().sub(this.originalPosition).normalize(), currentZPoint.clone().sub(this.originalPosition).normalize());
                var matrix = new THREE.Matrix4();
                matrix.makeRotationFromQuaternion(quat);
                this.toolOrientation = this.originalOrientation.clone().applyMatrix4(matrix);
                this.setPlaneFromTool();
                this.adjustOverlayToolPosition();
            }
            if (this.constraint === 'y') {
                var currentYPoint = ray.ray.intersectPlane(this.yPlane, new THREE.Vector3());
                logThree.logPoints(currentYPoint, 'current-z', 'green');
                var quat = new THREE.Quaternion();
                quat.setFromUnitVectors(this.originalYPoint.clone().sub(this.originalPosition).normalize(), currentYPoint.clone().sub(this.originalPosition).normalize());
                var matrix = new THREE.Matrix4();
                matrix.makeRotationFromQuaternion(quat);
                this.toolOrientation = this.originalOrientation.clone().applyMatrix4(matrix);
                this.setPlaneFromTool();
                this.adjustOverlayToolPosition();
            }
        }
        else if (data.type === 'up') {
            this.movingPlane = null;
            this.movingStart = null;
            this.originalPosition = null;
            this.originalOrientation = null;
            this.originalQuaternion = null;
            this.originalMouse = null;
            this.yPlane = null;
            this.zPlane = null;
            this.originalPlanePoint = null;
            this.originalYPoint = null;
            this.originalZPoint = null;
            logThree.logPlane(null, 'y-plane', 'red');
            logThree.logPlane(null, 'z-plane', 'green');
            this.three.navigation.controls.enablePan = true;
            this.three.navigation.controls.enableRotate = true;
            this.generateClosures();
        }
    };
    ThreeSliceTool.prototype.hideClosures = function () {
        var objToRemove = [];
        this.three.getScene().traverse(function (obj) {
            if (obj.userData.__isSliceClosure) {
                objToRemove.push(obj);
            }
        });
        for (var _i = 0, objToRemove_1 = objToRemove; _i < objToRemove_1.length; _i++) {
            var obj = objToRemove_1[_i];
            this.three.getScene().remove(obj);
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
            }
        }
    };
    ThreeSliceTool.prototype.generateClosures = function () {
        var _this = this;
        this.three.getScene().traverse(function (obj) {
            if (obj instanceof THREE.Mesh && !obj.userData.__isOverlay) {
                var closures = _this.generateObjectClosure(obj, _this.plane);
                for (var _i = 0, closures_1 = closures; _i < closures_1.length; _i++) {
                    var closure = closures_1[_i];
                    obj.add(closure);
                }
            }
        });
    };
    ThreeSliceTool.prototype.round = function (v) {
        v.x = Math.round(v.x * this.multiplier) / this.multiplier;
        v.y = Math.round(v.y * this.multiplier) / this.multiplier;
        v.z = Math.round(v.z * this.multiplier) / this.multiplier;
        return v;
    };
    ThreeSliceTool.prototype.generateObjectClosure = function (object, plane) {
        var _this = this;
        var slicePathComposer = new slice_path_composer_1.SlicePathComposer();
        var geometry = object.geometry instanceof THREE.BufferGeometry
            ? object.geometry
            : new THREE.BufferGeometry().fromGeometry(object.geometry);
        if (geometry.index !== null) {
            geometry = geometry.toNonIndexed();
        }
        var faces = [];
        var length = geometry.attributes.position.array.length;
        var array = geometry.attributes.position.array;
        for (var index = 0; index < length; index += 9) {
            var v1 = this.round(new THREE.Vector3(array[index], array[index + 1], array[index + 2]));
            var v2 = this.round(new THREE.Vector3(array[index + 3], array[index + 4], array[index + 5]));
            var v3 = this.round(new THREE.Vector3(array[index + 6], array[index + 7], array[index + 8]));
            v1 = object.localToWorld(v1);
            v2 = object.localToWorld(v2);
            v3 = object.localToWorld(v3);
            faces.push([v1, v2, v3]);
        }
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            var l1 = new THREE.Line3(face[0], face[1]);
            var l2 = new THREE.Line3(face[1], face[2]);
            var l3 = new THREE.Line3(face[2], face[0]);
            var intersect1 = plane.intersectLine(l1, new THREE.Vector3);
            var intersect2 = plane.intersectLine(l2, new THREE.Vector3);
            var intersect3 = plane.intersectLine(l3, new THREE.Vector3);
            var pathPoints = [];
            if (intersect1) {
                pathPoints.push({
                    point: intersect1,
                    p1: l1.start,
                    p2: l1.end
                });
            }
            if (intersect2) {
                pathPoints.push({
                    point: intersect2,
                    p1: l2.start,
                    p2: l2.end
                });
            }
            if (intersect3) {
                pathPoints.push({
                    point: intersect3,
                    p1: l3.start,
                    p2: l3.end
                });
            }
            if (pathPoints.length === 3) {
                var distance0 = plane.distanceToPoint(face[0]);
                var distance1 = plane.distanceToPoint(face[1]);
                var distance2 = plane.distanceToPoint(face[2]);
                if (distance0 !== 0 && distance1 === 0 && distance2 === 0) {
                    slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[2].point, pathPoints[2].p1, pathPoints[2].p2);
                }
                else if (distance1 !== 0 && distance0 === 0 && distance2 === 0) {
                    slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
                }
                else if (distance2 !== 0 && distance1 === 0 && distance0 === 0) {
                    slicePathComposer.addDoublePoints(pathPoints[2].point, pathPoints[2].p1, pathPoints[2].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
                }
            }
            if (pathPoints.length === 2) {
                slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
            }
        }
        var meshs = [];
        var quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(plane.normal, this.refNormal);
        var matrix = new THREE.Matrix4();
        matrix.makeRotationFromQuaternion(quaternion);
        var matrix2 = new THREE.Matrix4();
        quaternion.inverse();
        matrix2.makeRotationFromQuaternion(quaternion);
        for (var _a = 0, _b = slicePathComposer.paths; _a < _b.length; _a++) {
            var path = _b[_a];
            logThree.logPoints(path, "path", 'black', 5000);
            var pathPoints = path.map(function (point, index) {
                var newPoint = _this.round(point.clone().applyMatrix4(matrix));
                logThree.logPoints(newPoint, "path-point-" + index, 'pink');
                return new THREE.Vector2(newPoint[_this.xProp], newPoint[_this.yProp]);
            });
            var shape = new THREE.Shape(pathPoints);
            var shapeGeometry = new THREE.ShapeBufferGeometry(shape);
            shapeGeometry.applyMatrix(matrix2);
            var shapeMesh = new THREE.Mesh(shapeGeometry, this.closureMaterial);
            shapeMesh.userData.__isSliceClosure = true;
            shapeMesh.userData.__isOverlay = true;
            shapeMesh.userData.__originalObject = object;
            shapeMesh.translateOnAxis(plane.normal, plane.constant * -1);
            shapeMesh.translateOnAxis(plane.normal, this.offsetClosureFromPlane);
            meshs.push(shapeMesh);
        }
        return meshs;
    };
    ThreeSliceTool.prototype.displaySliceOverlayPlane = function () {
        if (!this.overlayPlane) {
            this.createOverlayPlane();
        }
        if (this.overlayPlane.userData.displayed)
            return;
        this.overlayPlane.userData.displayed = true;
    };
    ThreeSliceTool.prototype.hideSliceOverlayPlane = function () {
        if (!this.overlayPlane || !this.overlayPlane.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayPlane);
        this.overlayPlane.userData.displayed = false;
    };
    ThreeSliceTool.prototype.createOverlayPlane = function () {
        var planeHelper = new THREE.PlaneHelper(this.plane, 50);
        if (!this.showPlaneHelper || true) {
            planeHelper.visible = false;
        }
        this.overlayPlane = planeHelper;
    };
    ThreeSliceTool.prototype.displaySliceOverlayTool = function () {
        if (!this.overlayPlane) {
            this.createOverlayPlane();
        }
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
    ThreeSliceTool.prototype.hideSliceOverlayTool = function () {
        if (!this.overlayTool || !this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayTool);
        this.overlayTool.userData.displayed = false;
    };
    ThreeSliceTool.prototype.createOverlayTool = function () {
        var group = new THREE.Group();
        var normalLineGeometry = new THREE.Geometry();
        normalLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0));
        var normalLine = new THREE.Line(normalLineGeometry, new THREE.LineBasicMaterial({ color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide }));
        normalLine.translateX(-10);
        var normalConeGeometry = new THREE.ConeGeometry(0.6, 1.2);
        var normalCone = new THREE.Mesh(normalConeGeometry, new THREE.MeshBasicMaterial({ color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide }));
        normalCone.rotateOnAxis(new THREE.Vector3(0, 0, 1), -90 / 180 * Math.PI);
        normalCone.translateY(-0.6);
        var zCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
        var zCurveGeometry = new THREE.BufferGeometry().setFromPoints(zCurve.getPoints(50));
        var zLine = new THREE.Line(zCurveGeometry, new THREE.LineBasicMaterial({ color: 'green', opacity: 0.8, transparent: true, side: THREE.FrontSide }));
        var yCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
        var yCurveGeometry = new THREE.BufferGeometry().setFromPoints(yCurve.getPoints(50));
        var yLine = new THREE.Line(yCurveGeometry, new THREE.LineBasicMaterial({ color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide }));
        yLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);
        zLine.userData = { constraint: 'z' };
        yLine.userData = { constraint: 'y' };
        normalLine.userData = { constraint: 'normal' };
        normalCone.userData = { constraint: 'normal' };
        var planeGeometry = new THREE.Geometry();
        planeGeometry.vertices.push(new THREE.Vector3(0, -20, -20));
        planeGeometry.vertices.push(new THREE.Vector3(0, -20, 20));
        planeGeometry.vertices.push(new THREE.Vector3(0, 20, 20));
        planeGeometry.vertices.push(new THREE.Vector3(0, 20, -20));
        planeGeometry.vertices.push(new THREE.Vector3(0, -20, -20));
        var planeMesh = new THREE.Line(planeGeometry, new THREE.LineBasicMaterial({ color: 'black', opacity: 0.1, transparent: true, side: THREE.DoubleSide }));
        planeMesh.name = 'slice-plane-helper';
        this.planeHelper = planeMesh;
        if (this.showSliceYRotation) {
            group.add(yLine);
        }
        if (this.showSliceZRotation) {
            group.add(zLine);
        }
        if (this.showSliceTranslation) {
            group.add(normalLine);
            group.add(normalCone);
        }
        if (this.showPlaneHelper) {
            group.add(planeMesh);
        }
        group.name = '__slice-tools__';
        var groupContainer = new THREE.Group;
        groupContainer.name = '__slice-tools-container__';
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
    ThreeSliceTool.prototype.adjustOverlayToolPosition = function () {
        if (!this.overlayTool)
            return;
        if (!this.overlayPlane)
            return;
        this.overlayTool.position.set(this.toolPosition.x, this.toolPosition.y, this.toolPosition.z);
        this.overlayTool.rotation.set(this.toolOrientation.x, this.toolOrientation.y, this.toolOrientation.z);
        var quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), this.toolOrientation);
        this.overlayTool.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    };
    ThreeSliceTool.prototype.adjustOverlayToolZoom = function () {
        if (!this.overlayTool)
            return;
        var camera = this.three.getCamera();
        if (camera instanceof THREE.OrthographicCamera) {
            var cameraZoom = camera.zoom;
            var tool = this.overlayTool.getObjectByName('__slice-tools__');
            tool.scale.setScalar(10 / cameraZoom);
            this.overlayPlane.size = 100 * 10 / cameraZoom;
        }
    };
    ThreeSliceTool.prototype.adjustActiveTool = function () {
        var _this = this;
        if (!this.overlayTool)
            return;
        var tool = this.overlayTool.getObjectByName('__slice-tools__');
        tool.traverse(function (obj) {
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                var material = obj.material;
                if (!_this.constraint)
                    material.opacity = 0.8;
                else {
                    if (obj.userData.constraint === _this.constraint || (_this.active && obj === _this.planeHelper))
                        material.opacity = 1;
                    else
                        material.opacity = 0.1;
                }
            }
        });
    };
    ThreeSliceTool.prototype.slicePosition = function () {
        return this.toolPosition;
    };
    ThreeSliceTool.prototype.sliceOrientation = function () {
        return this.toolOrientation;
    };
    return ThreeSliceTool;
}(three_tool_1.ThreeTool));
exports.ThreeSliceTool = ThreeSliceTool;

//# sourceMappingURL=three-slice-tool.js.map
