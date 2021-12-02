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
import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerModuleFilterModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework';
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';
let CheckerModuleFilterElement = class CheckerModuleFilterElement {
    constructor(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.keyValues = {};
        this.inputOptions = [];
        this.opened = true;
    }
    bind() {
        if (!Array.isArray(this.module.conditions)) {
            this.module.conditions = [];
        }
        if (this.module.conditionsOperator !== 'and' && this.module.conditionsOperator !== 'or') {
            this.module.conditionsOperator = 'and';
        }
    }
    addCondition() {
        this.module.conditions.push({
            key: '',
            operation: '=',
            value: ''
        });
        this.triggerChange();
    }
    removeCondition(index) {
        const i = parseInt(index, 10);
        this.module.conditions.splice(i, 1);
        this.triggerChange();
    }
    setConditionType(condition, operation) {
        condition.operation = operation;
        this.triggerChange();
    }
    keyHelperList(destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentValue = destinationObject[destinationKey];
            let options = [];
            for (const key in this.keyValues) {
                options.push(key);
            }
            const dialog = yield this.modalService.open({
                viewModel: PromptSelectDialog,
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
                destinationObject[destinationKey] = result.output;
            }
        });
    }
    valueHelperList(key, destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                return;
            const currentValue = destinationObject[destinationKey];
            let options = this.keyValues[key] || [];
            const dialog = yield this.modalService.open({
                viewModel: PromptSelectDialog,
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
                destinationObject[destinationKey] = result.output;
            }
        });
    }
    triggerChange() {
        const customEvent = DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    }
    toggle() {
        this.opened = !this.opened;
    }
};
__decorate([
    bindable,
    __metadata("design:type", CheckerModuleFilterModel)
], CheckerModuleFilterElement.prototype, "module", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], CheckerModuleFilterElement.prototype, "keyValues", void 0);
__decorate([
    bindable,
    __metadata("design:type", Array)
], CheckerModuleFilterElement.prototype, "inputOptions", void 0);
__decorate([
    bindable({ defaultBindingMode: bindingMode.twoWay }),
    __metadata("design:type", Object)
], CheckerModuleFilterElement.prototype, "opened", void 0);
CheckerModuleFilterElement = __decorate([
    customElement('checker-module-filter'),
    useView('./checker-module-filter.html'),
    inject(UxModalService, Element),
    __metadata("design:paramtypes", [UxModalService, HTMLElement])
], CheckerModuleFilterElement);
export { CheckerModuleFilterElement };

//# sourceMappingURL=checker-module-filter.js.map
