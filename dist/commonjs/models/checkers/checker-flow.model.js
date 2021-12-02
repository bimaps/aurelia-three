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
exports.CheckerFlowModel = void 0;
const checker_internals_1 = require("./checker-internals");
const site_model_1 = require("../site.model");
const aurelia_deco_1 = require("aurelia-deco");
let CheckerFlowModel = class CheckerFlowModel extends aurelia_deco_1.Model {
    constructor() {
        super(...arguments);
        this.name = '';
        this.description = '';
        this.modulesIds = [];
    }
};
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "siteId", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "name", void 0);
__decorate([
    aurelia_deco_1.type.string,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "description", void 0);
__decorate([
    aurelia_deco_1.type.models({ model: checker_internals_1.CheckerModuleBaseModel }),
    __metadata("design:type", Array)
], CheckerFlowModel.prototype, "modulesIds", void 0);
CheckerFlowModel = __decorate([
    aurelia_deco_1.model('/three/checker/flow')
], CheckerFlowModel);
exports.CheckerFlowModel = CheckerFlowModel;

//# sourceMappingURL=checker-flow.model.js.map
