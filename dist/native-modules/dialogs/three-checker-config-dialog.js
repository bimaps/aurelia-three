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
import { ThreeCustomElement } from './../components/three';
import { ThreeCheckerConfigModel } from './../models/checker-config.model';
import { UxModalService } from '@aurelia-ux/modal';
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { PromptSelectDialog } from 'aurelia-resources';
import * as resolvePath from 'object-resolve-path';
var log = getLogger('category-dialog');
var ThreeCheckerConfigDialog = (function () {
    function ThreeCheckerConfigDialog(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
    }
    ThreeCheckerConfigDialog.prototype.activate = function (params) {
        if (params.siteId) {
            this.siteId = params.siteId;
        }
        if (params.three && params.three instanceof ThreeCustomElement) {
            this.three = params.three;
        }
        if (params.checker && params.checker instanceof ThreeCheckerConfigModel) {
            this.checker = params.checker;
            this.siteId = this.checker.siteId;
            this.mode = 'edit';
        }
        else {
            this.checker = new ThreeCheckerConfigModel();
            this.checker.siteId = this.siteId;
            this.mode = 'create';
        }
    };
    ThreeCheckerConfigDialog.prototype.canDeactivate = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm_1, confirmResult, validationResult, _i, _a, result_1, category, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (result.wasCancelled) {
                            return [2, true];
                        }
                        if (!(result.output === 'remove')) return [3, 3];
                        return [4, this.modalService.open({
                                viewModel: ConfirmDialog,
                                model: { title: 'Are you sure ?', text: "Remove the checker " + this.checker.name + " ?" }
                            })];
                    case 1:
                        confirm_1 = _b.sent();
                        return [4, confirm_1.whenClosed()];
                    case 2:
                        confirmResult = _b.sent();
                        if (!confirmResult.wasCancelled) {
                            this.remove();
                        }
                        return [2];
                    case 3: return [4, this.checker.validationController.validate()];
                    case 4:
                        validationResult = _b.sent();
                        if (!validationResult.valid) {
                            for (_i = 0, _a = validationResult.results; _i < _a.length; _i++) {
                                result_1 = _a[_i];
                                if (!result_1.valid) {
                                    errorify(new Error(result_1.message));
                                }
                            }
                            return [2, false];
                        }
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4, this.save()];
                    case 6:
                        category = _b.sent();
                        result.output = category;
                        return [3, 8];
                    case 7:
                        error_1 = _b.sent();
                        errorify(error_1);
                        return [2, false];
                    case 8: return [2];
                }
            });
        });
    };
    ThreeCheckerConfigDialog.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode === 'create')) return [3, 2];
                        return [4, this.checker.save()];
                    case 1:
                        checker = _a.sent();
                        return [3, 4];
                    case 2: return [4, this.checker.updateProperties('', Object.keys(this.checker))];
                    case 3:
                        checker = _a.sent();
                        _a.label = 4;
                    case 4: return [2, checker];
                }
            });
        });
    };
    ThreeCheckerConfigDialog.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode === 'edit')) return [3, 2];
                        return [4, this.checker.remove()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    ThreeCheckerConfigDialog.prototype.addCondition = function () {
        this.checker.conditions.push({
            key: '',
            operator: '=',
            value: ''
        });
    };
    ThreeCheckerConfigDialog.prototype.removeCondition = function (index) {
        var i = parseInt(index, 10);
        this.checker.conditions.splice(i, 1);
    };
    ThreeCheckerConfigDialog.prototype.setConditionType = function (condition, operator) {
        condition.operator = operator;
    };
    ThreeCheckerConfigDialog.prototype.keyHelperList = function (destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function () {
            var currentValue, options, userDataKeys_2, userDataKeys2_1, _i, userDataKeys_1, key, key, _a, _b, key2, dialog, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        currentValue = destinationObject[destinationKey];
                        options = [];
                        options.push({ value: 'uuid', label: 'uuid' });
                        options.push({ value: 'name', label: 'name' });
                        options.push({ value: 'type', label: 'type' });
                        options.push({ value: 'parent.uuid', label: 'parent.uuid' });
                        options.push({ value: 'parent.type', label: 'parent.type' });
                        options.push({ value: 'parent.name', label: 'parent.name' });
                        options.push({ value: 'position.x', label: 'position.x' });
                        options.push({ value: 'position.y', label: 'position.y' });
                        options.push({ value: 'position.z', label: 'position.z' });
                        options.push({ value: 'visible', label: 'visible' });
                        options.push({ value: 'geometry.uuid', label: 'geometry.uuid' });
                        options.push({ value: 'geometry.type', label: 'geometry.type' });
                        options.push({ value: 'geometry.name', label: 'geometry.name' });
                        options.push({ value: 'material.uuid', label: 'material.uuid' });
                        options.push({ value: 'material.type', label: 'material.type' });
                        options.push({ value: 'material.name', label: 'material.name' });
                        options.push({ value: '__clicked', label: '__clicked' });
                        if (this.three && this.three instanceof ThreeCustomElement) {
                            userDataKeys_2 = [];
                            userDataKeys2_1 = {};
                            this.three.getScene().traverse(function (obj) {
                                var newKeys = Object.keys(obj.userData).filter(function (i) { return !userDataKeys_2.includes(i); });
                                var keysToAdd = [];
                                var _loop_1 = function (key) {
                                    var value = obj.userData[key];
                                    if (typeof value === 'string' || typeof value === 'number') {
                                        keysToAdd.push(key);
                                    }
                                    if (typeof value === 'object' && !Array.isArray(value) && value !== undefined) {
                                        if (!userDataKeys2_1[key]) {
                                            userDataKeys2_1[key] = [];
                                        }
                                        var newKeys2 = Object.keys(obj.userData[key]).filter(function (i) { return !userDataKeys2_1[key].includes(i); });
                                        for (var _i = 0, newKeys2_1 = newKeys2; _i < newKeys2_1.length; _i++) {
                                            var key2 = newKeys2_1[_i];
                                            var value2 = obj.userData[key][key2];
                                            if (typeof value2 === 'string' || typeof value2 === 'number') {
                                                userDataKeys2_1[key].push(key2);
                                            }
                                        }
                                    }
                                };
                                for (var _i = 0, newKeys_1 = newKeys; _i < newKeys_1.length; _i++) {
                                    var key = newKeys_1[_i];
                                    _loop_1(key);
                                }
                                userDataKeys_2.push.apply(userDataKeys_2, keysToAdd);
                            });
                            for (_i = 0, userDataKeys_1 = userDataKeys_2; _i < userDataKeys_1.length; _i++) {
                                key = userDataKeys_1[_i];
                                options.push({ value: "userData." + key, label: "userData." + key });
                            }
                            for (key in userDataKeys2_1) {
                                for (_a = 0, _b = userDataKeys2_1[key]; _a < _b.length; _a++) {
                                    key2 = _b[_a];
                                    options.push({ value: "userData." + key + "." + key2, label: "userData." + key + "." + key2 });
                                }
                            }
                        }
                        return [4, this.modalService.open({
                                viewModel: PromptSelectDialog,
                                model: {
                                    options: options,
                                    autoClose: true,
                                    required: false,
                                    mode: 'single',
                                    labelKey: 'label',
                                    valueKey: 'value',
                                    value: currentValue
                                }
                            })];
                    case 1:
                        dialog = _c.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _c.sent();
                        if (!result.wasCancelled && result.output) {
                            destinationObject[destinationKey] = result.output;
                        }
                        return [2];
                }
            });
        });
    };
    ThreeCheckerConfigDialog.prototype.valueHelperList = function (key, destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function () {
            var currentValue, options, values_2, _i, values_1, value, dialog, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!key)
                            return [2];
                        currentValue = destinationObject[destinationKey];
                        options = [];
                        if (this.three && this.three instanceof ThreeCustomElement) {
                            values_2 = [];
                            this.three.getScene().traverse(function (obj) {
                                var value = resolvePath(obj, key);
                                if (values_2.indexOf(value) === -1) {
                                    values_2.push(value);
                                }
                            });
                            for (_i = 0, values_1 = values_2; _i < values_1.length; _i++) {
                                value = values_1[_i];
                                options.push({ value: "" + value, label: "" + value });
                            }
                        }
                        return [4, this.modalService.open({
                                viewModel: PromptSelectDialog,
                                model: {
                                    options: options,
                                    autoClose: true,
                                    required: false,
                                    mode: 'single',
                                    labelKey: 'label',
                                    valueKey: 'value',
                                    value: currentValue
                                }
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled && result.output) {
                            destinationObject[destinationKey] = result.output;
                        }
                        return [2];
                }
            });
        });
    };
    ThreeCheckerConfigDialog.prototype.expressionBuilder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, dialog, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = [
                            { label: 'Average', value: 'average' },
                            { label: 'Percent', value: 'percent' },
                        ];
                        return [4, this.modalService.open({
                                viewModel: PromptSelectDialog,
                                model: {
                                    options: options,
                                    autoClose: true,
                                    required: false,
                                    mode: 'single',
                                    labelKey: 'label',
                                    valueKey: 'value',
                                    value: ''
                                }
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled && result.output) {
                            if (result.output === 'average') {
                                this.checker.operationSettings.expression = "value / nbItems";
                            }
                            else if (result.output === 'percent') {
                                this.checker.operationSettings.expression = "value * 0.5";
                            }
                        }
                        return [2];
                }
            });
        });
    };
    ThreeCheckerConfigDialog = __decorate([
        inject(UxModalService),
        __metadata("design:paramtypes", [UxModalService])
    ], ThreeCheckerConfigDialog);
    return ThreeCheckerConfigDialog;
}());
export { ThreeCheckerConfigDialog };

//# sourceMappingURL=three-checker-config-dialog.js.map
