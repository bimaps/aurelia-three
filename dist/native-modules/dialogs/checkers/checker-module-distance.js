var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CheckerModuleDistanceModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework';
import { UxModalService } from '@aurelia-ux/modal';
var CheckerModuleDistanceElement = (function () {
    function CheckerModuleDistanceElement(modalService) {
        this.modalService = modalService;
        this.inputOptions = [];
        this.opened = true;
    }
    CheckerModuleDistanceElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        bindable,
        __metadata("design:type", CheckerModuleDistanceModel)
    ], CheckerModuleDistanceElement.prototype, "module", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Array)
    ], CheckerModuleDistanceElement.prototype, "inputOptions", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleDistanceElement.prototype, "opened", void 0);
    CheckerModuleDistanceElement = __decorate([
        customElement('checker-module-distance'),
        useView('./checker-module-distance.html'),
        inject(UxModalService),
        __metadata("design:paramtypes", [UxModalService])
    ], CheckerModuleDistanceElement);
    return CheckerModuleDistanceElement;
}());
export { CheckerModuleDistanceElement };

//# sourceMappingURL=checker-module-distance.js.map
