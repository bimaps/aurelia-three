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
import { CheckerModuleBaseModel, CheckerExtractTypeOptions, CheckerModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate } from 'aurelia-deco';
var CheckerModuleExtractModel = (function (_super) {
    __extends(CheckerModuleExtractModel, _super);
    function CheckerModuleExtractModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allowedInputTypes = ['three-objects', 'scene', 'three-object'];
        _this.moduleType = 'extract';
        _this.name = '';
        return _this;
    }
    CheckerModuleExtractModel.getAll = function (suffix, options) {
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
    CheckerModuleExtractModel.prototype.getRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleExtractModel.prototype.postRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleExtractModel.prototype.putRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    CheckerModuleExtractModel.prototype.deleteRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    __decorate([
        type.id,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "id", void 0);
    __decorate([
        type.model({ model: ThreeSiteModel }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "siteId", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "moduleType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "name", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "inputVarName", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "outputVarName", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions, multiple: false }),
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "outputType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "outputSummary", void 0);
    __decorate([
        type.select({ options: CheckerExtractTypeOptions }),
        __metadata("design:type", String)
    ], CheckerModuleExtractModel.prototype, "extractType", void 0);
    __decorate([
        type.any,
        __metadata("design:type", Object)
    ], CheckerModuleExtractModel.prototype, "value", void 0);
    __decorate([
        type.boolean,
        __metadata("design:type", Boolean)
    ], CheckerModuleExtractModel.prototype, "forceOutputAsNumber", void 0);
    CheckerModuleExtractModel = __decorate([
        model('/three/checker/flow')
    ], CheckerModuleExtractModel);
    return CheckerModuleExtractModel;
}(CheckerModuleBaseModel));
export { CheckerModuleExtractModel };

//# sourceMappingURL=checker-module-extract.model.js.map
