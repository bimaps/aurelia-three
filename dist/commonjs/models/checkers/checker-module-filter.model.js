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
exports.CheckerModuleFilterModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const aurelia_deco_1 = require("aurelia-deco");
let CheckerModuleFilterModel = class CheckerModuleFilterModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['three-objects', 'scene'];
        this.moduleType = 'filter';
        this.name = '';
        this.outputType = 'three-objects';
        this.conditionsOperator = 'and';
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
], CheckerModuleFilterModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "siteId", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions, multiple: true }),
    __metadata("design:type", Array)
], CheckerModuleFilterModel.prototype, "allowedInputTypes", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "moduleType", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "name", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "inputVarName", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "outputVarName", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions, multiple: false }),
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "outputType", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "outputSummary", void 0);
__decorate([
    aurelia_deco_1.type.array({
        type: 'object',
        options: {
            keys: {
                key: { type: 'string' },
                operation: { type: 'string' },
                value: { type: 'string' }
            }
        }
    }),
    __metadata("design:type", Array)
], CheckerModuleFilterModel.prototype, "conditions", void 0);
__decorate([
    aurelia_deco_1.type.select({ options: ['or', 'and'] }),
    __metadata("design:type", String)
], CheckerModuleFilterModel.prototype, "conditionsOperator", void 0);
CheckerModuleFilterModel = __decorate([
    aurelia_deco_1.model('/three/checker/flow')
], CheckerModuleFilterModel);
exports.CheckerModuleFilterModel = CheckerModuleFilterModel;

//# sourceMappingURL=checker-module-filter.model.js.map
