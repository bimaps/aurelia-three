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
let CheckerModuleOutputModel = class CheckerModuleOutputModel extends CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['number', 'numbers', 'string', 'strings', 'boolean', 'booleans'];
        this.moduleType = 'output';
        this.name = '';
        this.outputType = 'json';
        this.outputs = [];
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
], CheckerModuleOutputModel.prototype, "id", void 0);
__decorate([
    type.model({ model: ThreeSiteModel }),
    validate.required,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "siteId", void 0);
__decorate([
    type.select({ options: CheckerModuleIOTypeOptions, multiple: true }),
    __metadata("design:type", Array)
], CheckerModuleOutputModel.prototype, "allowedInputTypes", void 0);
__decorate([
    type.select({ options: CheckerModuleTypeOptions }),
    validate.required,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "moduleType", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "name", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "inputVarName", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "outputVarName", void 0);
__decorate([
    type.select({ options: CheckerModuleTypeOptions, multiple: false }),
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "outputType", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerModuleOutputModel.prototype, "outputSummary", void 0);
__decorate([
    type.array({ type: 'object', options: {
            keys: {
                prefix: { type: 'string' },
                varName: { type: 'string' },
                suffix: { type: 'string' },
                display: { type: 'select', options: ['paragraph', 'blocks'] }
            }
        } }),
    __metadata("design:type", Array)
], CheckerModuleOutputModel.prototype, "outputs", void 0);
CheckerModuleOutputModel = __decorate([
    model('/three/checker/flow')
], CheckerModuleOutputModel);
export { CheckerModuleOutputModel };

//# sourceMappingURL=checker-module-output.model.js.map
