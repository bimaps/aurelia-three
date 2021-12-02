var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CheckerModuleBaseModel, CheckerModuleIOTypeOptions, CheckerModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate } from 'aurelia-deco';
let CheckerModuleNormalDistanceModel = class CheckerModuleNormalDistanceModel extends CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['triangle', 'triangles', 'line3', 'line3s', 'vector3', 'vector3s'];
        this.moduleType = 'normal-distance';
        this.name = '';
        this.operation = 'min';
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
    type.id,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "id", void 0);
__decorate([
    type.model({ model: ThreeSiteModel }),
    validate.required,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "siteId", void 0);
__decorate([
    type.select({ options: CheckerModuleIOTypeOptions, multiple: true }),
    __metadata("design:type", Array)
], CheckerModuleNormalDistanceModel.prototype, "allowedInputTypes", void 0);
__decorate([
    type.select({ options: CheckerModuleTypeOptions }),
    validate.required,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "moduleType", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "name", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "inputVarName", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "input2VarName", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "outputVarName", void 0);
__decorate([
    type.select({ options: CheckerModuleTypeOptions, multiple: false }),
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "outputType", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "outputSummary", void 0);
__decorate([
    type.select({ options: ['min', 'max'] }),
    __metadata("design:type", String)
], CheckerModuleNormalDistanceModel.prototype, "operation", void 0);
CheckerModuleNormalDistanceModel = __decorate([
    model('/three/checker/flow')
], CheckerModuleNormalDistanceModel);
export { CheckerModuleNormalDistanceModel };

//# sourceMappingURL=checker-module-normal-distance.model.js.map
