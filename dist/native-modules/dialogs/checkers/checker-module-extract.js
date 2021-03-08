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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerModuleExtractModel, CheckerExtractTypeOptions } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework';
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';
var CheckerModuleExtractElement = (function () {
    function CheckerModuleExtractElement(modalService, element) {
        this.modalService = modalService;
        this.element = element;
        this.keyValues = {};
        this.inputOptions = [];
        this.opened = true;
        this.extractOptions = CheckerExtractTypeOptions.map(function (v) { return { value: v, label: v }; });
    }
    CheckerModuleExtractElement.prototype.bind = function () {
        if (!this.module.extractType) {
            this.module.extractType = 'property';
        }
    };
    CheckerModuleExtractElement.prototype.keyHelperList = function (destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function () {
            var currentValue, options, key, dialog, result, keyValue, dest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentValue = destinationObject[destinationKey];
                        options = [];
                        for (key in this.keyValues) {
                            options.push(key);
                        }
                        return [4, this.modalService.open({
                                viewModel: PromptSelectDialog,
                                model: {
                                    options: options,
                                    autoClose: true,
                                    required: false,
                                    mode: 'single',
                                    value: currentValue
                                }
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled && result.output) {
                            keyValue = "#{" + result.output + "}";
                            dest = destinationObject[destinationKey].trim();
                            destinationObject[destinationKey] = dest
                                ? dest + " / " + keyValue
                                : keyValue;
                        }
                        return [2];
                }
            });
        });
    };
    CheckerModuleExtractElement.prototype.triggerChange = function () {
        var customEvent = DOM.createCustomEvent('change', { bubbles: true });
        this.element.dispatchEvent(customEvent);
    };
    CheckerModuleExtractElement.prototype.toggle = function () {
        this.opened = !this.opened;
    };
    __decorate([
        bindable,
        __metadata("design:type", CheckerModuleExtractModel)
    ], CheckerModuleExtractElement.prototype, "module", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], CheckerModuleExtractElement.prototype, "keyValues", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Array)
    ], CheckerModuleExtractElement.prototype, "inputOptions", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], CheckerModuleExtractElement.prototype, "opened", void 0);
    CheckerModuleExtractElement = __decorate([
        customElement('checker-module-extract'),
        useView('./checker-module-extract.html'),
        inject(UxModalService, Element),
        __metadata("design:paramtypes", [UxModalService, HTMLElement])
    ], CheckerModuleExtractElement);
    return CheckerModuleExtractElement;
}());
export { CheckerModuleExtractElement };

//# sourceMappingURL=checker-module-extract.js.map
