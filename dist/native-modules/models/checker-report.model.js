var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate } from 'aurelia-deco';
import { CheckerFlowModel } from './checkers/checker-internals';
var ThreeCheckerReportModel = (function (_super) {
    __extends(ThreeCheckerReportModel, _super);
    function ThreeCheckerReportModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.flows = [];
        _this.metadata = [];
        return _this;
    }
    __decorate([
        type.id,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "id", void 0);
    __decorate([
        type.model({ model: ThreeSiteModel }),
        validate.required,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "siteId", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "name", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "description", void 0);
    __decorate([
        type.models({ model: CheckerFlowModel }),
        __metadata("design:type", Array)
    ], ThreeCheckerReportModel.prototype, "flows", void 0);
    __decorate([
        type.metadata,
        __metadata("design:type", Array)
    ], ThreeCheckerReportModel.prototype, "metadata", void 0);
    ThreeCheckerReportModel = __decorate([
        model('/three/checker/report')
    ], ThreeCheckerReportModel);
    return ThreeCheckerReportModel;
}(Model));
export { ThreeCheckerReportModel };

//# sourceMappingURL=checker-report.model.js.map
