var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, computedFrom } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
var SidebarContent = (function () {
    function SidebarContent(element) {
        this.element = element;
        this.parentElement = document.createElement('div');
        this.headerElement = document.createElement('div');
        this.footerElement = document.createElement('div');
        this.log = getLogger('comp:sidebar-content');
    }
    SidebarContent.prototype.attached = function () {
        this.parentElement = this.element.parentElement;
        var header = this.element.parentElement.querySelector('.sidebar-header');
        if (header instanceof HTMLElement) {
            this.headerElement = header;
        }
        var footer = this.element.parentElement.querySelector('.sidebar-footer');
        if (footer instanceof HTMLElement) {
            this.footerElement = footer;
        }
    };
    Object.defineProperty(SidebarContent.prototype, "height", {
        get: function () {
            return this.parentElement.offsetHeight - this.headerElement.offsetHeight - this.footerElement.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        computedFrom('parentElement', 'headerElement', 'footerElement', 'parentElement.offsetHeight', 'headerElement.offsetHeight', 'footerElement.offsetHeight'),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], SidebarContent.prototype, "height", null);
    SidebarContent = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Element])
    ], SidebarContent);
    return SidebarContent;
}());
export { SidebarContent };

//# sourceMappingURL=sidebar-content.js.map
