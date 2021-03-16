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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ThreeMaterialModel } from './material.model';
import { ThreeGeometryModel } from './geometry.model';
import { ThreeObjectModel } from './object.model';
import { model, Model, type, jsonify } from 'aurelia-deco';
import * as THREE from 'three';
import { getLogger } from 'aurelia-logging';
var log = getLogger('three-site-model');
;
var ThreeSiteModel = (function (_super) {
    __extends(ThreeSiteModel, _super);
    function ThreeSiteModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.originalCameraPosition = new THREE.Vector3(0, 0, 0);
        _this.originalCameraZoom = 10;
        _this.originalCameraLookAt = new THREE.Vector3(0, 0, 0);
        _this.buildings = [];
        _this.storeys = [];
        _this.spaces = [];
        return _this;
    }
    ThreeSiteModel_1 = ThreeSiteModel;
    ThreeSiteModel.clearData = function (siteId, models) {
        if (models === void 0) { models = [
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
        ]; }
        return ThreeSiteModel_1.api.delete("/three/site/" + siteId + "/delete-data", { models: models }).then(jsonify);
    };
    ThreeSiteModel.clearImport = function (siteId, importId) {
        return ThreeSiteModel_1.api.delete("/three/site/" + siteId + "/delete-import", importId).then(jsonify);
    };
    ThreeSiteModel.downloadJsonData = function (json, filename) {
        if (filename === void 0) { filename = 'scene.json'; }
        var jsonString = JSON.stringify(json);
        var blob = new Blob([jsonString], { type: 'octet/stream' });
        var url = URL.createObjectURL(blob);
        location.href = url;
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    ThreeSiteModel.addJsonData = function (siteId, json, options) {
        var blob;
        if (json instanceof Blob) {
            blob = json;
        }
        else {
            var jsonString = JSON.stringify(json);
            blob = new Blob([jsonString], { type: 'octet/stream' });
        }
        var formData = new FormData;
        formData.append('json', blob);
        var url = "/three/site/" + siteId + "/import/json?";
        if (options && options.importId)
            url += "&importId=" + options.importId;
        if (options && options.saveLights)
            url += "&saveLights=1";
        return ThreeSiteModel_1.api.post(url, formData, { bodyFormat: 'FormData' }).then(jsonify);
    };
    ThreeSiteModel.addIFCData = function (siteId, ifcBlob, options) {
        return __awaiter(this, void 0, void 0, function () {
            var blob, formData, url, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blob = ifcBlob;
                        formData = new FormData;
                        formData.append('ifc', blob);
                        url = "/three/site/" + siteId + "/import/ifc?";
                        if (options && options.importId)
                            url += "&importId=" + options.importId;
                        if (options && options.saveLights)
                            url += "&saveLights=1";
                        if (options && options.reportId)
                            url += "&reportId=" + options.reportId;
                        if (options && options.sendReportToEmail)
                            url += "&email=" + options.sendReportToEmail;
                        return [4, ThreeSiteModel_1.api.post(url, formData, { bodyFormat: 'FormData' }).then(jsonify)];
                    case 1:
                        result = _a.sent();
                        if (options && options.callbackWhenUploadDone) {
                            options.callbackWhenUploadDone.call(null, result);
                        }
                        if (options && options.ignoreWaitForCompletion) {
                            return [2, true];
                        }
                        if (!((result === null || result === void 0 ? void 0 : result.status) === 'in-progress')) return [3, 3];
                        return [4, ThreeSiteModel_1.waitForOperationCompleted(siteId, result.id)];
                    case 2: return [2, _a.sent()];
                    case 3: return [2];
                }
            });
        });
    };
    ThreeSiteModel.waitForOperationCompleted = function (siteId, operationId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, ThreeSiteModel_1.api.get("/three/site/" + siteId + "/import/ifc/" + operationId).then(jsonify)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 'completed') {
                            return [2, true];
                        }
                        if (result.status === 'in-progress' || result.message === 'Failed to fetch') {
                            return [2, ThreeSiteModel_1.waitForOperationCompleted(siteId, operationId)];
                        }
                        throw new Error(result.message);
                }
            });
        });
    };
    ThreeSiteModel.getSiteJson = function (siteId, filterObjectsOptions) {
        return ThreeSiteModel_1.getSiteData(siteId, filterObjectsOptions).then(function (values) {
            var loadInfos = {};
            if (values[0] && values[0][0] && values[0][0].get)
                loadInfos = values[0][0].get('_loadInfos');
            var json = {
                metadata: {
                    version: 4.5,
                    type: 'Object',
                    generator: 'swissdata',
                    loadInfos: loadInfos
                },
                geometries: values[1],
                materials: values[2],
                object: {
                    children: values[0].length === 0 ? [] : values[0].map(function (obj) {
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
    };
    ThreeSiteModel.getSiteData = function (siteId, filterObjectsOptions) {
        var promises = [];
        var filterObjects = '';
        if (filterObjectsOptions) {
            filterObjects = '&' + ThreeObjectModel.prepareFilters(filterObjectsOptions);
        }
        promises.push(ThreeObjectModel.getAll("?siteId=" + siteId + filterObjects));
        promises.push(ThreeGeometryModel.getAll("?siteId=" + siteId));
        promises.push(ThreeMaterialModel.getAll("?siteId=" + siteId));
        return Promise.all(promises);
    };
    var ThreeSiteModel_1;
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
    ThreeSiteModel = ThreeSiteModel_1 = __decorate([
        model('/three/site')
    ], ThreeSiteModel);
    return ThreeSiteModel;
}(Model));
export { ThreeSiteModel };

//# sourceMappingURL=site.model.js.map
