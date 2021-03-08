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
exports.CheckerModuleMathElement = void 0;
var aurelia_pal_1 = require("aurelia-pal");
var checker_internals_1 = require("./../../models/checkers/checker-internals");
var aurelia_framework_1 = require("aurelia-framework");
var modal_1 = require("@aurelia-ux/modal");
var CheckerModuleMathElement = (function () {
    function CheckerModuleMathElement(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.inputOptions = [];
        this.opened = true;
    }
    CheckerModuleMathElement.prototype.triggerChange = function () {
        var customEvent = aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    };
    CheckerModuleMathElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", checker_internals_1.CheckerModuleMathModel)
    ], CheckerModuleMathElement.prototype, "module", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], CheckerModuleMathElement.prototype, "inputOptions", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleMathElement.prototype, "opened", void 0);
    CheckerModuleMathElement = __decorate([
        aurelia_framework_1.customElement('checker-module-math'),
        aurelia_framework_1.useView('./checker-module-math.html'),
        aurelia_framework_1.inject(modal_1.UxModalService, Element),
        __metadata("design:paramtypes", [modal_1.UxModalService, HTMLElement])
    ], CheckerModuleMathElement);
    return CheckerModuleMathElement;
}());
exports.CheckerModuleMathElement = CheckerModuleMathElement;

//# sourceMappingURL=checker-module-math.js.map
