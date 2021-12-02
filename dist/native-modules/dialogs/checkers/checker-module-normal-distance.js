var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CheckerModuleNormalDistanceModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework';
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';
let CheckerModuleNormalDistanceElement = class CheckerModuleNormalDistanceElement {
    constructor(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.inputOptions = [];
        this.opened = true;
    }
    triggerChange() {
        const customEvent = DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    }
    toggle() {
        this.opened = !this.opened;
    }
};
__decorate([
    bindable,
    __metadata("design:type", CheckerModuleNormalDistanceModel)
], CheckerModuleNormalDistanceElement.prototype, "module", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckerModuleNormalDistanceElement.prototype, "inputOptions", void 0);
__decorate([
    bindable({ defaultBindingMode: bindingMode.twoWay }),
    __metadata("design:type", Object)
], CheckerModuleNormalDistanceElement.prototype, "opened", void 0);
CheckerModuleNormalDistanceElement = __decorate([
    customElement('checker-module-normal-distance'),
    useView('./checker-module-normal-distance.html'),
    inject(UxModalService, Element),
    __metadata("design:paramtypes", [UxModalService, HTMLElement])
], CheckerModuleNormalDistanceElement);
export { CheckerModuleNormalDistanceElement };

//# sourceMappingURL=checker-module-normal-distance.js.map
