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
let SidebarSectionHeader = class SidebarSectionHeader {
    constructor(element) {
        this.element = element;
        this.opened = false;
        this.log = getLogger('comp:sidebar-section-header');
    }
    toggle() {
        this.opened = !this.opened;
    }
};
__decorate([
    bindable,
    __metadata("design:type", Boolean)
], SidebarSectionHeader.prototype, "opened", void 0);
SidebarSectionHeader = __decorate([
    inject(Element),
    __metadata("design:paramtypes", [Element])
], SidebarSectionHeader);
export { SidebarSectionHeader };

//# sourceMappingURL=sidebar-section-header.js.map
