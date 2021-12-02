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
exports.CheckerModuleNormalDistanceElement = void 0;
const checker_internals_1 = require("./../../models/checkers/checker-internals");
const aurelia_framework_1 = require("aurelia-framework");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_pal_1 = require("aurelia-pal");
let CheckerModuleNormalDistanceElement = class CheckerModuleNormalDistanceElement {
    constructor(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.inputOptions = [];
        this.opened = true;
    }
    triggerChange() {
        const customEvent = aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    }
    toggle() {
        this.opened = !this.opened;
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", checker_internals_1.CheckerModuleNormalDistanceModel)
], CheckerModuleNormalDistanceElement.prototype, "module", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Array)
], CheckerModuleNormalDistanceElement.prototype, "inputOptions", void 0);
__decorate([
    aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
    __metadata("design:type", Object)
], CheckerModuleNormalDistanceElement.prototype, "opened", void 0);
CheckerModuleNormalDistanceElement = __decorate([
    aurelia_framework_1.customElement('checker-module-normal-distance'),
    aurelia_framework_1.useView('./checker-module-normal-distance.html'),
    aurelia_framework_1.inject(modal_1.UxModalService, Element),
    __metadata("design:paramtypes", [modal_1.UxModalService, HTMLElement])
], CheckerModuleNormalDistanceElement);
exports.CheckerModuleNormalDistanceElement = CheckerModuleNormalDistanceElement;

//# sourceMappingURL=checker-module-normal-distance.js.map
