"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMaterialModel = void 0;
var site_model_1 = require("./site.model");
var aurelia_deco_1 = require("aurelia-deco");
var THREE = require("three");
var ThreeMaterialModel = (function (_super) {
    __extends(ThreeMaterialModel, _super);
    function ThreeMaterialModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThreeMaterialModel_1 = ThreeMaterialModel;
    ThreeMaterialModel.getAll = function (suffix, options) {
        return _super.getAll.call(this, suffix, options).then(function (el) {
            var elements = el;
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                if (element instanceof ThreeMaterialModel_1) {
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
    var ThreeMaterialModel_1;
    __decorate([
        aurelia_deco_1.type.id,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "id", void 0);
    __decorate([
        aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "siteId", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "importId", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "formatVersion", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "uuid", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "name", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeMaterialModel.prototype, "type", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Color)
    ], ThreeMaterialModel.prototype, "color", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Color)
    ], ThreeMaterialModel.prototype, "ambient", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Color)
    ], ThreeMaterialModel.prototype, "emissive", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", THREE.Color)
    ], ThreeMaterialModel.prototype, "specular", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeMaterialModel.prototype, "shininess", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeMaterialModel.prototype, "roughness", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeMaterialModel.prototype, "metalness", void 0);
    __decorate([
        aurelia_deco_1.type.float,
        __metadata("design:type", Number)
    ], ThreeMaterialModel.prototype, "opacity", void 0);
    __decorate([
        aurelia_deco_1.type.boolean,
        __metadata("design:type", Boolean)
    ], ThreeMaterialModel.prototype, "transparent", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeMaterialModel.prototype, "side", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Object)
    ], ThreeMaterialModel.prototype, "children", void 0);
    __decorate([
        aurelia_deco_1.type.any,
        __metadata("design:type", Number)
    ], ThreeMaterialModel.prototype, "depthFunc", void 0);
    __decorate([
        aurelia_deco_1.type.boolean,
        __metadata("design:type", Boolean)
    ], ThreeMaterialModel.prototype, "depthTest", void 0);
    __decorate([
        aurelia_deco_1.type.boolean,
        __metadata("design:type", Boolean)
    ], ThreeMaterialModel.prototype, "depthWrite", void 0);
    __decorate([
        aurelia_deco_1.type.object({ allowOtherKeys: true }),
        __metadata("design:type", Object)
    ], ThreeMaterialModel.prototype, "userData", void 0);
    ThreeMaterialModel = ThreeMaterialModel_1 = __decorate([
        aurelia_deco_1.model('/three/material')
    ], ThreeMaterialModel);
    return ThreeMaterialModel;
}(aurelia_deco_1.Model));
exports.ThreeMaterialModel = ThreeMaterialModel;

//# sourceMappingURL=material.model.js.map
