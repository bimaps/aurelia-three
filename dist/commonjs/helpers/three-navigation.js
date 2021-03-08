"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeNavigation = void 0;
var THREE = require("three");
var tween_js_1 = require("@tweenjs/tween.js");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_framework_1 = require("aurelia-framework");
var OrbitControls = require("three-orbitcontrols");
var aurelia_logging_1 = require("aurelia-logging");
var ThreeNavigation = (function () {
    function ThreeNavigation(three) {
        this.log = aurelia_logging_1.getLogger('three-navigation');
        this.cameraIsAnimating = false;
        this.observationOn = false;
        this.observationCameraFrustrumFactor = 2;
        this.observationCameraZoom = 3;
        this.three = three;
    }
    ThreeNavigation.prototype.initControls = function () {
        var _this = this;
        var camera = this.three.getCamera();
        if (!camera)
            return;
        this.controls = new OrbitControls(camera, this.three.getRenderer().domElement);
        this.controls.minZoom = 0.0001;
        this.controls.mouseButtons.PAN = 0;
        this.controls.mouseButtons.ORBIT = 2;
        this.controls.addEventListener('change', function () {
            if (camera instanceof THREE.OrthographicCamera) {
                _this.three.cameraZoom = camera.zoom;
            }
            _this.three.requestRendering();
            _this.three.publish('camera:moved');
        });
    };
    ThreeNavigation.prototype.zoomOnBbox = function (bbox, orientation, animate, render) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        if (render === void 0) { render = true; }
        var showBbox = false;
        var showBboxDuration = 10000;
        if (showBbox) {
            if (this.zoomOnBboxObject)
                this.three.getScene().remove(this.zoomOnBboxObject);
            var width = bbox.max.x - bbox.min.x;
            var height = bbox.max.y - bbox.min.y;
            var depth = bbox.max.z - bbox.min.z;
            var x = (bbox.max.x + bbox.min.x) / 2;
            var y = (bbox.max.y + bbox.min.y) / 2;
            var z = (bbox.max.z + bbox.min.z) / 2;
            var geometry = new THREE.BoxGeometry(width, height, depth);
            var material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
            this.zoomOnBboxObject = new THREE.Mesh(geometry, material);
            this.zoomOnBboxObject.position.set(x, y, z);
            this.zoomOnBboxObject.userData._isHelper = true;
            this.three.objects.addObject(this.zoomOnBboxObject);
            if (showBboxDuration) {
                setTimeout(function () {
                    if (_this.zoomOnBboxObject)
                        _this.three.getScene().remove(_this.zoomOnBboxObject);
                }, 10000);
            }
        }
        var newCameraPosition = new THREE.Vector3();
        var newCameraRotation = new THREE.Vector3();
        var newCameraZoom;
        var bboxCenterPosition = new THREE.Vector3();
        bbox.getCenter(bboxCenterPosition);
        var bboxWidth = bbox.max.x - bbox.min.x;
        var bboxHeight = bbox.max.y - bbox.min.y;
        var bboxDepth = bbox.max.z - bbox.min.z;
        var z1;
        var z2;
        var z3;
        var z4;
        var z5;
        switch (orientation) {
            case 'top':
                newCameraPosition.x = bboxCenterPosition.x;
                newCameraPosition.y = bboxCenterPosition.y + bboxHeight * 1.1;
                newCameraPosition.z = bboxCenterPosition.z;
                newCameraRotation.x = Math.PI / 2 * -1;
                newCameraRotation.y = 0;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case 'bottom':
                newCameraPosition.x = bboxCenterPosition.x;
                newCameraPosition.y = bboxCenterPosition.y + bboxHeight * -1.1;
                newCameraPosition.z = bboxCenterPosition.z;
                newCameraRotation.x = Math.PI / 2 * 1;
                newCameraRotation.y = 0;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case 'right':
                newCameraPosition.x = bboxCenterPosition.x + bboxHeight * 1.1;
                newCameraPosition.y = bboxCenterPosition.y;
                newCameraPosition.z = bboxCenterPosition.z;
                newCameraRotation.x = 0;
                newCameraRotation.y = Math.PI / 2 * -1;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case 'left':
                newCameraPosition.x = bboxCenterPosition.x + bboxHeight * -1.1;
                newCameraPosition.y = bboxCenterPosition.y;
                newCameraPosition.z = bboxCenterPosition.z;
                newCameraRotation.x = 0;
                newCameraRotation.y = Math.PI / 2 * 1;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case 'front':
                newCameraPosition.x = bboxCenterPosition.x;
                newCameraPosition.y = bboxCenterPosition.y;
                newCameraPosition.z = bboxCenterPosition.z + bboxHeight * 1.1;
                newCameraRotation.x = 0;
                newCameraRotation.y = 0;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case 'back':
                newCameraPosition.x = bboxCenterPosition.x;
                newCameraPosition.y = bboxCenterPosition.y;
                newCameraPosition.z = bboxCenterPosition.z + bboxHeight * -1.1;
                newCameraRotation.x = 0;
                newCameraRotation.y = Math.PI;
                newCameraRotation.z = 0;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
                z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
                newCameraZoom = Math.min(z1, z2) * 0.9;
                break;
            case '3d':
                var offset = 20;
                newCameraPosition.x = bboxCenterPosition.x + offset;
                newCameraPosition.y = bboxCenterPosition.y + offset;
                newCameraPosition.z = bboxCenterPosition.z + offset;
                newCameraRotation.x = Math.PI / 4 * -1;
                newCameraRotation.y = Math.PI / 4;
                newCameraRotation.z = Math.PI / 4;
                z1 = this.three.getSceneElement().offsetWidth / bboxWidth * 0.75;
                z2 = this.three.getSceneElement().offsetHeight / bboxWidth * 0.75;
                z3 = this.three.getSceneElement().offsetHeight / bboxHeight * 0.75;
                z4 = this.three.getSceneElement().offsetWidth / bboxDepth * 0.75;
                z5 = this.three.getSceneElement().offsetHeight / bboxDepth * 0.75;
                newCameraZoom = Math.min(z1, z2, z3, z4, z5) * 0.9;
                break;
            default:
        }
        var camera = this.three.getCamera();
        if (!animate) {
            camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z);
            camera.lookAt(bboxCenterPosition);
            this.controls.target = bboxCenterPosition;
            if (camera instanceof THREE.OrthographicCamera) {
                camera.zoom = newCameraZoom;
                camera.updateProjectionMatrix();
            }
            camera.updateMatrixWorld();
            if (render)
                this.three.requestRendering();
            return;
        }
        this.controls.enabled = false;
        var currentLookAt = new THREE.Vector3(0, 0, -1);
        currentLookAt.applyQuaternion(camera.quaternion);
        var currentOrientation = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
            rotationX: camera.rotation.x,
            rotationY: camera.rotation.y,
            rotationZ: camera.rotation.z,
            lookAtX: this.controls.target.x,
            lookAtY: this.controls.target.y,
            lookAtZ: this.controls.target.z,
            targetX: this.controls.target.x,
            targetY: this.controls.target.y,
            targetZ: this.controls.target.z
        };
        if (camera instanceof THREE.OrthographicCamera) {
            currentOrientation.zoom = camera.zoom;
        }
        var newOrientation = {
            x: newCameraPosition.x,
            y: newCameraPosition.y,
            z: newCameraPosition.z,
            rotationX: newCameraRotation.x,
            rotationY: newCameraRotation.y,
            rotationZ: newCameraRotation.z,
            lookAtX: bboxCenterPosition.x,
            lookAtY: bboxCenterPosition.y,
            lookAtZ: bboxCenterPosition.z,
            zoom: newCameraZoom,
            targetX: bboxCenterPosition.x,
            targetY: bboxCenterPosition.y,
            targetZ: bboxCenterPosition.z
        };
        if (this.tweenCamera !== undefined) {
            this.tweenCamera.stop();
        }
        this.tweenCamera = new tween_js_1.default.Tween(currentOrientation)
            .to(newOrientation, 1000).onUpdate(function () {
            camera.position.set(currentOrientation.x, currentOrientation.y, currentOrientation.z);
            camera.rotation.x = currentOrientation.rotationX;
            camera.rotation.y = currentOrientation.rotationY;
            camera.rotation.z = currentOrientation.rotationZ;
            camera.lookAt(new THREE.Vector3(currentOrientation.lookAtX, currentOrientation.lookAtY, currentOrientation.lookAtZ));
            if (orientation === 'top') {
                camera.rotation.z = currentOrientation.rotationZ;
            }
            _this.controls.target = new THREE.Vector3(currentOrientation.targetX, currentOrientation.targetY, currentOrientation.targetZ);
            if (camera instanceof THREE.OrthographicCamera) {
                camera.zoom = currentOrientation.zoom;
                camera.updateProjectionMatrix();
            }
            camera.updateMatrixWorld();
        }).onStart(function () {
            _this.cameraIsAnimating = true;
        }).onStop(function () {
            _this.cameraIsAnimating = false;
        }).onComplete(function () {
            _this.cameraIsAnimating = false;
            _this.controls.enabled = true;
            if (camera instanceof THREE.OrthographicCamera) {
                camera.updateProjectionMatrix();
            }
            camera.updateMatrixWorld();
        });
        this.cameraIsAnimating = true;
        this.tweenCamera.start();
        this.three.requestRendering();
    };
    ThreeNavigation.prototype.zoom = function (target, factor, orientation, animate, render) {
        if (orientation === void 0) { orientation = '3d'; }
        if (animate === void 0) { animate = false; }
        if (render === void 0) { render = true; }
        if (target === 'scene') {
            var bbox_1 = null;
            this.three.getScene().traverse(function (object) {
                if (!object.visible)
                    return;
                if (object.type === 'Scene')
                    return;
                if (object.type === 'AmbientLight')
                    return;
                if (object.type === 'SpotLight')
                    return;
                if (object.type === 'OrthographicCamera')
                    return;
                if (object instanceof THREE.SpotLightHelper)
                    return;
                if (object instanceof THREE.AxesHelper)
                    return;
                if (object.userData._isHelper)
                    return;
                if (!bbox_1) {
                    bbox_1 = new THREE.Box3();
                    bbox_1.setFromObject(object);
                }
                else {
                    bbox_1.expandByObject(object);
                }
            });
            if (bbox_1) {
                if (factor === 'auto') {
                    bbox_1 = this.three.autoExtendBbox(bbox_1);
                }
                else {
                    bbox_1 = this.three.scaleBbox(bbox_1, factor);
                }
                this.zoomOnBbox(bbox_1, orientation, animate, render);
            }
        }
        else if (target === 'currentBbox') {
            var bbox = void 0;
            if (factor === 'auto') {
                bbox = this.three.autoExtendBbox(this.three.objects.getBbox());
            }
            else {
                bbox = this.three.scaleBbox(this.three.objects.getBbox(), factor);
            }
            this.zoomOnBbox(bbox, orientation, animate, render);
        }
        else if (typeof target === 'string') {
            var scene = new THREE.Scene();
            var hasObjects = false;
            var bbox_2;
            this.three.getScene().traverse(function (object) {
                if (object["_" + target]) {
                    if (!bbox_2) {
                        bbox_2 = new THREE.Box3();
                        bbox_2.setFromObject(object);
                    }
                    else {
                        bbox_2.expandByObject(object);
                    }
                }
            });
            if (bbox_2) {
                if (factor === 'auto') {
                    bbox_2 = this.three.autoExtendBbox(bbox_2);
                }
                else {
                    bbox_2 = this.three.scaleBbox(bbox_2, factor);
                }
                this.zoomOnBbox(bbox_2, orientation, animate, render);
            }
        }
        else if (typeof target === 'object' && target instanceof THREE.Object3D) {
            var bbox = new THREE.Box3().setFromObject(target);
            if (factor === 'auto') {
                bbox = this.three.autoExtendBbox(bbox);
            }
            else {
                bbox = this.three.scaleBbox(bbox, factor);
            }
            this.zoomOnBbox(bbox, orientation, animate, render);
        }
        else if (typeof target === 'object' && target instanceof THREE.Box3) {
            var bbox = target;
            if (factor === 'auto') {
                bbox = this.three.autoExtendBbox(bbox);
            }
            else {
                bbox = this.three.scaleBbox(bbox, factor);
            }
            this.zoomOnBbox(bbox, orientation, animate, render);
        }
        else if (Array.isArray(target) && target.length) {
            var bbox = void 0;
            for (var _i = 0, target_1 = target; _i < target_1.length; _i++) {
                var object = target_1[_i];
                var objectBbox = new THREE.Box3().setFromObject(object);
                if (this.three.isBbox000(objectBbox))
                    continue;
                if (!bbox) {
                    bbox = new THREE.Box3();
                    bbox.setFromObject(object);
                }
                else {
                    bbox.expandByObject(object);
                }
            }
            if (factor === 'auto') {
                bbox = this.three.autoExtendBbox(bbox);
            }
            else {
                bbox = this.three.scaleBbox(bbox, factor);
            }
            this.zoomOnBbox(bbox, orientation, animate, render);
        }
    };
    ThreeNavigation.prototype.zoomOnObject = function (object, factor, orientation, animate, render) {
        if (factor === void 0) { factor = 1; }
        if (orientation === void 0) { orientation = 'top'; }
        if (animate === void 0) { animate = false; }
        if (render === void 0) { render = true; }
        this.zoom(object, factor, orientation, animate, render);
    };
    ThreeNavigation.prototype.zoomOnScene = function (factor, orientation, animate, render) {
        if (orientation === void 0) { orientation = '3d'; }
        if (animate === void 0) { animate = false; }
        if (render === void 0) { render = true; }
        return this.zoom('scene', factor, orientation, animate, render);
    };
    Object.defineProperty(ThreeNavigation.prototype, "camera", {
        get: function () {
            return this.three.getCamera();
        },
        enumerable: false,
        configurable: true
    });
    ThreeNavigation.prototype.startObservation = function () {
        var _this = this;
        this.observationViewer = document.createElement('div');
        this.observationViewer.style.position = 'absolute';
        this.observationViewer.style.zIndex = '10';
        this.observationViewer.style.right = '10px';
        this.observationViewer.style.top = '10px';
        this.observationViewer.style.width = '300px';
        this.observationViewer.style.height = '300px';
        this.observationViewer.style.boxShadow = 'var(--aurelia-ux--design-elevation3dp)';
        this.three.getSceneElement().parentElement.append(this.observationViewer);
        this.observationRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.observationRenderer.setClearColor('#fff');
        this.observationRenderer.setSize(this.observationViewer.offsetWidth, this.observationViewer.offsetHeight);
        this.observationViewer.appendChild(this.observationRenderer.domElement);
        var w = this.observationViewer.offsetWidth;
        var h = this.observationViewer.offsetHeight;
        this.observationCamera = new THREE.OrthographicCamera(w / (this.observationCameraFrustrumFactor * -1), w / this.observationCameraFrustrumFactor, h / this.observationCameraFrustrumFactor, h / (this.observationCameraFrustrumFactor * -1), -1000000, 1000000);
        this.observationCamera.name = 'Observation Camera';
        this.observationCamera.position.x = -10;
        this.observationCamera.position.y = 0;
        this.observationCamera.position.z = 0;
        this.observationCamera.zoom = this.observationCameraZoom;
        this.observationCamera.lookAt(new THREE.Vector3(0, 0, 0));
        this.observationCamera.updateProjectionMatrix();
        this.observationCamera.updateMatrixWorld();
        this.observationSubscription = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator).subscribe('three-post-render', function () {
            _this.observationCamera.updateProjectionMatrix();
            _this.camera.updateMatrixWorld();
            if (!_this.observationRenderer)
                return;
            _this.observationRenderer.autoClear = true;
            _this.observationRenderer.render(_this.three.getScene(), _this.observationCamera);
            _this.observationRenderer.autoClear = false;
            _this.observationRenderer.render(_this.three.getScene('points'), _this.observationCamera);
            _this.observationRenderer.render(_this.three.getScene('overlay'), _this.observationCamera);
            _this.observationRenderer.render(_this.three.getScene('tools'), _this.observationCamera);
        });
        this.showCameraHelper();
        this.observationOn = true;
    };
    ThreeNavigation.prototype.endObservation = function () {
        this.removeCameraHelper();
        this.observationViewer.remove();
        delete this.observationRenderer;
        delete this.observationCamera;
        delete this.observationViewer;
        this.observationSubscription.dispose();
        this.observationOn = false;
    };
    ThreeNavigation.prototype.toggleObservation = function () {
        if (!this.observationOn) {
            this.startObservation();
        }
        else {
            this.endObservation();
        }
    };
    ThreeNavigation.prototype.showCameraHelper = function () {
        this.log.debug('showCameraHelper');
        var scene = this.three.getScene('overlay');
        if (scene.getObjectByName('camera_helper'))
            return;
        var helper = new THREE.CameraHelper(this.camera);
        setInterval(function () {
            helper.update();
        }, 500);
        helper.name = 'camera_helper';
        scene.add(helper);
    };
    ThreeNavigation.prototype.removeCameraHelper = function () {
        var scene = this.three.getScene('overlay');
        if (scene.getObjectByName('camera_helper')) {
            scene.remove(scene.getObjectByName('camera_helper'));
        }
    };
    __decorate([
        aurelia_framework_1.computedFrom('three'),
        __metadata("design:type", THREE.Camera),
        __metadata("design:paramtypes", [])
    ], ThreeNavigation.prototype, "camera", null);
    return ThreeNavigation;
}());
exports.ThreeNavigation = ThreeNavigation;

//# sourceMappingURL=three-navigation.js.map
