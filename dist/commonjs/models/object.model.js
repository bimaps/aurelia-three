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
var ThreeObjectModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeObjectModel = void 0;
const aurelia_deco_1 = require("aurelia-deco");
const THREE = require("three");
const aurelia_logging_1 = require("aurelia-logging");
const internal_1 = require("../internal");
const log = aurelia_logging_1.getLogger('three-object-model');
let ThreeObjectModel = ThreeObjectModel_1 = class ThreeObjectModel extends aurelia_deco_1.Model {
    constructor() {
        super(...arguments);
        this.documents = [];
    }
    static prepareFilters(options) {
        let filters = [];
        let globalFilters = [];
        ['uuid', 'name', 'type', 'material', 'geometry', 'parentId'].map((key) => {
            if (typeof options[key] === 'string') {
                filters.push(`${key}=${options[key]}`);
            }
            else if (Array.isArray(options[key])) {
                filters.push(`${key}=${options[key].join(',')}`);
            }
        });
        if (options.insideBbox) {
            globalFilters.push(`{"_min.x": {"$gte": ${options.insideBbox.min.x}}}`);
            globalFilters.push(`{"_min.y": {"$gte": ${options.insideBbox.min.y}}}`);
            globalFilters.push(`{"_min.z": {"$gte": ${options.insideBbox.min.z}}}`);
            globalFilters.push(`{"_max.x": {"$lte": ${options.insideBbox.max.x}}}`);
            globalFilters.push(`{"_max.y": {"$lte": ${options.insideBbox.max.y}}}`);
            globalFilters.push(`{"_max.z": {"$lte": ${options.insideBbox.max.z}}}`);
        }
        if (options.touchBbox) {
            let globalFilters = [];
            globalFilters.push(`{"_min.x": {"$lte": ${options.touchBbox.max.x}}}`);
            globalFilters.push(`{"_min.y": {"$lte": ${options.touchBbox.max.y}}}`);
            globalFilters.push(`{"_min.z": {"$lte": ${options.touchBbox.max.z}}}`);
            globalFilters.push(`{"_max.x": {"$gte": ${options.touchBbox.min.x}}}`);
            globalFilters.push(`{"_max.y": {"$gte": ${options.touchBbox.min.y}}}`);
            globalFilters.push(`{"_max.z": {"$gte": ${options.touchBbox.min.z}}}`);
        }
        if (options.userData) {
            for (let key in options.userData) {
                let value = options.userData[key];
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    if (typeof value === 'string') {
                        value = `"${value}"`;
                    }
                    globalFilters.push(`{"userData.${key}": ${value}}`);
                }
                else if (typeof value === 'object') {
                    globalFilters.push(`{"userData.${key}": ${JSON.stringify(value)}}`);
                }
            }
        }
        if (options.globalFilters) {
            globalFilters.concat(options.globalFilters);
        }
        if (globalFilters.length > 0) {
            let globalFiltersString = `__global__=<{"$and":[${globalFilters.join(', ')}]}>`;
            filters.push(globalFiltersString);
        }
        return filters.join('&');
    }
    static getAll(suffix, options, flat = false) {
        return super.getAll(suffix, options).then((el) => {
            const elements = el;
            if (elements.length === 0)
                return elements;
            let containsLighting = false;
            let hObjects = {};
            let rObjects = [];
            let allIds = elements.map(i => i.id);
            for (let element of elements) {
                if (element instanceof ThreeObjectModel_1) {
                    hObjects[element.id] = element;
                    if (!element.parentId || allIds.indexOf(element.parentId) === -1)
                        rObjects.push(element);
                    if (element.type.indexOf('Light') !== -1)
                        containsLighting = true;
                    if (!element.userData)
                        element.userData = {};
                    element.userData.id = element.id;
                    element.userData.siteId = element.siteId;
                    element.userData.parentId = element.parentId;
                    element.userData.childrenIds = element.childrenIds;
                    element.userData.importId = element.importId;
                    element.userData.buildingId = element.buildingId;
                    element.userData.storeys = element.storeys;
                    element.userData.spaceId = element.spaceId;
                }
            }
            if (!flat) {
                for (let obj of rObjects) {
                    ThreeObjectModel_1.addChildren(obj, hObjects);
                }
            }
            const retValue = flat ? elements : rObjects;
            retValue[0].set('_loadInfos', {
                containsLighting: containsLighting
            });
            return retValue;
        });
    }
    static addChildren(object, hObjects) {
        let children = [];
        for (let childId of object.childrenIds || []) {
            if (hObjects[childId]) {
                let child = hObjects[childId];
                ThreeObjectModel_1.addChildren(child, hObjects);
                children.push(child);
            }
        }
        object.children = children;
        delete object.childrenIds;
    }
    static fromThreeObject(object) {
        let obj = new ThreeObjectModel_1();
        object = object.clone();
        obj.id = object.userData && object.userData.id ? object.userData.id : undefined;
        obj.siteId = object.userData && object.userData.siteId ? object.userData.siteId : undefined;
        obj.parentId = object.parent.userData.id ? object.parent.userData.id : undefined;
        obj.childrenIds = object.children.length ? object.children.map(i => i.userData.id).filter(v => v !== undefined) : [];
        obj.importId = object.userData && object.userData.importId ? object.userData.importId : undefined;
        obj.uuid = object.uuid;
        obj.name = object.name ? object.name : undefined;
        obj.type = object.type;
        obj.matrix = object.matrix.elements;
        const objectMesh = object;
        if (objectMesh.material) {
            if (Array.isArray(objectMesh.material)) {
                obj.material = objectMesh.material.map(i => i.uuid);
            }
            else {
                obj.material = objectMesh.material.uuid;
            }
        }
        if (objectMesh.geometry) {
            if (Array.isArray(objectMesh.geometry)) {
                obj.geometry = objectMesh.geometry.map(i => i.uuid);
            }
            else {
                obj.geometry = objectMesh.geometry.uuid;
            }
        }
        obj.userData = Object.assign({}, object.userData);
        delete obj.userData.id;
        delete obj.userData.siteId;
        delete obj.userData.parentId;
        delete obj.userData.childrenIds;
        delete obj.userData.importId;
        let bbox = new THREE.BoxHelper(object);
        bbox.geometry.computeBoundingBox();
        obj._min = bbox.geometry.boundingBox.min;
        obj._max = bbox.geometry.boundingBox.max;
        return obj;
    }
};
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: internal_1.ThreeSiteModel }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "siteId", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "buildingId", void 0);
__decorate([
    aurelia_deco_1.type.array({ type: 'string' }),
    __metadata("design:type", Array)
], ThreeObjectModel.prototype, "storeys", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "spaceId", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "importId", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "formatVersion", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "uuid", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "name", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "type", void 0);
__decorate([
    aurelia_deco_1.type.array(),
    __metadata("design:type", Array)
], ThreeObjectModel.prototype, "matrix", void 0);
__decorate([
    aurelia_deco_1.type.any(),
    __metadata("design:type", Object)
], ThreeObjectModel.prototype, "material", void 0);
__decorate([
    aurelia_deco_1.type.any(),
    __metadata("design:type", Object)
], ThreeObjectModel.prototype, "geometry", void 0);
__decorate([
    aurelia_deco_1.type.object({ allowOtherKeys: true }),
    __metadata("design:type", Object)
], ThreeObjectModel.prototype, "userData", void 0);
__decorate([
    aurelia_deco_1.type.array(),
    __metadata("design:type", Array)
], ThreeObjectModel.prototype, "children", void 0);
__decorate([
    aurelia_deco_1.type.array(),
    __metadata("design:type", Array)
], ThreeObjectModel.prototype, "childrenIds", void 0);
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], ThreeObjectModel.prototype, "parentId", void 0);
__decorate([
    aurelia_deco_1.type.object({ keys: {
            x: { type: 'float', required: true },
            y: { type: 'float', required: true },
            z: { type: 'float', required: true },
        }, allowOtherKeys: true }),
    __metadata("design:type", THREE.Vector3)
], ThreeObjectModel.prototype, "_min", void 0);
__decorate([
    aurelia_deco_1.type.object({ keys: {
            x: { type: 'float', required: true },
            y: { type: 'float', required: true },
            z: { type: 'float', required: true },
        }, allowOtherKeys: true }),
    __metadata("design:type", THREE.Vector3)
], ThreeObjectModel.prototype, "_max", void 0);
__decorate([
    aurelia_deco_1.type.files({ accepted: 'image/*,application/pdf' }),
    __metadata("design:type", Array)
], ThreeObjectModel.prototype, "documents", void 0);
ThreeObjectModel = ThreeObjectModel_1 = __decorate([
    aurelia_deco_1.model('/three/object')
], ThreeObjectModel);
exports.ThreeObjectModel = ThreeObjectModel;

//# sourceMappingURL=object.model.js.map
