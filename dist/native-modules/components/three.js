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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreePoints } from './../helpers/three-points';
import { ThreeObjects } from '../helpers/three-objects';
import { ThreeNavigation } from '../helpers/three-navigation';
import { inject, Container, customElement, bindable, bindingMode } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { EventAggregator } from 'aurelia-event-aggregator';
;
var ThreeCustomElement = (function () {
    function ThreeCustomElement(element) {
        var _this = this;
        this.element = element;
        this.cameraFrustrumFactor = 2;
        this.cameraZoom = 1;
        this.animating = false;
        this.subscriptions = [];
        this.previousMousePosition = null;
        this.log = getLogger('comp:three');
        this.handleResize = function (e) {
            if (!_this.sceneElement || !_this.camera)
                return;
            if (_this.camera instanceof THREE.OrthographicCamera) {
                _this.camera.left = _this.sceneElement.offsetWidth / -2;
                _this.camera.right = _this.sceneElement.offsetWidth / 2;
                _this.camera.top = _this.sceneElement.offsetHeight / 2;
                _this.camera.bottom = _this.sceneElement.offsetHeight / -2;
                _this.camera.updateProjectionMatrix();
                _this.camera.updateMatrixWorld();
            }
            _this.renderer.setSize(_this.sceneElement.offsetWidth, _this.sceneElement.offsetHeight);
            _this.requestRendering();
        };
        this.handleMouseDown = function (e) {
            if (e.target.tagName === 'CANVAS') {
                _this.processCursor(e, 'down');
            }
        };
        this.handleMouseMove = function (e) {
            if (e.target.tagName === 'CANVAS') {
                _this.processCursor(e, 'move');
            }
        };
        this.handleMouseUp = function (e) {
            if (e.target.tagName === 'CANVAS') {
                _this.processCursor(e, 'up');
            }
        };
        this.handleMouseLeave = function (e) {
            _this.publish('cursor:leave', { event: e });
        };
    }
    ThreeCustomElement.prototype.attached = function () {
        var _this = this;
        this.init();
        this.addDomEvents();
        this.subscribe('three-scene.request-rendering', function () { return _this.requestRendering(); });
        this.startAnimate();
    };
    ThreeCustomElement.prototype.detached = function () {
        this.removeDomEvents();
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
    };
    ThreeCustomElement.prototype.subscribe = function (event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    };
    ThreeCustomElement.prototype.publish = function (event, data) {
        Container.instance.get(EventAggregator).publish("three-" + event, data);
    };
    ThreeCustomElement.prototype.init = function () {
        this.log.debug('init');
        this.initScene();
        this.initCamera();
        this.navigation = new ThreeNavigation(this);
        this.navigation.initControls();
        window.navigation = this.navigation;
        this.initLight();
        this.objects = new ThreeObjects(this);
        this.log.debug('scene', this.scene);
        this.log.debug('camera', this.camera);
        this.points = new ThreePoints(this);
    };
    ThreeCustomElement.prototype.initScene = function () {
        this.log.debug('initScene');
        this.scene = new MainScene(this);
        this.scene.name = 'Scene';
        this.scene.background = new THREE.Color('#ccc');
        this.pointsScene = new THREE.Scene();
        this.pointsScene.name = 'Points Scene';
        this.overlayScene = new THREE.Scene();
        this.overlayScene.name = 'Overlay Scene';
        this.toolsScene = new THREE.Scene();
        this.toolsScene.name = 'Tools Scene';
        window.scene = this.scene;
        window.pointsScene = this.pointsScene;
        window.overlayScene = this.overlayScene;
        window.toolsScene = this.toolsScene;
        var alpha = false;
        var antialias = true;
        this.renderer = new THREE.WebGLRenderer({ antialias: antialias, alpha: alpha, preserveDrawingBuffer: true });
        this.renderer.setClearColor('#ccc', 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
        this.sceneElement.appendChild(this.renderer.domElement);
    };
    ThreeCustomElement.prototype.addDomEvents = function () {
        window.addEventListener('resize', this.handleResize, false);
        this.element.addEventListener('mousedown', this.handleMouseDown, false);
        this.element.addEventListener('mousemove', this.handleMouseMove, false);
        this.element.addEventListener('mouseup', this.handleMouseUp, false);
        this.element.addEventListener('mouseleave', this.handleMouseLeave, false);
    };
    ThreeCustomElement.prototype.removeDomEvents = function () {
        window.removeEventListener('resize', this.handleResize, false);
        this.element.removeEventListener('mousedown', this.handleMouseDown, false);
        this.element.removeEventListener('mousemove', this.handleMouseMove, false);
        this.element.removeEventListener('mouseup', this.handleMouseUp, false);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave, false);
    };
    ThreeCustomElement.prototype.processCursor = function (event, type) {
        var raycaster = new THREE.Raycaster();
        raycaster.params.Line.threshold = 5;
        var mouse = new THREE.Vector2();
        if (event.clientX && event.clientY && event.target && event.target.getBoundingClientRect) {
            var rect = event.target.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            mouse.x = (x / this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(y / this.renderer.domElement.clientHeight) * 2 + 1;
        }
        else if (this.previousMousePosition) {
            mouse = this.previousMousePosition;
        }
        else {
            return;
        }
        this.publish('cursor:raw-processing', { mouse: mouse, camera: this.camera, type: type });
        this.previousMousePosition = mouse;
        raycaster.setFromCamera(mouse, this.camera);
        var planeXY = new THREE.Plane(new THREE.Vector3(0, 0, 1));
        var planeXZ = new THREE.Plane(new THREE.Vector3(0, 1, 0));
        var planeYZ = new THREE.Plane(new THREE.Vector3(1, 0, 0));
        var pointXY = new THREE.Vector3;
        var pointXZ = new THREE.Vector3;
        var pointYZ = new THREE.Vector3;
        var intersectPlaneXY = raycaster.ray.intersectPlane(planeXY, pointXY);
        var intersectPlaneXZ = raycaster.ray.intersectPlane(planeXZ, pointXZ);
        var intersectPlaneYZ = raycaster.ray.intersectPlane(planeYZ, pointYZ);
        var planesIntersects = {
            xy: intersectPlaneXY,
            xz: intersectPlaneXZ,
            yz: intersectPlaneYZ
        };
        var cursorPlanesIntersects = {
            type: type,
            intersects: planesIntersects,
            mouse: mouse
        };
        this.publish('cursor:plane-intersect', cursorPlanesIntersects);
        var distance = 0;
        var plane = null;
        var direction;
        var clippingPlanes = this.renderer.clippingPlanes || [];
        if (clippingPlanes.length > 0) {
            plane = clippingPlanes[0];
            var cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
            var normalProjected = plane.normal.clone().projectOnVector(cameraDirection);
            var angle = cameraDirection.angleTo(normalProjected);
            direction = (angle > 0.1) ? 'BACK' : 'FRONT';
            var intersection = raycaster.ray.intersectPlane(plane, new THREE.Vector3);
            distance = intersection ? intersection.sub(this.camera.position).length() : 0;
        }
        if (type === 'down') {
            var clickableObjects_1 = [];
            var clickableOverlays_1 = [];
            var clickableTools_1 = [];
            this.scene.traverse(function (object) {
                var o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableObjects_1.push(object);
            });
            this.overlayScene.traverse(function (object) {
                var o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableOverlays_1.push(object);
            });
            this.toolsScene.traverse(function (object) {
                var o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableTools_1.push(object);
            });
            var clickIntersects = raycaster.intersectObjects(clickableObjects_1, false);
            var clickOverlaysIntersects = raycaster.intersectObjects(clickableOverlays_1, false);
            var clickToolsIntersects = raycaster.intersectObjects(clickableTools_1, false);
            for (var _i = 0, _a = [].concat(clickIntersects, clickOverlaysIntersects, clickToolsIntersects); _i < _a.length; _i++) {
                var intersect = _a[_i];
                var object = intersect.object;
                var o = object;
                if (!o.userData.preventClick)
                    o.__clicked = true;
                object.traverse(function (childObject) {
                    var c = childObject;
                    if (!c.userData.preventClick)
                        c.__clicked = true;
                });
            }
            if (distance && plane) {
                var newClickIntersects = [];
                for (var _b = 0, clickIntersects_1 = clickIntersects; _b < clickIntersects_1.length; _b++) {
                    var intersect = clickIntersects_1[_b];
                    if (direction === 'BACK' && intersect.distance < distance) {
                        newClickIntersects.push(intersect);
                    }
                    else if (direction === 'FRONT' && intersect.distance > distance) {
                        newClickIntersects.push(intersect);
                    }
                }
                clickIntersects = newClickIntersects;
            }
            this.publish('cursor:click', clickIntersects);
            this.publish('cursor:click-overlay', clickOverlaysIntersects);
            this.publish('cursor:click-tools', clickToolsIntersects);
        }
        else {
            var hoverabledObjects_1 = [];
            var hoverabledOverlays_1 = [];
            var hoverabledTools_1 = [];
            this.scene.traverse(function (object) {
                var o = object;
                if (!o.userData.preventHover)
                    hoverabledObjects_1.push(object);
            });
            this.overlayScene.traverse(function (object) {
                var o = object;
                if (!o.userData.preventHover)
                    hoverabledOverlays_1.push(object);
            });
            this.toolsScene.traverse(function (object) {
                var o = object;
                if (!o.userData.preventHover)
                    hoverabledTools_1.push(object);
            });
            var hoverIntersects = raycaster.intersectObjects(hoverabledObjects_1, false);
            var hoverOverlaysIntersects = raycaster.intersectObjects(hoverabledOverlays_1, false);
            var hoverToolsIntersects = raycaster.intersectObjects(hoverabledTools_1, false);
            if (distance && plane) {
                var newHoverIntersects = [];
                for (var _c = 0, hoverIntersects_1 = hoverIntersects; _c < hoverIntersects_1.length; _c++) {
                    var intersect = hoverIntersects_1[_c];
                    if (direction === 'BACK' && intersect.distance < distance) {
                        newHoverIntersects.push(intersect);
                    }
                    else if (direction === 'FRONT' && intersect.distance > distance) {
                        newHoverIntersects.push(intersect);
                    }
                }
                hoverIntersects = newHoverIntersects;
            }
            var hoverIntesectsWithEvent = hoverIntersects.map(function (o) {
                o.event = event;
                return o;
            });
            var hoverOverlaysIntersectsWithEvent = hoverOverlaysIntersects.map(function (o) {
                o.event = event;
                return o;
            });
            var hoverToolsIntersectsWithEvent = hoverToolsIntersects.map(function (o) {
                o.event = event;
                return o;
            });
            this.publish('cursor:hover', hoverIntesectsWithEvent);
            this.publish('cursor:hover-overlay', hoverOverlaysIntersectsWithEvent);
            this.publish('cursor:hover-tools', hoverToolsIntersectsWithEvent);
        }
    };
    ThreeCustomElement.prototype.initCamera = function () {
        this.log.debug('initCamera');
        var w = this.sceneElement.offsetWidth;
        var h = this.sceneElement.offsetHeight;
        this.camera = new THREE.OrthographicCamera(w / (this.cameraFrustrumFactor * -1), w / this.cameraFrustrumFactor, h / this.cameraFrustrumFactor, h / (this.cameraFrustrumFactor * -1), -1000, 1000);
        this.camera.name = 'Main Camera';
        this.camera.position.x = 0;
        this.camera.position.y = 5;
        this.camera.position.z = 0;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.zoom = this.cameraZoom;
            this.camera.near = -50;
            this.camera.far = 150;
            this.camera.updateProjectionMatrix();
        }
        this.camera.updateMatrixWorld();
        this.scene.add(this.camera);
    };
    ThreeCustomElement.prototype.cameraFrustrumFactorChanged = function () {
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = this.sceneElement.offsetWidth / (this.cameraFrustrumFactor * -1);
            this.camera.right = this.sceneElement.offsetWidth / this.cameraFrustrumFactor;
            this.camera.top = this.sceneElement.offsetWidth / this.cameraFrustrumFactor;
            this.camera.bottom = this.sceneElement.offsetWidth / (this.cameraFrustrumFactor * -1);
            this.camera.updateProjectionMatrix();
        }
    };
    ThreeCustomElement.prototype.cameraZoomChanged = function () {
        if (this.camera instanceof THREE.OrthographicCamera) {
            if (this.camera.zoom == this.cameraZoom)
                return;
            this.camera.zoom = this.cameraZoom;
            this.camera.updateProjectionMatrix();
        }
    };
    ThreeCustomElement.prototype.initLight = function () {
        var ambiantLight = new THREE.AmbientLight(0x404040, 2.5);
        var spotLight = new THREE.SpotLight('#fff', 1.5);
        spotLight.position.setY(100);
        this.scene.add(ambiantLight);
        this.scene.add(spotLight);
    };
    ThreeCustomElement.prototype.addAxis = function (sceneType) {
        if (sceneType === void 0) { sceneType = 'tools'; }
        var scene = this.getScene(sceneType);
        var axis = scene.getObjectByName('__axis__');
        if (!axis) {
            var axisHelper = new THREE.AxesHelper(5000);
            axisHelper.name = 'axis';
            axisHelper.userData = { preventClick: true };
            scene.add(axisHelper);
        }
    };
    ThreeCustomElement.prototype.removeAxis = function (sceneType) {
        if (sceneType === void 0) { sceneType = 'tools'; }
        var scene = this.getScene(sceneType);
        var axis = scene.getObjectByName('__axis__');
        if (axis) {
            scene.remove(axis);
        }
    };
    ThreeCustomElement.prototype.addCube = function (sceneType) {
        if (sceneType === void 0) { sceneType = 'tools'; }
        var scene = this.getScene(sceneType);
        var geometry = new THREE.BoxGeometry(0.5, 3, 6);
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = '__cube__';
        scene.add(mesh);
        this.render();
    };
    ThreeCustomElement.prototype.removeCube = function (sceneType) {
        if (sceneType === void 0) { sceneType = 'tools'; }
        var scene = this.getScene(sceneType);
        var cube = scene.getObjectByName('__cube__');
        if (cube) {
            scene.remove(cube);
        }
    };
    ThreeCustomElement.prototype.rotateCube = function (sceneType) {
        var _this = this;
        if (sceneType === void 0) { sceneType = 'tools'; }
        requestAnimationFrame(function () {
            _this.rotateCube();
        });
        var scene = this.getScene(sceneType);
        var mesh = scene.getObjectByName('__cube__');
        if (mesh) {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        }
    };
    ThreeCustomElement.prototype.startAnimate = function () {
        if (this.animating)
            return;
        this.animating = true;
        this.animate();
    };
    ThreeCustomElement.prototype.stopAnimating = function () {
        this.animating = false;
    };
    ThreeCustomElement.prototype.animate = function () {
        var _this = this;
        if (!this.animating)
            return;
        requestAnimationFrame(function () {
            _this.animate();
        });
        this.render();
    };
    ThreeCustomElement.prototype.requestRendering = function () {
        var _this = this;
        requestAnimationFrame(function () {
            _this.render();
        });
    };
    ThreeCustomElement.prototype.render = function () {
        this.publish('pre-render');
        if (this.navigation.cameraIsAnimating) {
            TWEEN.update();
            this.requestRendering();
        }
        if (this.pointsScene.children.length) {
            var result = this.points.potree.updatePointClouds(this.points.pointClouds, this.getCamera(), this.renderer);
        }
        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;
        this.renderer.render(this.pointsScene, this.camera);
        var slicingPlanes = this.renderer.clippingPlanes;
        this.renderer.clippingPlanes = [];
        this.renderer.render(this.overlayScene, this.camera);
        this.renderer.render(this.toolsScene, this.camera);
        this.renderer.clippingPlanes = slicingPlanes;
        this.publish('post-render');
    };
    ThreeCustomElement.prototype.scaleBbox = function (originalBbox, factor) {
        var bbox = originalBbox.clone();
        if (factor < 0)
            throw new Error('Factor must be positive');
        if (factor === 1)
            return bbox;
        if (factor > 1) {
            factor -= 1;
            var xWidth = bbox.max.x - bbox.min.x;
            var xDelta = xWidth * factor;
            bbox.max.x += xDelta / 2;
            bbox.min.x -= xDelta / 2;
            var yWidth = bbox.max.y - bbox.min.y;
            var yDelta = yWidth * factor;
            bbox.max.y += yDelta / 2;
            bbox.min.y -= yDelta / 2;
            var zWidth = bbox.max.z - bbox.min.z;
            var zDelta = zWidth * factor;
            bbox.max.z += zDelta / 2;
            bbox.min.z -= zDelta / 2;
        }
        else {
            factor = 1 / factor;
            factor -= 1;
            var xWidth = bbox.max.x - bbox.min.x;
            var xDelta = xWidth * factor;
            bbox.max.x -= xDelta / 2;
            bbox.min.x += xDelta / 2;
            var yWidth = bbox.max.y - bbox.min.y;
            var yDelta = yWidth * factor;
            bbox.max.y -= yDelta / 2;
            bbox.min.y += yDelta / 2;
            var zWidth = bbox.max.z - bbox.min.z;
            var zDelta = zWidth * factor;
            bbox.max.z -= zDelta / 2;
            bbox.min.z += zDelta / 2;
        }
        return bbox;
    };
    ThreeCustomElement.prototype.autoExtendBbox = function (bbox) {
        var sizeX = bbox.max.x - bbox.min.x;
        var sizeY = bbox.max.y - bbox.min.y;
        var sizeZ = bbox.max.z - bbox.min.z;
        var maxSize = Math.max(sizeX, sizeY, sizeZ);
        var factor = 1.5;
        if (maxSize < 40000) {
            factor = Math.max(40000 / maxSize, 1.5);
        }
        return this.scaleBbox(bbox, factor);
    };
    ThreeCustomElement.prototype.bboxFromObject = function (object) {
        var bbox = new THREE.BoxHelper(object);
        bbox.geometry.computeBoundingBox();
        return bbox.geometry.boundingBox;
    };
    ThreeCustomElement.prototype.isBbox000 = function (bbox) {
        return bbox.min.x === 0 && bbox.min.y === 0 && bbox.min.z === 0 && bbox.max.x === 0 && bbox.max.y === 0 && bbox.max.z === 0;
    };
    ThreeCustomElement.prototype.centroidFromBbox = function (bbox) {
        var center;
        bbox.getCenter(center);
        return center;
    };
    ThreeCustomElement.prototype.getCamera = function () {
        return this.camera;
    };
    ThreeCustomElement.prototype.getScene = function (sceneType) {
        if (sceneType === void 0) { sceneType = 'main'; }
        if (sceneType === 'tools')
            return this.toolsScene;
        else if (sceneType === 'overlay')
            return this.overlayScene;
        else if (sceneType === 'points')
            return this.pointsScene;
        return this.scene;
    };
    ThreeCustomElement.prototype.getSceneElement = function () {
        return this.sceneElement;
    };
    ThreeCustomElement.prototype.getRenderer = function () {
        return this.renderer;
    };
    ThreeCustomElement.prototype.getSnapshot = function (type) {
        var mime = type === 'jpg' ? 'image/jpg' : 'image/png';
        return this.renderer.domElement.toDataURL(mime, 1);
    };
    __decorate([
        bindable,
        __metadata("design:type", Number)
    ], ThreeCustomElement.prototype, "cameraFrustrumFactor", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], ThreeCustomElement.prototype, "cameraZoom", void 0);
    ThreeCustomElement = __decorate([
        customElement('three'),
        inject(Element),
        __metadata("design:paramtypes", [HTMLElement])
    ], ThreeCustomElement);
    return ThreeCustomElement;
}());
export { ThreeCustomElement };
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene(three) {
        var _this = _super.call(this) || this;
        _this.setThree(three);
        return _this;
    }
    MainScene.prototype.setThree = function (three) {
        this.three = three;
    };
    MainScene.prototype.add = function () {
        var object = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            object[_i] = arguments[_i];
        }
        for (var _a = 0, object_1 = object; _a < object_1.length; _a++) {
            var obj = object_1[_a];
            if (!obj.__throughAddObject && (obj instanceof THREE.Group || obj instanceof THREE.Mesh)) {
                this.three.objects.addObject(obj);
                return this;
            }
        }
        return _super.prototype.add.apply(this, object);
    };
    MainScene.prototype.remove = function () {
        var object = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            object[_i] = arguments[_i];
        }
        for (var _a = 0, object_2 = object; _a < object_2.length; _a++) {
            var obj = object_2[_a];
            if (!obj.__throughRemoveObject && (obj instanceof THREE.Group || obj instanceof THREE.Mesh)) {
                this.three.objects.removeObject(obj);
                return this;
            }
        }
        return _super.prototype.remove.apply(this, object);
    };
    return MainScene;
}(THREE.Scene));
export { MainScene };

//# sourceMappingURL=three.js.map
