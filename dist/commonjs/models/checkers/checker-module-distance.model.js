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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerModuleDistanceModel = void 0;
const checker_internals_1 = require("./checker-internals");
const site_model_1 = require("../site.model");
const aurelia_deco_1 = require("aurelia-deco");
let CheckerModuleDistanceModel = class CheckerModuleDistanceModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['vector3s', 'vector3', 'vector2s', 'vector2'];
        this.moduleType = 'distance';
        this.name = '';
    }
    static getAll(suffix = '', options = {}) {
        if (!options.route && options.flowId) {
            options.route = this.baseroute.replace('/flow/', `/flow/${options.flowId}/module`);
        }
        return super.getAll(suffix, options).then((elements) => {
            for (let element of elements) {
                if (options.flowId)
                    element.set('flowId', options.flowId);
            }
            return elements;
        });
    }
    getRoute() {
        return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + '/';
    }
    postRoute() {
        return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + '/';
    }
    putRoute(elementId) {
        return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + `/${elementId}`;
    }
    deleteRoute(elementId) {
        return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + `/${elementId}`;
    }
};
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "siteId", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    __metadata("design:type", Array)
], CheckerModuleDistanceModel.prototype, "allowedInputTypes", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "moduleType", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "name", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "inputVarName", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "input2VarName", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "outputVarName", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions, multiple: false }),
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "outputType", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "outputSummary", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: ['2d-2d', '3d-3d'] }),
    __metadata("design:type", String)
], CheckerModuleDistanceModel.prototype, "distanceType", void 0);
CheckerModuleDistanceModel = __decorate([
    aurelia_deco_1.model('/three/checker/flow')
], CheckerModuleDistanceModel);
exports.CheckerModuleDistanceModel = CheckerModuleDistanceModel;

//# sourceMappingURL=checker-module-distance.model.js.map
