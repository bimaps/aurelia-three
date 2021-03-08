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
import { CheckerModuleBaseModel } from './checker-internals';
import { CheckerModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate } from 'aurelia-deco';
var CheckerModuleFilterModel = (function (_super) {
    __extends(CheckerModuleFilterModel, _super);
    function CheckerModuleFilterModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allowedInputTypes = ['three-objects', 'scene'];
        _this.moduleType = 'filter';
        _this.name = '';
        _this.outputType = 'three-objects';
        _this.conditionsOperator = 'and';
        return _this;
    }
    CheckerModuleFilterModel.getAll = function (suffix, options) {
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
    CheckerModuleFilterModel.prototype.getRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleFilterModel.prototype.postRoute = function () {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + '/';
    };
    CheckerModuleFilterModel.prototype.putRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    CheckerModuleFilterModel.prototype.deleteRoute = function (elementId) {
        return this.deco.baseroute.replace('/flow', "/flow/" + this.flowId + "/module") + ("/" + elementId);
    };
    __decorate([
        type.id,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "id", void 0);
    __decorate([
        type.model({ model: ThreeSiteModel }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "siteId", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions, multiple: true }),
        __metadata("design:type", Array)
    ], CheckerModuleFilterModel.prototype, "allowedInputTypes", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions }),
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "moduleType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "name", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "inputVarName", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "outputVarName", void 0);
    __decorate([
        type.select({ options: CheckerModuleTypeOptions, multiple: false }),
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "outputType", void 0);
    __decorate([
        type.string,
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "outputSummary", void 0);
    __decorate([
        type.array({
            type: 'object',
            options: {
                keys: {
                    key: { type: 'string' },
                    operation: { type: 'string' },
                    value: { type: 'string' }
                }
            }
        }),
        __metadata("design:type", Array)
    ], CheckerModuleFilterModel.prototype, "conditions", void 0);
    __decorate([
        type.select({ options: ['or', 'and'] }),
        __metadata("design:type", String)
    ], CheckerModuleFilterModel.prototype, "conditionsOperator", void 0);
    CheckerModuleFilterModel = __decorate([
        model('/three/checker/flow')
    ], CheckerModuleFilterModel);
    return CheckerModuleFilterModel;
}(CheckerModuleBaseModel));
export { CheckerModuleFilterModel };

//# sourceMappingURL=checker-module-filter.model.js.map
