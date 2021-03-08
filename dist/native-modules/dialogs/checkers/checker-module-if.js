var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CheckerModuleIfModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework';
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';
var CheckerModuleIfElement = (function () {
    function CheckerModuleIfElement(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.inputOptions = [];
        this.opened = true;
    }
    CheckerModuleIfElement.prototype.bind = function () {
        if (!Array.isArray(this.module.operations)) {
            this.module.operations = [];
        }
    };
    CheckerModuleIfElement.prototype.setConditionType = function (condition, operation) {
        condition.operation = operation;
        this.triggerChange();
    };
    CheckerModuleIfElement.prototype.addOperation = function () {
        this.module.operations.push({
            outputValue: '',
            conditions: [],
            conditionsOperator: 'and',
            outputStyle: 'default'
        });
        this.triggerChange();
    };
    CheckerModuleIfElement.prototype.removeOperation = function (index) {
        var i = parseInt(index, 10);
        this.module.operations.splice(i, 1);
        this.triggerChange();
    };
    CheckerModuleIfElement.prototype.addCondition = function (operationIndex) {
        var oi = parseInt(operationIndex, 10);
        this.module.operations[oi].conditions.push({
            operation: '=',
            value: ''
        });
        this.triggerChange();
    };
    CheckerModuleIfElement.prototype.removeCondition = function (operationIndex, conditionIndex) {
        var oi = parseInt(operationIndex, 10);
        var ci = parseInt(conditionIndex, 10);
        this.module.operations[oi].conditions.splice(ci, 1);
        this.triggerChange();
    };
    CheckerModuleIfElement.prototype.triggerChange = function () {
        var customEvent = DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    };
    CheckerModuleIfElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        bindable,
        __metadata("design:type", CheckerModuleIfModel)
    ], CheckerModuleIfElement.prototype, "module", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Array)
    ], CheckerModuleIfElement.prototype, "inputOptions", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleIfElement.prototype, "opened", void 0);
    CheckerModuleIfElement = __decorate([
        customElement('checker-module-if'),
        useView('./checker-module-if.html'),
        inject(UxModalService, Element),
        __metadata("design:paramtypes", [UxModalService, HTMLElement])
    ], CheckerModuleIfElement);
    return CheckerModuleIfElement;
}());
export { CheckerModuleIfElement };

//# sourceMappingURL=checker-module-if.js.map
