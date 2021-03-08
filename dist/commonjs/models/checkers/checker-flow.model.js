"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerFlowModel = void 0;
var checker_internals_1 = require("./checker-internals");
var site_model_1 = require("../site.model");
var aurelia_deco_1 = require("aurelia-deco");
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
    return CheckerFlowModel;
}(aurelia_deco_1.Model));
exports.CheckerFlowModel = CheckerFlowModel;

//# sourceMappingURL=checker-flow.model.js.map
