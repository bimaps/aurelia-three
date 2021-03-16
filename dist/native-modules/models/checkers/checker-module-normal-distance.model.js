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
import { CheckerModuleBaseModel, CheckerModuleIOTypeOptions, CheckerModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate } from 'aurelia-deco';
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
        type.id,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "id", void 0);
    __decorate([
        type.model({ model: ThreeSiteModel }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "siteId", void 0);
    __decorate([
        type.select({ options: CheckerModuleIOTypeOptions, multiple: true }),
        __metadata("design:type", Array)
    ], CheckerModuleNormalDistanceModel.prototype, "allowedInputTypes", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "moduleType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "name", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "inputVarName", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "input2VarName", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputVarName", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions, multiple: false }),
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "outputSummary", void 0);
    __decorate([
        type.select({ options: ['min', 'max'] }),
        __metadata("design:type", String)
    ], CheckerModuleNormalDistanceModel.prototype, "operation", void 0);
    CheckerModuleNormalDistanceModel = __decorate([
        model('/three/checker/flow')
    ], CheckerModuleNormalDistanceModel);
    return CheckerModuleNormalDistanceModel;
}(CheckerModuleBaseModel));
export { CheckerModuleNormalDistanceModel };

//# sourceMappingURL=checker-module-normal-distance.model.js.map
