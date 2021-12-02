var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CheckerModuleBaseModel } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, Model, type, validate } from 'aurelia-deco';
let CheckerFlowModel = class CheckerFlowModel extends Model {
    constructor() {
        super(...arguments);
        this.name = '';
        this.description = '';
        this.modulesIds = [];
    }
};
__decorate([
    type.id,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "id", void 0);
__decorate([
    type.model({ model: ThreeSiteModel }),
    validate.required,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "siteId", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "name", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], CheckerFlowModel.prototype, "description", void 0);
__decorate([
    type.models({ model: CheckerModuleBaseModel }),
    __metadata("design:type", Array)
], CheckerFlowModel.prototype, "modulesIds", void 0);
CheckerFlowModel = __decorate([
    model('/three/checker/flow')
], CheckerFlowModel);
export { CheckerFlowModel };

//# sourceMappingURL=checker-flow.model.js.map
