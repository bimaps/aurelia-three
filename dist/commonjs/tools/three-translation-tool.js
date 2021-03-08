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
exports.ThreeTranslationTool = void 0;
var three_selection_tool_1 = require("./three-selection-tool");
var three_tool_1 = require("./three-tool");
var aurelia_logging_1 = require("aurelia-logging");
var THREE = require("three");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var ThreeTranslationTool = (function (_super) {
    __extends(ThreeTranslationTool, _super);
    function ThreeTranslationTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'translate';
        _this.translating = false;
        _this.axisConstraint = null;
        _this.translateVector = null;
        _this.translationStart = null;
        _this.objectsOriginalPositions = {};
        _this.subscriptions = [];
        _this.log = aurelia_logging_1.getLogger('three-admin-translation');
        return _this;
    }
    ThreeTranslationTool.prototype.activeTranslationTool = function () {
        this.setConstraint(null);
    };
    ThreeTranslationTool.prototype.canRegister = function () {
        var selectTool = this.service.getRegisteredTool('select');
        return selectTool instanceof three_selection_tool_1.ThreeSelectionTool;
    };
    ThreeTranslationTool.prototype.onActivate = function () {
        var _this = this;
        var selectTool = this.service.getRegisteredTool('select');
        if (selectTool instanceof three_selection_tool_1.ThreeSelectionTool) {
            this.select = selectTool;
        }
        else {
            this.select = new three_selection_tool_1.ThreeSelectionTool(this.service);
            throw new Error('Translation tool requires the tool service to have the selection tool registered with `select` name');
        }
        this.displayTranslateOverlayTool();
        var ea = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', function (data) {
            if (!_this.active)
                return;
            if (_this.translating)
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
            if (_this.active)
                return;
            _this.adjustOverlayToolZoom();
        }));
    };
    ThreeTranslationTool.prototype.onDeactivate = function () {
        this.axisConstraint = null;
        this.hideTranslateOverlayTool();
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
    };
    ThreeTranslationTool.prototype.toggleTranslationTool = function () {
        if (this.active) {
            this.service.activate(this.select);
        }
        else {
            this.setConstraint(null);
        }
    };
    ThreeTranslationTool.prototype.setConstraint = function (constraint) {
        if (!this.active)
            this.service.activate(this);
        if (constraint) {
            this.axisConstraint = constraint;
        }
        else {
            this.axisConstraint = null;
        }
        this.adjustActiveTool();
    };
    ThreeTranslationTool.prototype.handlePlanesIntersects = function (data) {
        if (!this.active)
            return;
        if (!this.axisConstraint)
            return;
        if (data.type === 'down') {
            this.objectsOriginalPositions = {};
            for (var _i = 0, _a = this.select.objects; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.objectsOriginalPositions[obj.uuid] = obj.position.clone();
                if (obj.__selectGhost) {
                    var ghost = obj.__selectGhost;
                    this.objectsOriginalPositions[ghost.uuid] = ghost.position.clone();
                }
            }
            this.translationStart = data.intersects;
            this.translating = true;
            this.three.navigation.controls.enablePan = false;
            this.three.navigation.controls.enableRotate = false;
        }
        else if (data.type === 'move' && this.translationStart && this.translating) {
            var tx = 0;
            var ty = 0;
            var tz = 0;
            var prop = void 0;
            if (this.axisConstraint === 'X' || this.axisConstraint === 'Z' || this.axisConstraint === 'XZ') {
                prop = 'xz';
            }
            else if (this.axisConstraint === 'Y' || this.axisConstraint === 'YZ') {
                prop = 'yz';
            }
            else if (this.axisConstraint === 'XY') {
                prop = 'xy';
            }
            if (data.intersects[prop] !== null && this.translationStart[prop] !== null) {
                tx = data.intersects[prop].x - this.translationStart[prop].x;
                ty = data.intersects[prop].y - this.translationStart[prop].y;
                tz = data.intersects[prop].z - this.translationStart[prop].z;
            }
            var fullTranslateVector = new THREE.Vector3(tx, ty, tz);
            var constraintsTranslateVector = void 0;
            if (this.axisConstraint === 'X') {
                constraintsTranslateVector = fullTranslateVector.clone().setY(0).setZ(0);
            }
            else if (this.axisConstraint === 'Y') {
                constraintsTranslateVector = fullTranslateVector.clone().setX(0).setZ(0);
            }
            else if (this.axisConstraint === 'Z') {
                constraintsTranslateVector = fullTranslateVector.clone().setX(0).setY(0);
            }
            else if (this.axisConstraint === 'XY') {
                constraintsTranslateVector = fullTranslateVector.clone().setZ(0);
            }
            else if (this.axisConstraint === 'XZ') {
                constraintsTranslateVector = fullTranslateVector.clone().setY(0);
            }
            else if (this.axisConstraint === 'YZ') {
                constraintsTranslateVector = fullTranslateVector.clone().setX(0);
            }
            this.translateVector = constraintsTranslateVector;
            for (var _b = 0, _c = this.select.objects; _b < _c.length; _b++) {
                var obj = _c[_b];
                var newPosition = this.objectsOriginalPositions[obj.uuid].clone().add(constraintsTranslateVector);
                obj.position.set(newPosition.x, newPosition.y, newPosition.z);
                this.updateGhostPosition(obj, constraintsTranslateVector);
            }
            this.adjustOverlayToolPosition();
        }
        else if (data.type === 'up') {
            this.translationStart = null;
            this.translateVector = null;
            this.translating = false;
            this.three.navigation.controls.enablePan = true;
            this.three.navigation.controls.enableRotate = true;
        }
    };
    ThreeTranslationTool.prototype.updateGhostPosition = function (object, vector) {
        if (object.__selectGhost) {
            var ghost = object.__selectGhost;
            var newPosition = this.objectsOriginalPositions[ghost.uuid].clone().add(vector);
            ghost.position.set(newPosition.x, newPosition.y, newPosition.z);
        }
    };
    ThreeTranslationTool.prototype.displayTranslateOverlayTool = function () {
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
    ThreeTranslationTool.prototype.hideTranslateOverlayTool = function () {
        if (!this.overlayTool || !this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayTool);
        this.overlayTool.userData.displayed = false;
    };
    ThreeTranslationTool.prototype.createOverlayTool = function () {
        var group = new THREE.Group();
        var xLineGeometry = new THREE.Geometry();
        xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0));
        var yLineGeometry = new THREE.Geometry();
        yLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0));
        var zLineGeometry = new THREE.Geometry();
        zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 10));
        var xLine = new THREE.Line(xLineGeometry, new THREE.LineBasicMaterial({ color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        var yLine = new THREE.Line(yLineGeometry, new THREE.LineBasicMaterial({ color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        var zLine = new THREE.Line(zLineGeometry, new THREE.LineBasicMaterial({ color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        var xConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
        var xCone = new THREE.Mesh(xConeGeometry, new THREE.MeshBasicMaterial({ color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        xCone.rotateOnAxis(new THREE.Vector3(0, 0, 1), -90 / 180 * Math.PI);
        xCone.translateY(10);
        var yConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
        var yCone = new THREE.Mesh(yConeGeometry, new THREE.MeshBasicMaterial({ color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        yCone.translateY(10);
        var zConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
        var zCone = new THREE.Mesh(zConeGeometry, new THREE.MeshBasicMaterial({ color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide }));
        zCone.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 / 180 * Math.PI);
        zCone.translateY(10);
        var xzPlaneGeometry = new THREE.PlaneGeometry(5, 5);
        var xzPlaneMaterial = new THREE.MeshBasicMaterial({ color: '#f0f', opacity: 0.5, transparent: true, side: THREE.DoubleSide });
        var xzPlane = new THREE.Mesh(xzPlaneGeometry, xzPlaneMaterial);
        xzPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);
        xzPlane.translateX(2.5).translateY(-2.5);
        var xyPlaneGeometry = new THREE.PlaneGeometry(5, 5);
        var xyPlaneMaterial = new THREE.MeshBasicMaterial({ color: '#ff0', opacity: 0.5, transparent: true, side: THREE.DoubleSide });
        var xyPlane = new THREE.Mesh(xyPlaneGeometry, xyPlaneMaterial);
        xyPlane.translateX(2.5).translateY(2.5);
        var yzPlaneGeometry = new THREE.PlaneGeometry(5, 5);
        var yzPlaneMaterial = new THREE.MeshBasicMaterial({ color: '#0ff', opacity: 0.5, transparent: true, side: THREE.DoubleSide });
        var yzPlane = new THREE.Mesh(yzPlaneGeometry, yzPlaneMaterial);
        yzPlane.rotateOnAxis(new THREE.Vector3(0, 1, 0), -90 / 180 * Math.PI);
        yzPlane.translateX(2.5).translateY(2.5);
        xLine.userData = { axis: 'X' };
        yLine.userData = { axis: 'Y' };
        zLine.userData = { axis: 'Z' };
        xCone.userData = { axis: 'X' };
        yCone.userData = { axis: 'Y' };
        zCone.userData = { axis: 'Z' };
        xzPlane.userData = { axis: 'XZ' };
        xyPlane.userData = { axis: 'XY' };
        yzPlane.userData = { axis: 'YZ' };
        group.add(xLine);
        group.add(yLine);
        group.add(zLine);
        group.add(xCone);
        group.add(yCone);
        group.add(zCone);
        group.add(xzPlane);
        group.add(xyPlane);
        group.add(yzPlane);
        group.name = '__translate-tools__';
        var groupContainer = new THREE.Group;
        groupContainer.name = '__translate-tools-container__';
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
    ThreeTranslationTool.prototype.adjustOverlayToolPosition = function () {
        var p = this.select.center;
        this.overlayTool.position.set(p.x, p.y, p.z);
    };
    ThreeTranslationTool.prototype.adjustOverlayToolZoom = function () {
        if (!this.overlayTool)
            return;
        var camera = this.three.getCamera();
        if (camera instanceof THREE.OrthographicCamera) {
            var cameraZoom = camera.zoom;
            var tool = this.overlayTool.getObjectByName('__translate-tools__');
            tool.scale.setScalar(10 / cameraZoom);
        }
    };
    ThreeTranslationTool.prototype.adjustActiveTool = function () {
        var _this = this;
        if (!this.overlayTool)
            return;
        var tool = this.overlayTool.getObjectByName('__translate-tools__');
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
    return ThreeTranslationTool;
}(three_tool_1.ThreeTool));
exports.ThreeTranslationTool = ThreeTranslationTool;

//# sourceMappingURL=three-translation-tool.js.map
