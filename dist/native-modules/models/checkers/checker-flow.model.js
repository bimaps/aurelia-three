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
import { CheckerModuleBaseModel } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, Model, type, validate } from 'aurelia-deco';
var CheckerFlowModel = (function (_super) {
    __extends(CheckerFlowModel, _super);
    function CheckerFlowModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        _this.description = '';
        _this.modulesIds = [];
        return _this;
    }
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
    return CheckerFlowModel;
}(Model));
export { CheckerFlowModel };

//# sourceMappingURL=checker-flow.model.js.map
