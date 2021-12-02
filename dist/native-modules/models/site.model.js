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
var ThreeSiteModel_1;
import { model, Model, type, jsonify } from 'aurelia-deco';
import * as THREE from 'three';
import { getLogger } from 'aurelia-logging';
import { ThreeMaterialModel, ThreeGeometryModel, ThreeObjectModel } from '../internal';
const log = getLogger('three-site-model');
;
let ThreeSiteModel = ThreeSiteModel_1 = class ThreeSiteModel extends Model {
    constructor() {
        super(...arguments);
        this.originalCameraPosition = new THREE.Vector3(0, 0, 0);
        this.originalCameraZoom = 10;
        this.originalCameraLookAt = new THREE.Vector3(0, 0, 0);
        this.buildings = [];
        this.storeys = [];
        this.spaces = [];
        this.authorizedBusinesses = [];
    }
    static clearData(siteId, models = [
        'material',
        'geometry',
        'object',
        'building',
        'storey',
        'space',
        'theme',
        'style',
        'report',
        'checker-flow',
        'checker-modules'
    ]) {
        return ThreeSiteModel_1.api.delete(`/three/site/${siteId}/delete-data`, { models: models }).then(jsonify);
    }
    static clearImport(siteId, importId) {
        return ThreeSiteModel_1.api.delete(`/three/site/${siteId}/delete-import`, importId).then(jsonify);
    }
    static downloadJsonData(json, filename = 'scene.json') {
        let jsonString = JSON.stringify(json);
        let blob = new Blob([jsonString], { type: 'octet/stream' });
        let url = URL.createObjectURL(blob);
        location.href = url;
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    static addJsonData(siteId, json, options) {
        let blob;
        if (json instanceof Blob) {
            blob = json;
        }
        else {
            let jsonString = JSON.stringify(json);
            blob = new Blob([jsonString], { type: 'octet/stream' });
        }
        let formData = new FormData;
        formData.append('json', blob);
        let url = `/three/site/${siteId}/import/json?`;
        if (options && options.importId)
            url += `&importId=${options.importId}`;
        if (options && options.saveLights)
            url += `&saveLights=1`;
        return ThreeSiteModel_1.api.post(url, formData, { bodyFormat: 'FormData' }).then(jsonify);
    }
    static addIFCData(siteId, ifcBlob, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let blob = ifcBlob;
            let formData = new FormData;
            formData.append('ifc', blob);
            let url = `/three/site/${siteId}/import/ifc?`;
            if (options && options.importId)
                url += `&importId=${options.importId}`;
            if (options && options.saveLights)
                url += `&saveLights=1`;
            if (options && options.reportId)
                url += `&reportId=${options.reportId}`;
            if (options && options.sendReportToEmail)
                url += `&email=${options.sendReportToEmail}`;
            const result = yield ThreeSiteModel_1.api.post(url, formData, { bodyFormat: 'FormData' }).then(jsonify);
            if (options && options.callbackWhenUploadDone) {
                options.callbackWhenUploadDone.call(null, result);
            }
            if (options && options.ignoreWaitForCompletion) {
                return true;
            }
            if ((result === null || result === void 0 ? void 0 : result.status) === 'in-progress') {
                return yield ThreeSiteModel_1.waitForOperationCompleted(siteId, result.id);
            }
        });
    }
    static waitForOperationCompleted(siteId, operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ThreeSiteModel_1.api.get(`/three/site/${siteId}/import/ifc/${operationId}`).then(jsonify);
            if (result.status === 'completed') {
                return true;
            }
            if (result.status === 'in-progress' || result.message === 'Failed to fetch') {
                return ThreeSiteModel_1.waitForOperationCompleted(siteId, operationId);
            }
            throw new Error(result.message);
        });
    }
    static getSiteJson(siteId, filterObjectsOptions) {
        return ThreeSiteModel_1.getSiteData(siteId, filterObjectsOptions).then((values) => {
            let loadInfos = {};
            if (values[0] && values[0][0] && values[0][0].get)
                loadInfos = values[0][0].get('_loadInfos');
            let json = {
                metadata: {
                    version: 4.5,
                    type: 'Object',
                    generator: 'swissdata',
                    loadInfos: loadInfos
                },
                geometries: values[1],
                materials: values[2],
                object: {
                    children: values[0].length === 0 ? [] : values[0].map((obj) => {
                        if (obj.children === null)
                            delete obj.children;
                        return obj;
                    }),
                    layers: 1,
                    matrix: [
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1
                    ],
                    type: 'Scene',
                    uuid: siteId
                }
            };
            return json;
        });
    }
    static getSiteData(siteId, filterObjectsOptions) {
        let promises = [];
        let filterObjects = '';
        if (filterObjectsOptions) {
            filterObjects = '&' + ThreeObjectModel.prepareFilters(filterObjectsOptions);
        }
        promises.push(ThreeObjectModel.getAll(`?siteId=${siteId}${filterObjects}`));
        promises.push(ThreeGeometryModel.getAll(`?siteId=${siteId}`));
        promises.push(ThreeMaterialModel.getAll(`?siteId=${siteId}`));
        return Promise.all(promises);
    }
};
__decorate([
    type.id,
    __metadata("design:type", String)
], ThreeSiteModel.prototype, "id", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeSiteModel.prototype, "name", void 0);
__decorate([
    type.any,
    __metadata("design:type", THREE.Vector3)
], ThreeSiteModel.prototype, "center", void 0);
__decorate([
    type.any,
    __metadata("design:type", THREE.Vector3)
], ThreeSiteModel.prototype, "originalCameraPosition", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeSiteModel.prototype, "originalCameraZoom", void 0);
__decorate([
    type.any,
    __metadata("design:type", THREE.Vector3)
], ThreeSiteModel.prototype, "originalCameraLookAt", void 0);
__decorate([
    type.id,
    __metadata("design:type", String)
], ThreeSiteModel.prototype, "bcfProjectId", void 0);
__decorate([
    type.array({ type: 'any' }),
    __metadata("design:type", Array)
], ThreeSiteModel.prototype, "buildings", void 0);
__decorate([
    type.array({ type: 'any' }),
    __metadata("design:type", Array)
], ThreeSiteModel.prototype, "storeys", void 0);
__decorate([
    type.array({ type: 'any' }),
    __metadata("design:type", Array)
], ThreeSiteModel.prototype, "spaces", void 0);
__decorate([
    type.metadata,
    __metadata("design:type", Array)
], ThreeSiteModel.prototype, "metadata", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeSiteModel.prototype, "business", void 0);
__decorate([
    type.array({ type: 'string' }),
    __metadata("design:type", Array)
], ThreeSiteModel.prototype, "authorizedBusinesses", void 0);
ThreeSiteModel = ThreeSiteModel_1 = __decorate([
    model('/three/site')
], ThreeSiteModel);
export { ThreeSiteModel };

//# sourceMappingURL=site.model.js.map
