"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeGeometryModel = void 0;
var site_model_1 = require("./site.model");
var aurelia_deco_1 = require("aurelia-deco");
var THREE = require("three");
var ThreeGeometryModel = (function (_super) {
    __extends(ThreeGeometryModel, _super);
    function ThreeGeometryModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThreeGeometryModel_1 = ThreeGeometryModel;
    ThreeGeometryModel.getAll = function (suffix, options) {
        return _super.getAll.call(this, suffix, options).then(function (el) {
            var elements = el;
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                if (element instanceof ThreeGeometryModel_1) {
                    if (!element.userData)
                        element.userData = {};
                    element.userData.id = element.id;
                    element.userData.siteId = element.siteId;
                    element.userData.importId = element.importId;
                }
            }
            return elements;
        });
    };
    var ThreeGeometryModel_1;
    __decorate([
        aurelia_deco_1.type.id,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "id", void 0);
    __decorate([
        aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "siteId", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "importId", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "formatVersion", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "uuid", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeGeometryModel.prototype, "type", void 0);
    __decorate([
        aurelia_deco_1.type.array({ type: 'object', options: {
                keys: {
                    x: { type: 'float', required: true },
                    y: { type: 'float', required: true },
                    z: { type: 'float', required: true }
                }
            }, allowOtherKeys: true }),
        __metadata("design:type", Array)
    ], ThreeGeometryModel.prototype, "vertices", void 0);
    __decorate([
        aurelia_deco_1.type.array({ type: 'any' }),
        __metadata("design:type", Array)
    ], ThreeGeometryModel.prototype, "colors", void 0);
    __decorate([
        aurelia_deco_1.type.array({ type: 'any' }),
        __metadata("design:type", Array)
    ], ThreeGeometryModel.prototype, "faces", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "faceVertexUvs", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "morphTargets", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "morphNormals", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "skinWeights", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "skinIndices", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "lineDistances", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Box3)
    ], ThreeGeometryModel.prototype, "boundingBox", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Sphere)
    ], ThreeGeometryModel.prototype, "boundingSphere", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.BufferAttribute)
    ], ThreeGeometryModel.prototype, "index", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "attributes", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "morphAttributes", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Array)
    ], ThreeGeometryModel.prototype, "groups", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "drawRange", void 0);
    __decorate([
        aurelia_deco_1.type.object({ allowOtherKeys: true }),
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "userData", void 0);
    __decorate([
        aurelia_deco_1.type.boolean,
        __metadata("design:type", Boolean)
    ], ThreeGeometryModel.prototype, "isBufferGeometry", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "data", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "scale", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "visible", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "castShadow", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "receiveShadow", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "doubleSided", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "radius", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "radiusTop", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "radiusBottom", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "width", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "height", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "depth", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeGeometryModel.prototype, "segments", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "radialSegments", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "tubularSegments", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "radiusSegments", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "widthSegments", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "heightSegments", void 0);
    __decorate([
        aurelia_deco_1.type.boolean,
        __metadata("design:type", Boolean)
    ], ThreeGeometryModel.prototype, "openEnded", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "thetaStart", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeGeometryModel.prototype, "thetaLength", void 0);
    ThreeGeometryModel = ThreeGeometryModel_1 = __decorate([
        aurelia_deco_1.model('/three/geometry')
    ], ThreeGeometryModel);
    return ThreeGeometryModel;
}(aurelia_deco_1.Model));
exports.ThreeGeometryModel = ThreeGeometryModel;

//# sourceMappingURL=geometry.model.js.map