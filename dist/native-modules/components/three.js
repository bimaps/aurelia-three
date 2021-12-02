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
let ThreeCustomElement = class ThreeCustomElement {
    constructor(element) {
        this.element = element;
        this.cameraFrustrumFactor = 2;
        this.cameraZoom = 1;
        this.animating = false;
        this.subscriptions = [];
        this.previousMousePosition = null;
        this.log = getLogger('comp:three');
        this.handleResize = (e) => {
            if (!this.sceneElement || !this.camera)
                return;
            if (this.camera instanceof THREE.OrthographicCamera) {
                this.camera.left = this.sceneElement.offsetWidth / -2;
                this.camera.right = this.sceneElement.offsetWidth / 2;
                this.camera.top = this.sceneElement.offsetHeight / 2;
                this.camera.bottom = this.sceneElement.offsetHeight / -2;
                this.camera.updateProjectionMatrix();
                this.camera.updateMatrixWorld();
            }
            this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
            this.requestRendering();
        };
        this.handleMouseDown = (e) => {
            if (e.target.tagName === 'CANVAS') {
                this.processCursor(e, 'down');
            }
        };
        this.handleMouseMove = (e) => {
            if (e.target.tagName === 'CANVAS') {
                this.processCursor(e, 'move');
            }
        };
        this.handleMouseUp = (e) => {
            if (e.target.tagName === 'CANVAS') {
                this.processCursor(e, 'up');
            }
        };
        this.handleMouseLeave = (e) => {
            this.publish('cursor:leave', { event: e });
        };
    }
    attached() {
        this.init();
        this.addDomEvents();
        this.subscribe('three-scene.request-rendering', () => this.requestRendering());
        this.startAnimate();
    }
    detached() {
        this.removeDomEvents();
        for (let sub of this.subscriptions)
            sub.dispose();
    }
    subscribe(event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    }
    publish(event, data) {
        Container.instance.get(EventAggregator).publish(`three-${event}`, data);
    }
    init() {
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
    }
    initScene() {
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
        let alpha = false;
        let antialias = true;
        this.renderer = new THREE.WebGLRenderer({ antialias: antialias, alpha: alpha, preserveDrawingBuffer: true });
        this.renderer.setClearColor('#ccc', 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
        this.sceneElement.appendChild(this.renderer.domElement);
    }
    addDomEvents() {
        window.addEventListener('resize', this.handleResize, false);
        this.element.addEventListener('mousedown', this.handleMouseDown, false);
        this.element.addEventListener('mousemove', this.handleMouseMove, false);
        this.element.addEventListener('mouseup', this.handleMouseUp, false);
        this.element.addEventListener('mouseleave', this.handleMouseLeave, false);
    }
    removeDomEvents() {
        window.removeEventListener('resize', this.handleResize, false);
        this.element.removeEventListener('mousedown', this.handleMouseDown, false);
        this.element.removeEventListener('mousemove', this.handleMouseMove, false);
        this.element.removeEventListener('mouseup', this.handleMouseUp, false);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave, false);
    }
    processCursor(event, type) {
        let raycaster = new THREE.Raycaster();
        raycaster.params.Line.threshold = 5;
        let mouse = new THREE.Vector2();
        if (event.clientX && event.clientY && event.target && event.target.getBoundingClientRect) {
            let rect = event.target.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
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
        let planeXY = new THREE.Plane(new THREE.Vector3(0, 0, 1));
        let planeXZ = new THREE.Plane(new THREE.Vector3(0, 1, 0));
        let planeYZ = new THREE.Plane(new THREE.Vector3(1, 0, 0));
        let pointXY = new THREE.Vector3;
        let pointXZ = new THREE.Vector3;
        let pointYZ = new THREE.Vector3;
        let intersectPlaneXY = raycaster.ray.intersectPlane(planeXY, pointXY);
        let intersectPlaneXZ = raycaster.ray.intersectPlane(planeXZ, pointXZ);
        let intersectPlaneYZ = raycaster.ray.intersectPlane(planeYZ, pointYZ);
        let planesIntersects = {
            xy: intersectPlaneXY,
            xz: intersectPlaneXZ,
            yz: intersectPlaneYZ
        };
        let cursorPlanesIntersects = {
            type: type,
            intersects: planesIntersects,
            mouse
        };
        this.publish('cursor:plane-intersect', cursorPlanesIntersects);
        let distance = 0;
        let plane = null;
        let direction;
        const clippingPlanes = this.renderer.clippingPlanes || [];
        if (clippingPlanes.length > 0) {
            plane = clippingPlanes[0];
            const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
            const normalProjected = plane.normal.clone().projectOnVector(cameraDirection);
            const angle = cameraDirection.angleTo(normalProjected);
            direction = (angle > 0.1) ? 'BACK' : 'FRONT';
            const intersection = raycaster.ray.intersectPlane(plane, new THREE.Vector3);
            distance = intersection ? intersection.sub(this.camera.position).length() : 0;
        }
        if (type === 'down') {
            let clickableObjects = [];
            let clickableOverlays = [];
            let clickableTools = [];
            this.scene.traverse((object) => {
                const o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableObjects.push(object);
            });
            this.overlayScene.traverse((object) => {
                const o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableOverlays.push(object);
            });
            this.toolsScene.traverse((object) => {
                const o = object;
                o.__clicked = false;
                if (!o.userData.preventClick)
                    clickableTools.push(object);
            });
            let clickIntersects = raycaster.intersectObjects(clickableObjects, false);
            let clickOverlaysIntersects = raycaster.intersectObjects(clickableOverlays, false);
            let clickToolsIntersects = raycaster.intersectObjects(clickableTools, false);
            for (let intersect of [].concat(clickIntersects, clickOverlaysIntersects, clickToolsIntersects)) {
                let object = intersect.object;
                const o = object;
                if (!o.userData.preventClick)
                    o.__clicked = true;
                object.traverse((childObject) => {
                    const c = childObject;
                    if (!c.userData.preventClick)
                        c.__clicked = true;
                });
            }
            if (distance && plane) {
                const newClickIntersects = [];
                for (let intersect of clickIntersects) {
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
            let hoverabledObjects = [];
            let hoverabledOverlays = [];
            let hoverabledTools = [];
            this.scene.traverse((object) => {
                const o = object;
                if (!o.userData.preventHover)
                    hoverabledObjects.push(object);
            });
            this.overlayScene.traverse((object) => {
                const o = object;
                if (!o.userData.preventHover)
                    hoverabledOverlays.push(object);
            });
            this.toolsScene.traverse((object) => {
                const o = object;
                if (!o.userData.preventHover)
                    hoverabledTools.push(object);
            });
            let hoverIntersects = raycaster.intersectObjects(hoverabledObjects, false);
            let hoverOverlaysIntersects = raycaster.intersectObjects(hoverabledOverlays, false);
            let hoverToolsIntersects = raycaster.intersectObjects(hoverabledTools, false);
            if (distance && plane) {
                const newHoverIntersects = [];
                for (let intersect of hoverIntersects) {
                    if (direction === 'BACK' && intersect.distance < distance) {
                        newHoverIntersects.push(intersect);
                    }
                    else if (direction === 'FRONT' && intersect.distance > distance) {
                        newHoverIntersects.push(intersect);
                    }
                }
                hoverIntersects = newHoverIntersects;
            }
            const hoverIntesectsWithEvent = hoverIntersects.map((o) => {
                o.event = event;
                return o;
            });
            const hoverOverlaysIntersectsWithEvent = hoverOverlaysIntersects.map((o) => {
                o.event = event;
                return o;
            });
            const hoverToolsIntersectsWithEvent = hoverToolsIntersects.map((o) => {
                o.event = event;
                return o;
            });
            this.publish('cursor:hover', hoverIntesectsWithEvent);
            this.publish('cursor:hover-overlay', hoverOverlaysIntersectsWithEvent);
            this.publish('cursor:hover-tools', hoverToolsIntersectsWithEvent);
        }
    }
    initCamera() {
        this.log.debug('initCamera');
        let w = this.sceneElement.offsetWidth;
        let h = this.sceneElement.offsetHeight;
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
    }
    cameraFrustrumFactorChanged() {
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = this.sceneElement.offsetWidth / (this.cameraFrustrumFactor * -1);
            this.camera.right = this.sceneElement.offsetWidth / this.cameraFrustrumFactor;
            this.camera.top = this.sceneElement.offsetWidth / this.cameraFrustrumFactor;
            this.camera.bottom = this.sceneElement.offsetWidth / (this.cameraFrustrumFactor * -1);
            this.camera.updateProjectionMatrix();
        }
    }
    cameraZoomChanged() {
        if (this.camera instanceof THREE.OrthographicCamera) {
            if (this.camera.zoom == this.cameraZoom)
                return;
            this.camera.zoom = this.cameraZoom;
            this.camera.updateProjectionMatrix();
        }
    }
    initLight() {
        let ambiantLight = new THREE.AmbientLight(0x404040, 2.5);
        let spotLight = new THREE.SpotLight('#fff', 1.5);
        spotLight.position.setY(100);
        this.scene.add(ambiantLight);
        this.scene.add(spotLight);
    }
    addAxis(sceneType = 'tools') {
        let scene = this.getScene(sceneType);
        let axis = scene.getObjectByName('__axis__');
        if (!axis) {
            let axisHelper = new THREE.AxesHelper(5000);
            axisHelper.name = 'axis';
            axisHelper.userData = { preventClick: true };
            scene.add(axisHelper);
        }
    }
    removeAxis(sceneType = 'tools') {
        let scene = this.getScene(sceneType);
        let axis = scene.getObjectByName('__axis__');
        if (axis) {
            scene.remove(axis);
        }
    }
    addCube(sceneType = 'tools') {
        let scene = this.getScene(sceneType);
        let geometry = new THREE.BoxGeometry(0.5, 3, 6);
        let material = new THREE.MeshNormalMaterial();
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = '__cube__';
        scene.add(mesh);
        this.render();
    }
    removeCube(sceneType = 'tools') {
        let scene = this.getScene(sceneType);
        let cube = scene.getObjectByName('__cube__');
        if (cube) {
            scene.remove(cube);
        }
    }
    rotateCube(sceneType = 'tools') {
        requestAnimationFrame(() => {
            this.rotateCube();
        });
        let scene = this.getScene(sceneType);
        let mesh = scene.getObjectByName('__cube__');
        if (mesh) {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        }
    }
    startAnimate() {
        if (this.animating)
            return;
        this.animating = true;
        this.animate();
    }
    stopAnimating() {
        this.animating = false;
    }
    animate() {
        if (!this.animating)
            return;
        requestAnimationFrame(() => {
            this.animate();
        });
        this.render();
    }
    requestRendering() {
        requestAnimationFrame(() => {
            this.render();
        });
    }
    render() {
        this.publish('pre-render');
        if (this.navigation.cameraIsAnimating) {
            TWEEN.update();
            this.requestRendering();
        }
        if (this.pointsScene.children.length) {
            let result = this.points.potree.updatePointClouds(this.points.pointClouds, this.getCamera(), this.renderer);
        }
        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;
        this.renderer.render(this.pointsScene, this.camera);
        const slicingPlanes = this.renderer.clippingPlanes;
        this.renderer.clippingPlanes = [];
        this.renderer.render(this.overlayScene, this.camera);
        this.renderer.render(this.toolsScene, this.camera);
        this.renderer.clippingPlanes = slicingPlanes;
        this.publish('post-render');
    }
    scaleBbox(originalBbox, factor) {
        let bbox = originalBbox.clone();
        if (factor < 0)
            throw new Error('Factor must be positive');
        if (factor === 1)
            return bbox;
        if (factor > 1) {
            factor -= 1;
            let xWidth = bbox.max.x - bbox.min.x;
            let xDelta = xWidth * factor;
            bbox.max.x += xDelta / 2;
            bbox.min.x -= xDelta / 2;
            let yWidth = bbox.max.y - bbox.min.y;
            let yDelta = yWidth * factor;
            bbox.max.y += yDelta / 2;
            bbox.min.y -= yDelta / 2;
            let zWidth = bbox.max.z - bbox.min.z;
            let zDelta = zWidth * factor;
            bbox.max.z += zDelta / 2;
            bbox.min.z -= zDelta / 2;
        }
        else {
            factor = 1 / factor;
            factor -= 1;
            let xWidth = bbox.max.x - bbox.min.x;
            let xDelta = xWidth * factor;
            bbox.max.x -= xDelta / 2;
            bbox.min.x += xDelta / 2;
            let yWidth = bbox.max.y - bbox.min.y;
            let yDelta = yWidth * factor;
            bbox.max.y -= yDelta / 2;
            bbox.min.y += yDelta / 2;
            let zWidth = bbox.max.z - bbox.min.z;
            let zDelta = zWidth * factor;
            bbox.max.z -= zDelta / 2;
            bbox.min.z += zDelta / 2;
        }
        return bbox;
    }
    autoExtendBbox(bbox) {
        let sizeX = bbox.max.x - bbox.min.x;
        let sizeY = bbox.max.y - bbox.min.y;
        let sizeZ = bbox.max.z - bbox.min.z;
        let maxSize = Math.max(sizeX, sizeY, sizeZ);
        let factor = 1.5;
        if (maxSize < 40000) {
            factor = Math.max(40000 / maxSize, 1.5);
        }
        return this.scaleBbox(bbox, factor);
    }
    bboxFromObject(object) {
        let bbox = new THREE.BoxHelper(object);
        bbox.geometry.computeBoundingBox();
        return bbox.geometry.boundingBox;
    }
    isBbox000(bbox) {
        return bbox.min.x === 0 && bbox.min.y === 0 && bbox.min.z === 0 && bbox.max.x === 0 && bbox.max.y === 0 && bbox.max.z === 0;
    }
    centroidFromBbox(bbox) {
        let center;
        bbox.getCenter(center);
        return center;
    }
    getCamera() {
        return this.camera;
    }
    getScene(sceneType = 'main') {
        if (sceneType === 'tools')
            return this.toolsScene;
        else if (sceneType === 'overlay')
            return this.overlayScene;
        else if (sceneType === 'points')
            return this.pointsScene;
        return this.scene;
    }
    getSceneElement() {
        return this.sceneElement;
    }
    getRenderer() {
        return this.renderer;
    }
    getSnapshot(type) {
        const mime = type === 'jpg' ? 'image/jpg' : 'image/png';
        return this.renderer.domElement.toDataURL(mime, 1);
    }
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
export { ThreeCustomElement };
export class MainScene extends THREE.Scene {
    constructor(three) {
        super();
        this.setThree(three);
    }
    setThree(three) {
        this.three = three;
    }
    add(...object) {
        for (let obj of object) {
            if (!obj.__throughAddObject && (obj instanceof THREE.Group || obj instanceof THREE.Mesh)) {
                this.three.objects.addObject(obj);
                return this;
            }
        }
        return super.add(...object);
    }
    remove(...object) {
        for (let obj of object) {
            if (!obj.__throughRemoveObject && (obj instanceof THREE.Group || obj instanceof THREE.Mesh)) {
                this.three.objects.removeObject(obj);
                return this;
            }
        }
        return super.remove(...object);
    }
}

//# sourceMappingURL=three.js.map
