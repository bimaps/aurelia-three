var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Container, computedFrom } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import * as THREE from 'three';
window.THREE = THREE;
import { EventAggregator } from 'aurelia-event-aggregator';
export class ThreeObjects {
    constructor(three) {
        this.log = getLogger('three-objects');
        this.subscriptions = [];
        this.offset = null;
        this.bbox = null;
        this.showEdges = false;
        this.edgeMaterial = new THREE.LineBasicMaterial({ color: '#ccc', depthTest: true });
        this.counter = 0;
        this.three = three;
        this.scene = this.three.getScene();
        this.overlayScene = this.three.getScene('overlay');
        this.toolsScene = this.three.getScene('tools');
    }
    setShowEdges(show) {
        this.showEdges = show;
        if (this.showEdges) {
            this.addAllEdges();
        }
        else {
            this.removeAllEdges();
        }
    }
    subscribe(event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    }
    clearScene(clearToolsScene = false) {
        let keepObjects = [];
        for (let object of this.scene.children) {
            if (object instanceof THREE.Light)
                keepObjects.push(object);
            if (object instanceof THREE.Camera)
                keepObjects.push(object);
            if (object instanceof THREE.AxesHelper)
                keepObjects.push(object);
        }
        while (this.scene.children.length > 0) {
            this.scene.children.pop();
        }
        for (let obj of keepObjects) {
            this.scene.add(obj);
        }
        while (this.overlayScene.children.length > 0) {
            this.overlayScene.children.pop();
        }
        if (clearToolsScene) {
            while (this.toolsScene.children.length > 0) {
                this.toolsScene.children.pop();
            }
        }
        this.offset = null;
        this.bbox = null;
        this.three.publish('scene.request-rendering', { three: this.three });
        this.three.publish('scene.cleared', { three: this.three });
    }
    loadJSON(json, options) {
        if (!this.jsonLoader)
            this.jsonLoader = new THREE.ObjectLoader();
        return new Promise((resolve, reject) => {
            this.jsonLoader.parse(json, (object) => {
                resolve(this.parseLoadedData(object, options));
            });
        });
    }
    loadFile(file, options) {
        let filetype;
        if (file.name.substr(-4) === '.mtl')
            filetype = 'mtl';
        if (file.name.substr(-4) === '.obj')
            filetype = 'obj';
        if (file.name.substr(-5) === '.json')
            filetype = 'json';
        if (file.name.substr(-4) === '.dae')
            filetype = 'dae';
        if (file.name.substr(-5) === '.gltf')
            filetype = 'gltf';
        if (!filetype)
            throw new Error('Invalid file type');
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target.result === 'string') {
                    let url = e.target.result;
                    if (filetype === 'mtl')
                        this.loadMTL(url, true).then(resolve).catch(reject);
                    if (filetype === 'obj')
                        this.loadOBJ(url, options).then(resolve).catch(reject);
                    if (filetype === 'json')
                        this.loadJSONFile(url, options).then(resolve).catch(reject);
                    if (filetype === 'dae')
                        this.loadDae(url, options).then(resolve).catch(reject);
                    if (filetype === 'gltf')
                        this.loadGltf(url, options).then(resolve).catch(reject);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    loadJSONFile(filename, options) {
        if (!this.jsonLoader)
            this.jsonLoader = new THREE.ObjectLoader();
        return new Promise((resolve, reject) => {
            this.jsonLoader.load(filename, (object) => {
                resolve(this.parseLoadedData(object, options));
            }, null, reject);
        });
    }
    loadMTL(filename, preLoad = true, addToObjLoader = true) {
        if (!this.mtlLoader)
            this.mtlLoader = new MTLLoader();
        if (!this.objLoader)
            this.objLoader = new OBJLoader();
        return new Promise((resolve, reject) => {
            this.mtlLoader.load(filename, (materials) => {
                if (preLoad)
                    materials.preload();
                if (addToObjLoader)
                    this.objLoader.setMaterials(materials);
                resolve(materials);
            }, null, reject);
        });
    }
    loadOBJ(filename, options) {
        if (!this.objLoader)
            this.objLoader = new OBJLoader();
        return new Promise((resolve, reject) => {
            this.objLoader.load(filename, (object) => {
                resolve(this.parseLoadedData(object, options));
            }, null, reject);
        });
    }
    loadDae(filename, options) {
        if (!this.colladaLoader)
            this.colladaLoader = new ColladaLoader();
        return new Promise((resolve, reject) => {
            this.colladaLoader.load(filename, (object) => {
                resolve(this.parseLoadedData(object.scene, options));
            }, null, reject);
        });
    }
    loadGltf(filename, options) {
        if (!this.gltfLoader)
            this.gltfLoader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(filename, (object) => {
                resolve(this.parseLoadedData(object.scene, options));
            }, null, reject);
        });
    }
    parseLoadedData(object, options = {}) {
        if (options.render === undefined)
            options.render = true;
        if (options.applyStyles === undefined)
            options.applyStyles = true;
        if (options.calculateOffsetCenter === undefined)
            options.calculateOffsetCenter = 'if-no-offset';
        let bbox;
        window.obj = object;
        if (object.type === 'Object3D') {
            this.log.info('Load an Object3D into the Scene');
            if (this.offset) {
                object.translateOnAxis(this.offset, 1);
            }
            this.addObject(object, options);
            if (!this.offset)
                this.offset = new THREE.Vector3(0, 0, 0);
            let box = new THREE.BoxHelper(object);
            box.geometry.computeBoundingBox();
            bbox = box.geometry.boundingBox;
        }
        if (object.type === 'Scene' || object.type === 'Group') {
            this.log.info('Load a Scene or a Group into the Scene', object.type);
            if (!object.children || object.children.length === 0) {
                this.log.info('Scene:Cancel the loading, scene has no child');
                return { empty: true, bbox: null, object: null };
            }
            let box;
            object.traverse((node) => {
                if (!box) {
                    box = new THREE.Box3();
                    box.setFromObject(node);
                }
                else {
                    box.expandByObject(node);
                }
            });
            if (options.calculateOffsetCenter === 'always' || (options.calculateOffsetCenter === 'if-no-offset' && !this.offset)) {
                if (!this.offset)
                    this.offset = new THREE.Vector3;
                box.getCenter(this.offset);
                this.offset.negate();
            }
            while (object.children.length > 0) {
                let child = object.children.pop();
                if (child.type === 'Object3D' && this.offset) {
                    child.translateOnAxis(this.offset, 1);
                }
                else if (child.type === 'Mesh' && this.offset) {
                    child.translateOnAxis(this.offset, 1);
                }
                this.addObject(child, options);
            }
            if (this.offset) {
                box.min.x += this.offset.x;
                box.min.y += this.offset.y;
                box.min.z += this.offset.z;
                box.max.x += this.offset.x;
                box.max.y += this.offset.y;
                box.max.z += this.offset.z;
            }
            this.log.info('Scene:Bbox of the scene', box);
            bbox = box;
        }
        let newbbox = null;
        this.scene.traverse((node) => {
            if (node.type === 'Scene')
                return;
            if (node.type === 'Group')
                return;
            if (node.type === 'Line')
                return;
            if (!newbbox) {
                newbbox = new THREE.Box3();
                newbbox.setFromObject(node);
            }
            else {
                newbbox.expandByObject(node);
            }
        });
        this.bbox = newbbox;
        if (options.applyStyles)
            this.three.publish('scene.request-styling', { three: this.three });
        if (options.render)
            this.three.publish('scene.request-rendering', { three: this.three });
        this.three.publish('objects.parsed', { three: this.three, bbox: bbox });
        return { empty: false, object: object, bbox: bbox };
    }
    addObject(object, options) {
        if (options && options.userData) {
            if (!object.userData)
                object.userData = {};
            for (let key in options.userData) {
                object.userData[key] = options.userData[key];
            }
            if (object.children) {
                object.traverse((o) => {
                    if (!o.userData)
                        o.userData = {};
                    for (let key in options.userData) {
                        o.userData[key] = options.userData[key];
                    }
                });
            }
        }
        this.three.publish('objects.add', { object: object, options: options });
        object.__throughAddObject = true;
        this.scene.add(object);
        delete object.__throughAddObject;
        if (this.showEdges && !object.userData.__isOverlay) {
            this.addEdgestoObject(object);
            if (object.children) {
                object.traverse((o) => {
                    if (!object.userData.__isOverlay) {
                        this.addEdgestoObject(o);
                    }
                });
            }
        }
    }
    removeObject(object) {
        object.__throughRemoveObject = true;
        this.scene.remove(object);
        delete object.__throughRemoveObject;
        this.removeEdgesObject(object);
        if (object.children) {
            object.traverse((o) => {
                this.removeEdgesObject(o);
            });
        }
    }
    addEdgestoObject(object) {
        if (object instanceof THREE.Mesh) {
            if (object.__edgeObject) {
                return;
            }
            if (object.__ignoreEdges) {
                return;
            }
            const name = `${object.uuid}-edge`;
            this.counter++;
            const edges = new THREE.EdgesGeometry(object.geometry);
            const line = new THREE.LineSegments(edges, this.edgeMaterial);
            line.userData.__isEdge = true;
            line.userData.__isOverlay = true;
            line.name = name;
            line.renderOrder = 9;
            object.__edgeObject = line;
            setTimeout(() => {
                object.add(line);
            }, this.counter);
        }
    }
    removeEdgesObject(object) {
        if (object instanceof THREE.Mesh) {
            const line = object.__edgeObject;
            if (!line) {
                return;
            }
            object.remove(line);
            line.geometry.dispose();
        }
    }
    addAllEdges() {
        this.three.getScene().traverse((obj) => {
            this.addEdgestoObject(obj);
        });
    }
    removeAllEdges() {
        const objectsToRemove = [];
        this.three.getScene().traverse((obj) => {
            if (obj.userData.__isEdge) {
                objectsToRemove.push(obj);
            }
        });
        for (let obj of objectsToRemove) {
            this.three.getScene().remove(obj);
            obj.geometry.dispose();
        }
    }
    get sceneWidth() {
        return Math.abs(this.bbox.max.x - this.bbox.min.x);
    }
    get sceneHeight() {
        return Math.abs(this.bbox.max.y - this.bbox.min.y);
    }
    get sceneDepth() {
        return Math.abs(this.bbox.max.z - this.bbox.min.z);
    }
    getBbox() {
        return this.bbox;
    }
    get rootObjects() {
        let objects = [];
        for (let obj of this.scene.children) {
            if (obj instanceof THREE.Light)
                continue;
            if (obj instanceof THREE.Camera)
                continue;
            if (obj instanceof THREE.AxesHelper)
                continue;
            if (obj instanceof THREE.BoxHelper)
                continue;
            if (obj instanceof THREE.Box3Helper)
                continue;
            if (obj instanceof THREE.GridHelper)
                continue;
            if (obj instanceof THREE.ArrowHelper)
                continue;
            if (obj instanceof THREE.PlaneHelper)
                continue;
            if (obj instanceof THREE.CameraHelper)
                continue;
            objects.push(obj);
        }
        return objects;
    }
    get lights() {
        let lights = [];
        for (let obj of this.scene.children) {
            if (obj instanceof THREE.Light)
                lights.push(obj);
        }
        return lights;
    }
}
__decorate([
    computedFrom('scene.children', 'scene.children.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeObjects.prototype, "rootObjects", null);
__decorate([
    computedFrom('scene.children', 'scene.children.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeObjects.prototype, "lights", null);

//# sourceMappingURL=three-objects.js.map
