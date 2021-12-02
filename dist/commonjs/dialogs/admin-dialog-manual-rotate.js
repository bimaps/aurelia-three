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
exports.AdminDialogManualRotate = void 0;
const aurelia_framework_1 = require("aurelia-framework");
let AdminDialogManualRotate = class AdminDialogManualRotate {
    constructor(element) {
        this.element = element;
        this.value = {
            constraint: 'X',
            angle: 0,
            unit: 'degree'
        };
    }
    bind() {
        this.valueChanged();
    }
    valueChanged() {
        if (typeof this.value !== 'object') {
            this.value = {
                constraint: 'X',
                angle: 0,
                unit: 'degree'
            };
        }
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Object)
], AdminDialogManualRotate.prototype, "value", void 0);
AdminDialogManualRotate = __decorate([
    aurelia_framework_1.inject(Element),
    __metadata("design:paramtypes", [Element])
], AdminDialogManualRotate);
exports.AdminDialogManualRotate = AdminDialogManualRotate;

//# sourceMappingURL=admin-dialog-manual-rotate.js.map
