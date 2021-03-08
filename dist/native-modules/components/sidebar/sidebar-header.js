var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, bindable } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
var SidebarHeader = (function () {
    function SidebarHeader(element) {
        this.element = element;
        this.log = getLogger('comp:sidebar-header');
    }
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], SidebarHeader.prototype, "prev", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Boolean)
    ], SidebarHeader.prototype, "back", void 0);
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], SidebarHeader.prototype, "icon", void 0);
    SidebarHeader = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Element])
    ], SidebarHeader);
    return SidebarHeader;
}());
export { SidebarHeader };

//# sourceMappingURL=sidebar-header.js.map
