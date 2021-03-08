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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreeTool } from './three-tool';
import { ThreeUtils } from '../helpers/three-utils';
import { computedFrom } from 'aurelia-binding';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
var log = getLogger('three-selection-tool');
var hidden = {
    material: new THREE.MeshBasicMaterial({ color: '#fff', opacity: 0, transparent: true, alphaTest: 1 })
};
var original = {
    material: 'original'
};
var originalLightOverlay = {
    material: 'original',
    overlay: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.5, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false })
};
var originalOverlay = {
    material: 'original',
    overlay: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.5, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.8, transparent: true, wireframe: true, depthTest: false })
};
var veryLight = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0.1, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false })
};
var light = {
    material: new THREE.MeshBasicMaterial({ color: '#666', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.3, transparent: true, wireframe: true, depthTest: false })
};
var lightBlue = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#000', opacity: 0.4, transparent: true, wireframe: true, depthTest: false })
};
var mediumBlue = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#000', opacity: 0.8, transparent: true, wireframe: true, depthTest: false })
};
var blackWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.9, transparent: true, wireframe: true, depthTest: false })
};
var lightBlueWithRedWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false })
};
var redWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false })
};
var styles = {};
styles.default = {
    excluded: veryLight,
    unselected: original,
    hover: originalLightOverlay,
    selected: originalOverlay,
    ghost: redWireframe
};
styles.light = {
    excluded: hidden,
    unselected: light,
    hover: lightBlue,
    selected: mediumBlue,
    ghost: redWireframe
};
styles.wireframe = {
    excluded: hidden,
    unselected: blackWireframe,
    hover: lightBlueWithRedWireframe,
    selected: redWireframe,
    ghost: redWireframe
};
var ThreeSelectionTool = (function (_super) {
    __extends(ThreeSelectionTool, _super);
    function ThreeSelectionTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'select';
        _this.type = 'add';
        _this.objects = [];
        _this.subscriptions = [];
        _this.style = styles.default;
        _this.keydowns = {};
        return _this;
    }
    ThreeSelectionTool.prototype.onActivate = function () {
        var _this = this;
        if (!this.three) {
            throw new Error('Cannot activate selection tool without a three property');
        }
        var ea = Container.instance.get(EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:leave', function () {
            _this.handleCursor('hover', []);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:hover', function (data) {
            _this.handleCursor('hover', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:click', function (data) {
            _this.handleCursor('click', data);
        }));
        this.rootObject = this.three.getScene();
        this.setRootStyles();
        document.addEventListener('keydown', this);
        document.addEventListener('keyup', this);
    };
    ThreeSelectionTool.prototype.onDeactivate = function () {
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
        document.removeEventListener('keydown', this);
        document.removeEventListener('keyup', this);
    };
    ThreeSelectionTool.prototype.handleEvent = function (event) {
        if (event.keyCode === 16) {
            this.keydowns[event.keyCode] = event.type === 'keydown';
        }
    };
    ThreeSelectionTool.prototype.setStyle = function (style) {
        var _this = this;
        if (styles[style]) {
            this.style = styles[style];
            if (this.active) {
                this.rootObject.children.forEach(function (obj) {
                    _this.applySelectionStyle(obj, _this.style, 'auto', true);
                });
            }
        }
    };
    ThreeSelectionTool.prototype.setRootStyles = function () {
        var _this = this;
        if (!this.three || !this.three.getScene()) {
            return;
        }
        this.clearSelectionStyle();
        this.three.getScene().children.forEach(function (obj) {
            _this.applySelectionStyle(obj, _this.style, 'excluded');
        });
        this.rootObject.children.forEach(function (obj) {
            _this.applySelectionStyle(obj, _this.style, 'unselected');
        });
    };
    ThreeSelectionTool.prototype.clearSelectionStyle = function () {
        if (!this.three || this.three.getScene()) {
            return;
        }
        this.three.getScene().traverse(function (obj) {
            var o = obj;
            if (o.__selectToolOriginalMaterial)
                o.material = o.__selectToolOriginalMaterial;
            o.__selectToolOriginalMaterial = undefined;
            var wireframe = obj.getObjectByName(obj.uuid + "-wireframe");
            if (wireframe)
                obj.remove(wireframe);
            var overlay = obj.getObjectByName(obj.uuid + "-overlay");
            if (overlay)
                obj.remove(overlay);
        });
    };
    ThreeSelectionTool.prototype.applySelectionStyle = function (object, style, type, force) {
        if (force === void 0) { force = false; }
        object.traverse(function (obj) {
            if (obj instanceof THREE.Camera)
                return;
            if (obj instanceof THREE.Light)
                return;
            if (obj.userData.__isWireframe)
                return;
            if (obj.userData.__isOverlay)
                return;
            var o = obj;
            var objType = type;
            if (o.__currentSelectStyleType === objType && !force)
                return;
            if (objType === 'auto')
                objType = o.__currentSelectStyleType || 'unselected';
            if (o.material && !o.__selectToolOriginalMaterial) {
                o.__selectToolOriginalMaterial = o.material;
            }
            var sMaterial = style[objType].material === 'original' ? o.__selectToolOriginalMaterial : style[objType].material;
            var sWireframe = style[objType].wireframe;
            var sOverlay = style[objType].overlay;
            if (o.material) {
                o.material = sMaterial;
                var wireframe = obj.getObjectByName(obj.uuid + "-wireframe");
                if (sWireframe && o.geometry) {
                    if (!wireframe) {
                        wireframe = new THREE.Mesh(o.geometry, sWireframe);
                        wireframe.name = obj.uuid + "-wireframe";
                        wireframe.userData.__isWireframe = true;
                        wireframe.userData.__isOverlay = true;
                        obj.add(wireframe);
                    }
                    else if (wireframe instanceof THREE.Mesh) {
                        wireframe.material = sWireframe;
                    }
                }
                else if (wireframe) {
                    obj.remove(wireframe);
                }
                var overlay = obj.getObjectByName(obj.uuid + "-overlay");
                if (sOverlay && o.geometry) {
                    if (!overlay) {
                        overlay = new THREE.Mesh(o.geometry, sOverlay);
                        overlay.name = obj.uuid + "-overlay";
                        overlay.userData.__isOverlay = true;
                        obj.add(overlay);
                    }
                    else if (overlay instanceof THREE.Mesh) {
                        overlay.material = sOverlay;
                    }
                }
                else if (overlay) {
                    obj.remove(overlay);
                }
            }
            o.__currentSelectStyleType = objType;
        });
    };
    Object.defineProperty(ThreeSelectionTool.prototype, "isRoot", {
        get: function () {
            if (!this.three)
                return false;
            if (!this.rootObject)
                return false;
            return this.rootObject === this.three.getScene();
        },
        enumerable: false,
        configurable: true
    });
    ThreeSelectionTool.prototype.all = function (type) {
        this.service.activate(this);
        this.setSelectedObjects(this.rootObject.children.filter(function (item) {
            if (item instanceof THREE.Camera)
                return false;
            if (item instanceof THREE.Light)
                return false;
            return true;
        }));
        if (type) {
            this.type = type;
        }
    };
    ThreeSelectionTool.prototype.none = function (type) {
        if (!this.three)
            return false;
        this.setSelectedObjects([]);
        this.rootObject = this.three.getScene();
        this.setRootStyles();
        if (type) {
            this.type = type;
        }
    };
    Object.defineProperty(ThreeSelectionTool.prototype, "selectionHasChildren", {
        get: function () {
            if (!this.objects)
                return false;
            if (this.objects.length === 0)
                return false;
            return this.getFirstObjectWithChildren() !== null;
        },
        enumerable: false,
        configurable: true
    });
    ThreeSelectionTool.prototype.getFirstObjectWithChildren = function () {
        if (!this.objects)
            return null;
        if (this.objects.length === 0)
            return null;
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var object = _a[_i];
            for (var _b = 0, _c = object.children || []; _b < _c.length; _b++) {
                var child = _c[_b];
                if (child instanceof THREE.Camera)
                    continue;
                if (child instanceof THREE.Light)
                    continue;
                if (child.userData.__isOverlay)
                    continue;
                if (child.userData.__isWireframe)
                    continue;
                if (child.userData.__isGhost)
                    continue;
                return object;
            }
        }
        return null;
    };
    ThreeSelectionTool.prototype.selectChildren = function () {
        var object = this.getFirstObjectWithChildren();
        this.rootObject = object;
        this.all();
        this.objects = [];
        this.setRootStyles();
    };
    ThreeSelectionTool.prototype.toggleType = function (type) {
        if (this.active && this.type === type) {
            this.service.deactivateAll();
        }
        else {
            this.setType(type);
        }
    };
    ThreeSelectionTool.prototype.setType = function (type) {
        if (type === void 0) { type = 'add'; }
        log.debug('setType', type);
        this.service.activate(this);
        this.type = type;
    };
    ThreeSelectionTool.prototype.handleCursor = function (type, intersections) {
        var _this = this;
        if (!this.active)
            return;
        if (typeof this.filterObjects === 'function') {
            intersections = this.filterObjects(type, intersections);
        }
        if (type === 'hover') {
            var uuids_1 = intersections.reduce(function (res, i) {
                var o = i.object;
                do {
                    res.push(o.uuid);
                    o = o.parent;
                } while (o);
                return res;
            }, []);
            this.rootObject.children.forEach(function (obj) {
                if (obj instanceof THREE.Camera)
                    return;
                if (obj instanceof THREE.Light)
                    return;
                var o = obj;
                if (uuids_1.indexOf(obj.uuid) !== -1) {
                    o.__currentSelectStyleType = 'hover';
                }
                else if (_this.objects.indexOf(obj) !== -1) {
                    o.__currentSelectStyleType = 'selected';
                }
                else {
                    o.__currentSelectStyleType = 'unselected';
                }
                if (o.__currentSelectStyleType) {
                    _this.applySelectionStyle(obj, _this.style, 'auto');
                }
            });
        }
        if (type === 'click') {
            var uuids_2 = intersections.reduce(function (res, i) {
                var o = i.object;
                do {
                    res.push(o.uuid);
                    o = o.parent;
                } while (o);
                return res;
            }, []);
            var objectsAffectedByClick_1 = [];
            this.rootObject.children.forEach(function (obj) {
                if (obj instanceof THREE.Camera)
                    return;
                if (obj instanceof THREE.Light)
                    return;
                if (uuids_2.indexOf(obj.uuid) !== -1) {
                    objectsAffectedByClick_1.push(obj);
                }
            });
            var selectType = this.type;
            if (this.keydowns[16] && selectType === 'select') {
                selectType = 'add';
            }
            if (selectType === 'select') {
                if (objectsAffectedByClick_1.length === 0)
                    return;
                this.setSelectedObjects(objectsAffectedByClick_1);
            }
            else if (selectType === 'add') {
                this.addObjectsToSelection(objectsAffectedByClick_1);
            }
            else if (selectType === 'remove') {
                this.removeObjectsFromSelection(objectsAffectedByClick_1);
            }
        }
    };
    ThreeSelectionTool.prototype.setSelectedObjects = function (objects) {
        log.debug('setSelectedObjects', objects);
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
        }
        for (var _b = 0, objects_1 = objects; _b < objects_1.length; _b++) {
            var obj = objects_1[_b];
            this.applySelectionStyle(obj, this.style, 'selected');
        }
        this.objects = objects;
        var ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'set',
            objects: this.objects
        });
    };
    ThreeSelectionTool.prototype.addObjectsToSelection = function (objects) {
        var _a;
        var _this = this;
        var objectsToAdd = objects.filter(function (i) { return _this.objects.indexOf(i) === -1; });
        (_a = this.objects).push.apply(_a, objectsToAdd);
        for (var _i = 0, objectsToAdd_1 = objectsToAdd; _i < objectsToAdd_1.length; _i++) {
            var obj = objectsToAdd_1[_i];
            this.applySelectionStyle(obj, this.style, 'selected', true);
        }
        var ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'add',
            objects: this.objects,
            added: objectsToAdd
        });
    };
    ThreeSelectionTool.prototype.removeObjectsFromSelection = function (objects) {
        this.objects = this.objects.filter(function (i) { return objects.indexOf(i) === -1; });
        for (var _i = 0, objects_2 = objects; _i < objects_2.length; _i++) {
            var obj = objects_2[_i];
            this.applySelectionStyle(obj, this.style, 'unselected', true);
        }
        var ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'add',
            objects: this.objects,
            added: objects
        });
    };
    Object.defineProperty(ThreeSelectionTool.prototype, "hasSelection", {
        get: function () {
            if (!this.objects)
                return false;
            return this.objects.length !== 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeSelectionTool.prototype, "box", {
        get: function () {
            return ThreeUtils.bboxFromObjects(this.objects);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeSelectionTool.prototype, "center", {
        get: function () {
            return ThreeUtils.centroidFromObjects(this.objects);
        },
        enumerable: false,
        configurable: true
    });
    ThreeSelectionTool.prototype.clearSelectionStyles = function () {
        if (!this.three || !this.three.getScene()) {
            return;
        }
        var objToRemove = [];
        this.three.getScene().traverse(function (object) {
            delete object.__selectToolOriginalMaterial;
            if (object.userData.__isWireframe) {
                objToRemove.push(object);
            }
        });
        for (var _i = 0, objToRemove_1 = objToRemove; _i < objToRemove_1.length; _i++) {
            var object = objToRemove_1[_i];
            this.three.getScene().remove(object);
        }
    };
    ThreeSelectionTool.prototype.applySelectionStyles = function () {
        var _this = this;
        if (!this.three || !this.three.getScene()) {
            return;
        }
        this.three.getScene().traverse(function (object) {
            var selectedUuids = _this.objects.map(function (o) { return o.uuid; });
            if (selectedUuids.includes(object.uuid)) {
                _this.applySelectionStyle(object, _this.style, 'selected', true);
            }
            else if (object.__currentSelectStyleType) {
                _this.applySelectionStyle(object, _this.style, object.__currentSelectStyleType, true);
            }
        });
    };
    __decorate([
        computedFrom('rootObject', 'three'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ThreeSelectionTool.prototype, "isRoot", null);
    __decorate([
        computedFrom('objects', 'objects.length'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ThreeSelectionTool.prototype, "selectionHasChildren", null);
    __decorate([
        computedFrom('objects', 'objects.length'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ThreeSelectionTool.prototype, "hasSelection", null);
    return ThreeSelectionTool;
}(ThreeTool));
export { ThreeSelectionTool };

//# sourceMappingURL=three-selection-tool.js.map
