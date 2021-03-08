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
import * as THREE from 'three';
window.THREE = THREE;
require('three/examples/js/loaders/ColladaLoader');
require('three/examples/js/loaders/GLTFLoader');
import { EventAggregator } from 'aurelia-event-aggregator';
var ThreeObjects = (function () {
    function ThreeObjects(three) {
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
    ThreeObjects.prototype.setShowEdges = function (show) {
        this.showEdges = show;
        if (this.showEdges) {
            this.addAllEdges();
        }
        else {
            this.removeAllEdges();
        }
    };
    ThreeObjects.prototype.subscribe = function (event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    };
    ThreeObjects.prototype.clearScene = function (clearToolsScene) {
        if (clearToolsScene === void 0) { clearToolsScene = false; }
        var keepObjects = [];
        for (var _i = 0, _a = this.scene.children; _i < _a.length; _i++) {
            var object = _a[_i];
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
        for (var _b = 0, keepObjects_1 = keepObjects; _b < keepObjects_1.length; _b++) {
            var obj = keepObjects_1[_b];
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
    };
    ThreeObjects.prototype.loadJSON = function (json, options) {
        var _this = this;
        if (!this.jsonLoader)
            this.jsonLoader = new THREE.ObjectLoader();
        return new Promise(function (resolve, reject) {
            _this.jsonLoader.parse(json, function (object) {
                resolve(_this.parseLoadedData(object, options));
            });
        });
    };
    ThreeObjects.prototype.loadFile = function (file, options) {
        var _this = this;
        var filetype;
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
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (typeof e.target.result === 'string') {
                    var url = e.target.result;
                    if (filetype === 'mtl')
                        _this.loadMTL(url, true).then(resolve).catch(reject);
                    if (filetype === 'obj')
                        _this.loadOBJ(url, options).then(resolve).catch(reject);
                    if (filetype === 'json')
                        _this.loadJSONFile(url, options).then(resolve).catch(reject);
                    if (filetype === 'dae')
                        _this.loadDae(url, options).then(resolve).catch(reject);
                    if (filetype === 'gltf')
                        _this.loadGltf(url, options).then(resolve).catch(reject);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    ThreeObjects.prototype.loadJSONFile = function (filename, options) {
        var _this = this;
        if (!this.jsonLoader)
            this.jsonLoader = new THREE.ObjectLoader();
        return new Promise(function (resolve, reject) {
            _this.jsonLoader.load(filename, function (object) {
                resolve(_this.parseLoadedData(object, options));
            }, null, reject);
        });
    };
    ThreeObjects.prototype.loadMTL = function (filename, preLoad, addToObjLoader) {
        var _this = this;
        if (preLoad === void 0) { preLoad = true; }
        if (addToObjLoader === void 0) { addToObjLoader = true; }
        if (!this.mtlLoader)
            this.mtlLoader = new MTLLoader();
        if (!this.objLoader)
            this.objLoader = new OBJLoader();
        return new Promise(function (resolve, reject) {
            _this.mtlLoader.load(filename, function (materials) {
                if (preLoad)
                    materials.preload();
                if (addToObjLoader)
                    _this.objLoader.setMaterials(materials);
                resolve(materials);
            }, null, reject);
        });
    };
    ThreeObjects.prototype.loadOBJ = function (filename, options) {
        var _this = this;
        if (!this.objLoader)
            this.objLoader = new OBJLoader();
        return new Promise(function (resolve, reject) {
            _this.objLoader.load(filename, function (object) {
                resolve(_this.parseLoadedData(object, options));
            }, null, reject);
        });
    };
    ThreeObjects.prototype.loadDae = function (filename, options) {
        var _this = this;
        if (!this.colladaLoader)
            this.colladaLoader = new THREE.ColladaLoader();
        return new Promise(function (resolve, reject) {
            _this.colladaLoader.load(filename, function (object) {
                resolve(_this.parseLoadedData(object.scene, options));
            }, null, reject);
        });
    };
    ThreeObjects.prototype.loadGltf = function (filename, options) {
        var _this = this;
        if (!this.gltfLoader)
            this.gltfLoader = new THREE.GLTFLoader();
        return new Promise(function (resolve, reject) {
            _this.gltfLoader.load(filename, function (object) {
                resolve(_this.parseLoadedData(object.scene, options));
            }, null, reject);
        });
    };
    ThreeObjects.prototype.parseLoadedData = function (object, options) {
        if (options === void 0) { options = {}; }
        if (options.render === undefined)
            options.render = true;
        if (options.applyStyles === undefined)
            options.applyStyles = true;
        if (options.calculateOffsetCenter === undefined)
            options.calculateOffsetCenter = 'if-no-offset';
        var bbox;
        window.obj = object;
        if (object.type === 'Object3D') {
            this.log.info('Load an Object3D into the Scene');
            if (this.offset) {
                object.translateOnAxis(this.offset, 1);
            }
            this.addObject(object, options);
            if (!this.offset)
                this.offset = new THREE.Vector3(0, 0, 0);
            var box = new THREE.BoxHelper(object);
            box.geometry.computeBoundingBox();
            bbox = box.geometry.boundingBox;
        }
        if (object.type === 'Scene' || object.type === 'Group') {
            this.log.info('Load a Scene or a Group into the Scene', object.type);
            if (!object.children || object.children.length === 0) {
                this.log.info('Scene:Cancel the loading, scene has no child');
                return { empty: true, bbox: null, object: null };
            }
            var box_1;
            object.traverse(function (node) {
                if (!box_1) {
                    box_1 = new THREE.Box3();
                    box_1.setFromObject(node);
                }
                else {
                    box_1.expandByObject(node);
                }
            });
            if (options.calculateOffsetCenter === 'always' || (options.calculateOffsetCenter === 'if-no-offset' && !this.offset)) {
                if (!this.offset)
                    this.offset = new THREE.Vector3;
                box_1.getCenter(this.offset);
                this.offset.negate();
            }
            while (object.children.length > 0) {
                var child = object.children.pop();
                if (child.type === 'Object3D' && this.offset) {
                    child.translateOnAxis(this.offset, 1);
                }
                else if (child.type === 'Mesh' && this.offset) {
                    child.translateOnAxis(this.offset, 1);
                }
                this.addObject(child, options);
            }
            if (this.offset) {
                box_1.min.x += this.offset.x;
                box_1.min.y += this.offset.y;
                box_1.min.z += this.offset.z;
                box_1.max.x += this.offset.x;
                box_1.max.y += this.offset.y;
                box_1.max.z += this.offset.z;
            }
            this.log.info('Scene:Bbox of the scene', box_1);
            bbox = box_1;
        }
        var newbbox = null;
        this.scene.traverse(function (node) {
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
    };
    ThreeObjects.prototype.addObject = function (object, options) {
        var _this = this;
        if (options && options.userData) {
            if (!object.userData)
                object.userData = {};
            for (var key in options.userData) {
                object.userData[key] = options.userData[key];
            }
            if (object.children) {
                object.traverse(function (o) {
                    if (!o.userData)
                        o.userData = {};
                    for (var key in options.userData) {
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
                object.traverse(function (o) {
                    if (!object.userData.__isOverlay) {
                        _this.addEdgestoObject(o);
                    }
                });
            }
        }
    };
    ThreeObjects.prototype.removeObject = function (object) {
        var _this = this;
        object.__throughRemoveObject = true;
        this.scene.remove(object);
        delete object.__throughRemoveObject;
        this.removeEdgesObject(object);
        if (object.children) {
            object.traverse(function (o) {
                _this.removeEdgesObject(o);
            });
        }
    };
    ThreeObjects.prototype.addEdgestoObject = function (object) {
        if (object instanceof THREE.Mesh) {
            if (object.__edgeObject) {
                return;
            }
            if (object.__ignoreEdges) {
                return;
            }
            var name_1 = object.uuid + "-edge";
            this.counter++;
            var edges = new THREE.EdgesGeometry(object.geometry);
            var line_1 = new THREE.LineSegments(edges, this.edgeMaterial);
            line_1.userData.__isEdge = true;
            line_1.userData.__isOverlay = true;
            line_1.name = name_1;
            line_1.renderOrder = 9;
            object.__edgeObject = line_1;
            setTimeout(function () {
                object.add(line_1);
            }, this.counter);
        }
    };
    ThreeObjects.prototype.removeEdgesObject = function (object) {
        if (object instanceof THREE.Mesh) {
            var line = object.__edgeObject;
            if (!line) {
                return;
            }
            object.remove(line);
            line.geometry.dispose();
        }
    };
    ThreeObjects.prototype.addAllEdges = function () {
        var _this = this;
        this.three.getScene().traverse(function (obj) {
            _this.addEdgestoObject(obj);
        });
    };
    ThreeObjects.prototype.removeAllEdges = function () {
        var objectsToRemove = [];
        this.three.getScene().traverse(function (obj) {
            if (obj.userData.__isEdge) {
                objectsToRemove.push(obj);
            }
        });
        for (var _i = 0, objectsToRemove_1 = objectsToRemove; _i < objectsToRemove_1.length; _i++) {
            var obj = objectsToRemove_1[_i];
            this.three.getScene().remove(obj);
            obj.geometry.dispose();
        }
    };
    Object.defineProperty(ThreeObjects.prototype, "sceneWidth", {
        get: function () {
            return Math.abs(this.bbox.max.x - this.bbox.min.x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeObjects.prototype, "sceneHeight", {
        get: function () {
            return Math.abs(this.bbox.max.y - this.bbox.min.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeObjects.prototype, "sceneDepth", {
        get: function () {
            return Math.abs(this.bbox.max.z - this.bbox.min.z);
        },
        enumerable: false,
        configurable: true
    });
    ThreeObjects.prototype.getBbox = function () {
        return this.bbox;
    };
    Object.defineProperty(ThreeObjects.prototype, "rootObjects", {
        get: function () {
            var objects = [];
            for (var _i = 0, _a = this.scene.children; _i < _a.length; _i++) {
                var obj = _a[_i];
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
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeObjects.prototype, "lights", {
        get: function () {
            var lights = [];
            for (var _i = 0, _a = this.scene.children; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj instanceof THREE.Light)
                    lights.push(obj);
            }
            return lights;
        },
        enumerable: false,
        configurable: true
    });
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
    return ThreeObjects;
}());
export { ThreeObjects };

//# sourceMappingURL=three-objects.js.map
