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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerModuleExtractElement = void 0;
const aurelia_resources_1 = require("aurelia-resources");
const checker_internals_1 = require("./../../models/checkers/checker-internals");
const aurelia_framework_1 = require("aurelia-framework");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_pal_1 = require("aurelia-pal");
let CheckerModuleExtractElement = class CheckerModuleExtractElement {
    constructor(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.keyValues = {};
        this.inputOptions = [];
        this.opened = true;
        this.extractOptions = checker_internals_1.CheckerExtractTypeOptions.map(v => { return { value: v, label: v }; });
    }
    bind() {
        if (!this.module.extractType) {
            this.module.extractType = 'property';
        }
    }
    keyHelperList(destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentValue = destinationObject[destinationKey];
            let options = [];
            for (const key in this.keyValues) {
                options.push(key);
            }
            const dialog = yield this.modalService.open({
                viewModel: aurelia_resources_1.PromptSelectDialog,
                model: {
                    options: options,
                    autoClose: true,
                    required: false,
                    mode: 'single',
                    value: currentValue
                }
            });
            const result = yield dialog.whenClosed();
            if (!result.wasCancelled && result.output) {
                const keyValue = `#{${result.output}}`;
                let dest = destinationObject[destinationKey].trim();
                destinationObject[destinationKey] = dest
                    ? `${dest} / ${keyValue}`
                    : keyValue;
            }
        });
    }
    triggerChange() {
        const customEvent = aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    }
    toggle() {
        this.opened = !this.opened;
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", checker_internals_1.CheckerModuleExtractModel)
], CheckerModuleExtractElement.prototype, "module", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Object)
], CheckerModuleExtractElement.prototype, "keyValues", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Array)
], CheckerModuleExtractElement.prototype, "inputOptions", void 0);
__decorate([
    aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
    __metadata("design:type", Object)
], CheckerModuleExtractElement.prototype, "opened", void 0);
CheckerModuleExtractElement = __decorate([
    aurelia_framework_1.customElement('checker-module-extract'),
    aurelia_framework_1.useView('./checker-module-extract.html'),
    aurelia_framework_1.inject(modal_1.UxModalService, Element),
    __metadata("design:paramtypes", [modal_1.UxModalService, HTMLElement])
], CheckerModuleExtractElement);
exports.CheckerModuleExtractElement = CheckerModuleExtractElement;

//# sourceMappingURL=checker-module-extract.js.map
