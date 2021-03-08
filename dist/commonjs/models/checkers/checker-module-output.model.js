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
exports.CheckerModuleOutputModel = void 0;
var checker_internals_1 = require("./checker-internals");
var site_model_1 = require("../site.model");
var aurelia_deco_1 = require("aurelia-deco");
var CheckerModuleOutputModel = (function (_super) {
    __extends(CheckerModuleOutputModel, _super);
    function CheckerModuleOutputModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allowedInputTypes = ['number', 'numbers', 'string', 'strings', 'boolean', 'booleans'];
        _this.moduleType = 'output';
        _this.name = '';
        _this.outputType = 'json';
        _this.outputs = [];
        return _this;
    }
    CheckerModuleOutputModel.getAll = function (suffix, options) {
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
    CheckerModuleOutputModel.prototype.getRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleOutputModel.prototype.postRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleOutputModel.prototype.putRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    CheckerModuleOutputModel.prototype.deleteRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    __decorate([
        aurelia_deco_1.type.id,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "id", void 0);
    __decorate([
        aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "siteId", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
        __metadata("design:type", Array)
    ], CheckerModuleOutputModel.prototype, "allowedInputTypes", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions }),
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "moduleType", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "name", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "inputVarName", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        aurelia_deco_1.validate.required,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "outputVarName", void 0);
    __decorate([
        aurelia_deco_1.type.select({ options: checker_internals_1.CheckerModuleTypeOptions, multiple: false }),
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "outputType", void 0);
    __decorate([
        aurelia_deco_1.type.string,
        __metadata("design:type", String)
    ], CheckerModuleOutputModel.prototype, "outputSummary", void 0);
    __decorate([
        aurelia_deco_1.type.array({ type: 'object', options: {
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
        aurelia_deco_1.model('/three/checker/flow')
    ], CheckerModuleOutputModel);
    return CheckerModuleOutputModel;
}(checker_internals_1.CheckerModuleBaseModel));
exports.CheckerModuleOutputModel = CheckerModuleOutputModel;

//# sourceMappingURL=checker-module-output.model.js.map
