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
var ThreeAdminDialogLoadDataApi = (function () {
    function ThreeAdminDialogLoadDataApi(element) {
        this.element = element;
        this.value = {
            replaceLightsIfAny: true,
            emptySceneBeforeLoad: true,
            zoomOnScene: true
        };
    }
    ThreeAdminDialogLoadDataApi.prototype.bind = function () {
        this.valueChanged();
    };
    ThreeAdminDialogLoadDataApi.prototype.valueChanged = function () {
        if (typeof this.value !== 'object') {
            this.value = {
                replaceLightsIfAny: true,
                emptySceneBeforeLoad: true,
                zoomOnScene: true
            };
        }
    };
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], ThreeAdminDialogLoadDataApi.prototype, "value", void 0);
    ThreeAdminDialogLoadDataApi = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Element])
    ], ThreeAdminDialogLoadDataApi);
    return ThreeAdminDialogLoadDataApi;
}());
export { ThreeAdminDialogLoadDataApi };

//# sourceMappingURL=three-admin-dialog-load-data-api.js.map
