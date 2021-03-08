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
exports.CheckerModuleNormalDistanceModel = void 0;
var checker_internals_1 = require("./checker-internals");
var site_model_1 = require("../site.model");
var aurelia_deco_1 = require("aurelia-deco");
var CheckerModuleNormalDistanceModel = (function (_super) {
    __extends(CheckerModuleNormalDistanceModel, _super);
    function CheckerModuleNormalDistanceModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allowedInputTypes = ['triangle', 'triangles', 'line3', 'line3s', 'vector3', 'vector3s'];
        _this.moduleType = 'normal-distance';
        _this.name = '';
        _this.operation = 'min';
        return _this;
    }
    CheckerModuleNormalDistanceModel.getAll = function (suffix, options) {
        if (suffix === void 0) { suffix = ''; }
        if (options === void 0) { options = {}; }
        if (!options.route && options.flowId) {
            options.route = this.baseroute.replace('/flow/', "/flow/" + options.flowId + "/module");
        }
        return _super.getAll.call(this, suffix, options).then(function (elements) {
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                if (options.flowId)
                    element.set('flowId', options.flowId);
            }
            return elements;
        });
    };
    CheckerModuleNormalDistanceModel.prototype.getRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleNormalDistanceModel.prototype.postRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleNormalDistanceModel.prototype.putRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    CheckerModuleNormalDistanceModel.prototype.deleteRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    __decorate([
        aurelia_deco_1.type.id,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "id", void 0);
    __decorate([
        aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "siteId", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
        __metadata("design:type", Array)
    ], CheckerModuleNormalDistanceModel.prototype, "allowedInputTypes", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "moduleType", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "name", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "inputVarName", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "input2VarName", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputVarName", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions, multiple: false }),
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputType", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputSummary", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: ['min', 'max'] }),
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "operation", void 0);
    CheckerModuleNormalDistanceModel = __decorate([
        aurelia_deco_1.model('/three/checker/flow')
    ], CheckerModuleNormalDistanceModel);
    return CheckerModuleNormalDistanceModel;
}(checker_internals_1.CheckerModuleBaseModel));
exports.CheckerModuleNormalDistanceModel = CheckerModuleNormalDistanceModel;

//# sourceMappingURL=checker-module-normal-distance.model.js.map
