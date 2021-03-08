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
exports.CheckerModuleOutputElement = void 0;
var checker_internals_1 = require("./../../models/checkers/checker-internals");
var aurelia_framework_1 = require("aurelia-framework");
var modal_1 = require("@aurelia-ux/modal");
var aurelia_pal_1 = require("aurelia-pal");
var CheckerModuleOutputElement = (function () {
    function CheckerModuleOutputElement(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.inputOptions = [];
        this.opened = true;
    }
    CheckerModuleOutputElement.prototype.addOutput = function () {
        this.module.outputs.push({
            prefix: '',
            varName: '',
            display: 'paragraph',
            suffix: ''
        });
        this.triggerChange();
    };
    CheckerModuleOutputElement.prototype.removeOutput = function (index) {
        var i = parseInt(index, 10);
        this.module.outputs.splice(i, 1);
        this.triggerChange();
    };
    CheckerModuleOutputElement.prototype.triggerChange = function () {
        var customEvent = aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    };
    CheckerModuleOutputElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", checker_internals_1.CheckerModuleOutputModel)
    ], CheckerModuleOutputElement.prototype, "module", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], CheckerModuleOutputElement.prototype, "inputOptions", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleOutputElement.prototype, "opened", void 0);
    CheckerModuleOutputElement = __decorate([
        aurelia_framework_1.customElement('checker-module-output'),
        aurelia_framework_1.useView('./checker-module-output.html'),
        aurelia_framework_1.inject(modal_1.UxModalService, Element),
        __metadata("design:paramtypes", [modal_1.UxModalService, HTMLElement])
    ], CheckerModuleOutputElement);
    return CheckerModuleOutputElement;
}());
exports.CheckerModuleOutputElement = CheckerModuleOutputElement;

//# sourceMappingURL=checker-module-output.js.map
