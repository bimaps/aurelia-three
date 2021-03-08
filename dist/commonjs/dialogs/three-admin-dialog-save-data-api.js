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
exports.ThreeAdminDialogSaveDataApi = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var ThreeAdminDialogSaveDataApi = (function () {
    function ThreeAdminDialogSaveDataApi(element) {
        this.element = element;
        this.value = {
            saveLights: false,
            clearApiDataBeforeSaving: false,
            importId: ''
        };
    }
    ThreeAdminDialogSaveDataApi.prototype.bind = function () {
        this.valueChanged();
    };
    ThreeAdminDialogSaveDataApi.prototype.valueChanged = function () {
        if (typeof this.value !== 'object') {
            this.value = {
                saveLights: false,
                clearApiDataBeforeSaving: false,
                importId: ''
            };
        }
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ThreeAdminDialogSaveDataApi.prototype, "value", void 0);
    ThreeAdminDialogSaveDataApi = __decorate([
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Element])
    ], ThreeAdminDialogSaveDataApi);
    return ThreeAdminDialogSaveDataApi;
}());
exports.ThreeAdminDialogSaveDataApi = ThreeAdminDialogSaveDataApi;

//# sourceMappingURL=three-admin-dialog-save-data-api.js.map
