var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate } from 'aurelia-deco';
let ThreeCheckerConfigModel = class ThreeCheckerConfigModel extends Model {
    constructor() {
        super(...arguments);
        this.conditions = [];
        this.operationSettings = {};
        this.metadata = [];
    }
};
__decorate([
    type.id,
    __metadata("design:type", String)
], ThreeCheckerConfigModel.prototype, "id", void 0);
__decorate([
    type.model({ model: ThreeSiteModel }),
    validate.required,
    __metadata("design:type", String)
], ThreeCheckerConfigModel.prototype, "siteId", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], ThreeCheckerConfigModel.prototype, "name", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeCheckerConfigModel.prototype, "description", void 0);
__decorate([
    type.array({ type: 'object', options: { keys: {
                key: { type: 'string' },
                operator: { type: 'select', options: ['=', '<', '>', '!=', '*'] },
                value: { type: 'any' }
            } } }),
    __metadata("design:type", Array)
], ThreeCheckerConfigModel.prototype, "conditions", void 0);
__decorate([
    type.select({ options: ['count', 'compare-key-value', 'add-key-value'] }),
    __metadata("design:type", String)
], ThreeCheckerConfigModel.prototype, "operation", void 0);
__decorate([
    type.any,
    __metadata("design:type", Object)
], ThreeCheckerConfigModel.prototype, "operationSettings", void 0);
__decorate([
    type.metadata,
    __metadata("design:type", Array)
], ThreeCheckerConfigModel.prototype, "metadata", void 0);
ThreeCheckerConfigModel = __decorate([
    model('/three/checker')
], ThreeCheckerConfigModel);
export { ThreeCheckerConfigModel };

//# sourceMappingURL=checker-config.model.js.map
