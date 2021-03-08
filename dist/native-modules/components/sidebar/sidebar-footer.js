var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
var SidebarFooter = (function () {
    function SidebarFooter(element) {
        this.element = element;
        this.log = getLogger('comp:sidebar-footer');
    }
    SidebarFooter = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Element])
    ], SidebarFooter);
    return SidebarFooter;
}());
export { SidebarFooter };

//# sourceMappingURL=sidebar-footer.js.map
