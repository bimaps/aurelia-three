var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { model, Model, type, validate } from 'aurelia-deco';
import { ThreeSiteModel } from '../internal';
let ThreeStyleModel = class ThreeStyleModel extends Model {
    constructor() {
        super(...arguments);
        this.opacity = 1;
        this.labelCentroidMethod = 'auto';
        this.labelOpacity = 1;
        this.iconCentroidMethod = 'auto';
        this.iconOpacity = 1;
    }
};
__decorate([
    type.id,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "id", void 0);
__decorate([
    type.model({ model: ThreeSiteModel }),
    validate.required,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "siteId", void 0);
__decorate([
    type.string,
    validate.required,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "name", void 0);
__decorate([
    type.boolean,
    __metadata("design:type", Boolean)
], ThreeStyleModel.prototype, "display", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "color", void 0);
__decorate([
    type.select({ options: ['basic', 'phong', 'texture'] }),
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "material", void 0);
__decorate([
    type.file({ accept: ['image/*'] }),
    __metadata("design:type", Object)
], ThreeStyleModel.prototype, "image", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "opacity", void 0);
__decorate([
    type.integer,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "renderOrder", void 0);
__decorate([
    type.boolean,
    __metadata("design:type", Boolean)
], ThreeStyleModel.prototype, "displayLabel", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "labelKey", void 0);
__decorate([
    type.string({ textarea: true }),
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "labelTemplate", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "labelBackgroundColor", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "labelTextColor", void 0);
__decorate([
    type.string,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "labelScale", void 0);
__decorate([
    type.select({ options: ['auto', 'bbox', 'polylabel'] }),
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "labelCentroidMethod", void 0);
__decorate([
    type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        }, allowOtherKeys: true }),
    __metadata("design:type", Object)
], ThreeStyleModel.prototype, "labelPosition", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "labelOpacity", void 0);
__decorate([
    type.boolean,
    __metadata("design:type", Boolean)
], ThreeStyleModel.prototype, "icon", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "iconKey", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "iconDefault", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "iconBackground", void 0);
__decorate([
    type.string,
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "iconForeground", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "iconScale", void 0);
__decorate([
    type.select({ options: ['auto', 'bbox', 'polylabel'] }),
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "iconCentroidMethod", void 0);
__decorate([
    type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        } }),
    __metadata("design:type", Object)
], ThreeStyleModel.prototype, "iconPosition", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "iconOpacity", void 0);
__decorate([
    type.boolean,
    __metadata("design:type", Boolean)
], ThreeStyleModel.prototype, "replaceGeometry", void 0);
__decorate([
    type.select({ options: ['cone', 'sphere', 'cube', 'cylinder'] }),
    __metadata("design:type", String)
], ThreeStyleModel.prototype, "geometryShape", void 0);
__decorate([
    type.float,
    __metadata("design:type", Number)
], ThreeStyleModel.prototype, "geometryScale", void 0);
__decorate([
    type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        } }),
    __metadata("design:type", Object)
], ThreeStyleModel.prototype, "geometryPosition", void 0);
__decorate([
    type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        } }),
    __metadata("design:type", Object)
], ThreeStyleModel.prototype, "geometryRotation", void 0);
__decorate([
    type.boolean,
    __metadata("design:type", Boolean)
], ThreeStyleModel.prototype, "edgesDisplay", void 0);
ThreeStyleModel = __decorate([
    model('/three/style')
], ThreeStyleModel);
export { ThreeStyleModel };

//# sourceMappingURL=style.model.js.map
