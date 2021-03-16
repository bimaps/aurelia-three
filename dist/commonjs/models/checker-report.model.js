"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeCheckerReportModel = void 0;
var site_model_1 = require("./site.model");
var aurelia_deco_1 = require("aurelia-deco");
var checker_internals_1 = require("./checkers/checker-internals");
var ThreeCheckerReportModel = (function (_super) {
    __extends(ThreeCheckerReportModel, _super);
    function ThreeCheckerReportModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.flows = [];
        _this.metadata = [];
        return _this;
    }
    __decorate([
        aurelia_deco_1.type.id,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "id", void 0);
    __decorate([
        aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "siteId", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "name", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], ThreeCheckerReportModel.prototype, "description", void 0);
    __decorate([
        aurelia_deco_1.type.models({ model: checker_internals_1.CheckerFlowModel }),
        __metadata("design:type", Array)
    ], ThreeCheckerReportModel.prototype, "flows", void 0);
    __decorate([
        aurelia_deco_1.type.metadata,
        __metadata("design:type", Array)
    ], ThreeCheckerReportModel.prototype, "metadata", void 0);
    ThreeCheckerReportModel = __decorate([
        aurelia_deco_1.model('/three/checker/report')
    ], ThreeCheckerReportModel);
    return ThreeCheckerReportModel;
}(aurelia_deco_1.Model));
exports.ThreeCheckerReportModel = ThreeCheckerReportModel;

//# sourceMappingURL=checker-report.model.js.map
