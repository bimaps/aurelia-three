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
var SidebarButtons = (function () {
    function SidebarButtons(element) {
        this.element = element;
        this.align = 'center';
        this.log = getLogger('comp:sidebar-buttons');
    }
    Object.defineProperty(SidebarButtons.prototype, "justify", {
        get: function () {
            if (this.align === 'center')
                return 'center';
            else if (this.align === 'left')
                return 'flex-start';
            else if (this.align === 'right')
                return 'flex-end';
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], SidebarButtons.prototype, "align", void 0);
    SidebarButtons = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Element])
    ], SidebarButtons);
    return SidebarButtons;
}());
export { SidebarButtons };

//# sourceMappingURL=sidebar-buttons.js.map
