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
const log = getLogger('three-selection-tool');
let hidden = {
    material: new THREE.MeshBasicMaterial({ color: '#fff', opacity: 0, transparent: true, alphaTest: 1 })
};
let original = {
    material: 'original'
};
let originalLightOverlay = {
    material: 'original',
    overlay: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.5, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false })
};
let originalOverlay = {
    material: 'original',
    overlay: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.5, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.8, transparent: true, wireframe: true, depthTest: false })
};
let veryLight = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0.1, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false })
};
let light = {
    material: new THREE.MeshBasicMaterial({ color: '#666', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.3, transparent: true, wireframe: true, depthTest: false })
};
let lightBlue = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#000', opacity: 0.4, transparent: true, wireframe: true, depthTest: false })
};
let mediumBlue = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#000', opacity: 0.8, transparent: true, wireframe: true, depthTest: false })
};
let blackWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#333', opacity: 0.9, transparent: true, wireframe: true, depthTest: false })
};
let lightBlueWithRedWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#33f', opacity: 0.3, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false })
};
let redWireframe = {
    material: new THREE.MeshBasicMaterial({ color: '#ddd', opacity: 0, transparent: true }),
    wireframe: new THREE.MeshBasicMaterial({ color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false })
};
let styles = {};
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
export class ThreeSelectionTool extends ThreeTool {
    constructor() {
        super(...arguments);
        this.name = 'select';
        this.type = 'add';
        this.objects = [];
        this.subscriptions = [];
        this.style = styles.default;
        this.keydowns = {};
    }
    onActivate() {
        if (!this.three) {
            throw new Error('Cannot activate selection tool without a three property');
        }
        let ea = Container.instance.get(EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:leave', () => {
            this.handleCursor('hover', []);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:hover', (data) => {
            this.handleCursor('hover', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:click', (data) => {
            this.handleCursor('click', data);
        }));
        this.rootObject = this.three.getScene();
        this.setRootStyles();
        document.addEventListener('keydown', this);
        document.addEventListener('keyup', this);
    }
    onDeactivate() {
        for (let sub of this.subscriptions) {
            sub.dispose();
        }
        document.removeEventListener('keydown', this);
        document.removeEventListener('keyup', this);
    }
    handleEvent(event) {
        if (event.keyCode === 16) {
            this.keydowns[event.keyCode] = event.type === 'keydown';
        }
    }
    setStyle(style) {
        if (styles[style]) {
            this.style = styles[style];
            if (this.active) {
                this.rootObject.children.forEach((obj) => {
                    this.applySelectionStyle(obj, this.style, 'auto', true);
                });
            }
        }
    }
    setRootStyles() {
        if (!this.three || !this.three.getScene()) {
            return;
        }
        this.clearSelectionStyle();
        this.three.getScene().children.forEach((obj) => {
            this.applySelectionStyle(obj, this.style, 'excluded');
        });
        this.rootObject.children.forEach((obj) => {
            this.applySelectionStyle(obj, this.style, 'unselected');
        });
    }
    clearSelectionStyle() {
        if (!this.three || this.three.getScene()) {
            return;
        }
        this.three.getScene().traverse((obj) => {
            const o = obj;
            if (o.__selectToolOriginalMaterial)
                o.material = o.__selectToolOriginalMaterial;
            o.__selectToolOriginalMaterial = undefined;
            let wireframe = obj.getObjectByName(`${obj.uuid}-wireframe`);
            if (wireframe)
                obj.remove(wireframe);
            let overlay = obj.getObjectByName(`${obj.uuid}-overlay`);
            if (overlay)
                obj.remove(overlay);
        });
    }
    applySelectionStyle(object, style, type, force = false) {
        object.traverse((obj) => {
            if (obj instanceof THREE.Camera)
                return;
            if (obj instanceof THREE.Light)
                return;
            if (obj.userData.__isWireframe)
                return;
            if (obj.userData.__isOverlay)
                return;
            const o = obj;
            let objType = type;
            if (o.__currentSelectStyleType === objType && !force)
                return;
            if (objType === 'auto')
                objType = o.__currentSelectStyleType || 'unselected';
            if (o.material && !o.__selectToolOriginalMaterial) {
                o.__selectToolOriginalMaterial = o.material;
            }
            let sMaterial = style[objType].material === 'original' ? o.__selectToolOriginalMaterial : style[objType].material;
            let sWireframe = style[objType].wireframe;
            let sOverlay = style[objType].overlay;
            if (o.material) {
                o.material = sMaterial;
                let wireframe = obj.getObjectByName(`${obj.uuid}-wireframe`);
                if (sWireframe && o.geometry) {
                    if (!wireframe) {
                        wireframe = new THREE.Mesh(o.geometry, sWireframe);
                        wireframe.name = `${obj.uuid}-wireframe`;
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
                let overlay = obj.getObjectByName(`${obj.uuid}-overlay`);
                if (sOverlay && o.geometry) {
                    if (!overlay) {
                        overlay = new THREE.Mesh(o.geometry, sOverlay);
                        overlay.name = `${obj.uuid}-overlay`;
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
    }
    get isRoot() {
        if (!this.three)
            return false;
        if (!this.rootObject)
            return false;
        return this.rootObject === this.three.getScene();
    }
    all(type) {
        this.service.activate(this);
        this.setSelectedObjects(this.rootObject.children.filter((item) => {
            if (item instanceof THREE.Camera)
                return false;
            if (item instanceof THREE.Light)
                return false;
            return true;
        }));
        if (type) {
            this.type = type;
        }
    }
    none(type) {
        if (!this.three)
            return false;
        this.setSelectedObjects([]);
        this.rootObject = this.three.getScene();
        this.setRootStyles();
        if (type) {
            this.type = type;
        }
    }
    get selectionHasChildren() {
        if (!this.objects)
            return false;
        if (this.objects.length === 0)
            return false;
        return this.getFirstObjectWithChildren() !== null;
    }
    getFirstObjectWithChildren() {
        if (!this.objects)
            return null;
        if (this.objects.length === 0)
            return null;
        for (let object of this.objects) {
            for (let child of object.children || []) {
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
    }
    selectChildren() {
        let object = this.getFirstObjectWithChildren();
        this.rootObject = object;
        this.all();
        this.objects = [];
        this.setRootStyles();
    }
    toggleType(type) {
        if (this.active && this.type === type) {
            this.service.deactivateAll();
        }
        else {
            this.setType(type);
        }
    }
    setType(type = 'add') {
        log.debug('setType', type);
        this.service.activate(this);
        this.type = type;
    }
    handleCursor(type, intersections) {
        if (!this.active)
            return;
        if (typeof this.filterObjects === 'function') {
            intersections = this.filterObjects(type, intersections);
        }
        if (type === 'hover') {
            let uuids = intersections.reduce((res, i) => {
                let o = i.object;
                do {
                    res.push(o.uuid);
                    o = o.parent;
                } while (o);
                return res;
            }, []);
            this.rootObject.children.forEach((obj) => {
                if (obj instanceof THREE.Camera)
                    return;
                if (obj instanceof THREE.Light)
                    return;
                const o = obj;
                if (uuids.indexOf(obj.uuid) !== -1) {
                    o.__currentSelectStyleType = 'hover';
                }
                else if (this.objects.indexOf(obj) !== -1) {
                    o.__currentSelectStyleType = 'selected';
                }
                else {
                    o.__currentSelectStyleType = 'unselected';
                }
                if (o.__currentSelectStyleType) {
                    this.applySelectionStyle(obj, this.style, 'auto');
                }
            });
        }
        if (type === 'click') {
            let uuids = intersections.reduce((res, i) => {
                let o = i.object;
                do {
                    res.push(o.uuid);
                    o = o.parent;
                } while (o);
                return res;
            }, []);
            let objectsAffectedByClick = [];
            this.rootObject.children.forEach((obj) => {
                if (obj instanceof THREE.Camera)
                    return;
                if (obj instanceof THREE.Light)
                    return;
                if (uuids.indexOf(obj.uuid) !== -1) {
                    objectsAffectedByClick.push(obj);
                }
            });
            let selectType = this.type;
            if (this.keydowns[16] && selectType === 'select') {
                selectType = 'add';
            }
            if (selectType === 'select') {
                if (objectsAffectedByClick.length === 0)
                    return;
                this.setSelectedObjects(objectsAffectedByClick);
            }
            else if (selectType === 'add') {
                this.addObjectsToSelection(objectsAffectedByClick);
            }
            else if (selectType === 'remove') {
                this.removeObjectsFromSelection(objectsAffectedByClick);
            }
        }
    }
    setSelectedObjects(objects) {
        log.debug('setSelectedObjects', objects);
        for (let obj of this.objects) {
        }
        for (let obj of objects) {
            this.applySelectionStyle(obj, this.style, 'selected');
        }
        this.objects = objects;
        let ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'set',
            objects: this.objects
        });
    }
    addObjectsToSelection(objects) {
        let objectsToAdd = objects.filter(i => this.objects.indexOf(i) === -1);
        this.objects.push(...objectsToAdd);
        for (let obj of objectsToAdd) {
            this.applySelectionStyle(obj, this.style, 'selected', true);
        }
        let ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'add',
            objects: this.objects,
            added: objectsToAdd
        });
    }
    removeObjectsFromSelection(objects) {
        this.objects = this.objects.filter(i => objects.indexOf(i) === -1);
        for (let obj of objects) {
            this.applySelectionStyle(obj, this.style, 'unselected', true);
        }
        let ea = Container.instance.get(EventAggregator);
        ea.publish('three-selection:changed', {
            type: 'add',
            objects: this.objects,
            added: objects
        });
    }
    get hasSelection() {
        if (!this.objects)
            return false;
        return this.objects.length !== 0;
    }
    get box() {
        return ThreeUtils.bboxFromObjects(this.objects);
    }
    get center() {
        return ThreeUtils.centroidFromObjects(this.objects);
    }
    clearSelectionStyles() {
        if (!this.three || !this.three.getScene()) {
            return;
        }
        const objToRemove = [];
        this.three.getScene().traverse((object) => {
            delete object.__selectToolOriginalMaterial;
            if (object.userData.__isWireframe) {
                objToRemove.push(object);
            }
        });
        for (let object of objToRemove) {
            this.three.getScene().remove(object);
        }
    }
    applySelectionStyles() {
        if (!this.three || !this.three.getScene()) {
            return;
        }
        this.three.getScene().traverse((object) => {
            const selectedUuids = this.objects.map(o => o.uuid);
            if (selectedUuids.includes(object.uuid)) {
                this.applySelectionStyle(object, this.style, 'selected', true);
            }
            else if (object.__currentSelectStyleType) {
                this.applySelectionStyle(object, this.style, object.__currentSelectStyleType, true);
            }
        });
    }
}
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

//# sourceMappingURL=three-selection-tool.js.map
