"use strict";
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
exports.CheckerModuleIfElement = void 0;
var checker_internals_1 = require("./../../models/checkers/checker-internals");
var aurelia_framework_1 = require("aurelia-framework");
var modal_1 = require("@aurelia-ux/modal");
var aurelia_pal_1 = require("aurelia-pal");
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
        var customEvent = aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    };
    CheckerModuleIfElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", checker_internals_1.CheckerModuleIfModel)
    ], CheckerModuleIfElement.prototype, "module", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], CheckerModuleIfElement.prototype, "inputOptions", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleIfElement.prototype, "opened", void 0);
    CheckerModuleIfElement = __decorate([
        aurelia_framework_1.customElement('checker-module-if'),
        aurelia_framework_1.useView('./checker-module-if.html'),
        aurelia_framework_1.inject(modal_1.UxModalService, Element),
        __metadata("design:paramtypes", [modal_1.UxModalService, HTMLElement])
    ], CheckerModuleIfElement);
    return CheckerModuleIfElement;
}());
exports.CheckerModuleIfElement = CheckerModuleIfElement;

//# sourceMappingURL=checker-module-if.js.map
