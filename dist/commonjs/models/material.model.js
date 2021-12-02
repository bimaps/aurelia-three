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
var ThreeMaterialModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMaterialModel = void 0;
const aurelia_deco_1 = require("aurelia-deco");
const THREE = require("three");
const internal_1 = require("../internal");
let ThreeMaterialModel = ThreeMaterialModel_1 = class ThreeMaterialModel extends aurelia_deco_1.Model {
    static getAll(suffix, options) {
        return super.getAll(suffix, options).then((el) => {
            const elements = el;
            for (let element of elements) {
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
    }
};
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], ThreeMaterialModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: internal_1.ThreeSiteModel }),
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
exports.ThreeMaterialModel = ThreeMaterialModel;

//# sourceMappingURL=material.model.js.map
