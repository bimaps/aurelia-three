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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeObjectPropertyExplorer = void 0;
const object_model_1 = require("./../models/object.model");
const aurelia_framework_1 = require("aurelia-framework");
const resolvePath = require("object-resolve-path");
const aurelia_logging_1 = require("aurelia-logging");
const THREE = require("three");
const log = aurelia_logging_1.getLogger('three-object-property-explorer');
let ThreeObjectPropertyExplorer = class ThreeObjectPropertyExplorer {
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
        this.properties = [];
        this.canEdit = false;
        this.editDocuments = false;
        this.ready = false;
        this.props = [];
    }
    bind() {
        this.objectChanged();
        this.propertiesChanged();
    }
    objectChanged() {
        this.ready = false;
        this.taskQueue.queueTask(() => {
            this.ready = true;
        });
        log.debug('object', this.object);
        this.getDocuments();
    }
    getDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance = yield object_model_1.ThreeObjectModel.getOneWithId(this.object.userData.id);
            for (const document of this.instance.documents || []) {
                if (document.type.indexOf('image/') === 0) {
                    const preview = yield this.instance.getFilePreviewUrl('documents', '30:30', { fileId: document.filename });
                    document.preview = preview;
                }
            }
        });
    }
    documentsUpdated() {
        this.getDocuments();
        this.editDocuments = false;
    }
    propertiesChanged() {
        const props = [];
        const properties = Array.isArray(this.properties) ? this.properties : this.properties(this.object);
        for (let prop of properties) {
            if (prop.substr(-2) === '.*') {
                const key = prop.substr(0, prop.length - 2);
                const value = resolvePath(this.object, key);
                if (typeof value !== 'object') {
                    continue;
                }
                const subKeys = Object.keys(value);
                for (let subKey of subKeys) {
                    props.push(`${key}["${subKey}"]`);
                }
            }
            else {
                props.push(prop);
            }
        }
        this.props = props;
    }
    value(prop) {
        const anyValue = resolvePath(this.object, prop);
        if (typeof anyValue === 'string' || typeof anyValue === 'number') {
            return anyValue;
        }
        else if (typeof anyValue === 'boolean') {
            return anyValue ? 'Yes' : 'No';
        }
        else {
            return typeof anyValue;
        }
    }
    label(prop) {
        return prop.replace('["', '.').replace('"]', '').split('.').join(' ');
    }
    downloadDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const preview = yield this.instance.getFilePreview('documents', 'original', { fileId: document.filename });
            const response = yield this.instance.api.get(`${this.instance.getOneRoute(this.instance.id)}?download=documents&fileId=${document.filename}`, { etag: document.filename });
            const blob = yield response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        });
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", THREE.Object3D)
], ThreeObjectPropertyExplorer.prototype, "object", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Object)
], ThreeObjectPropertyExplorer.prototype, "properties", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Object)
], ThreeObjectPropertyExplorer.prototype, "canEdit", void 0);
ThreeObjectPropertyExplorer = __decorate([
    aurelia_framework_1.inject(aurelia_framework_1.TaskQueue),
    __metadata("design:paramtypes", [aurelia_framework_1.TaskQueue])
], ThreeObjectPropertyExplorer);
exports.ThreeObjectPropertyExplorer = ThreeObjectPropertyExplorer;

//# sourceMappingURL=three-object-property-explorer.js.map
