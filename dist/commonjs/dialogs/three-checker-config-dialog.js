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
exports.ThreeCheckerConfigDialog = void 0;
const three_1 = require("./../components/three");
const checker_config_model_1 = require("./../models/checker-config.model");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_resources_1 = require("aurelia-resources");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const aurelia_resources_2 = require("aurelia-resources");
const resolvePath = require("object-resolve-path");
const log = aurelia_logging_1.getLogger('category-dialog');
let ThreeCheckerConfigDialog = class ThreeCheckerConfigDialog {
    constructor(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
    }
    activate(params) {
        if (params.siteId) {
            this.siteId = params.siteId;
        }
        if (params.three && params.three instanceof three_1.ThreeCustomElement) {
            this.three = params.three;
        }
        if (params.checker && params.checker instanceof checker_config_model_1.ThreeCheckerConfigModel) {
            this.checker = params.checker;
            this.siteId = this.checker.siteId;
            this.mode = 'edit';
        }
        else {
            this.checker = new checker_config_model_1.ThreeCheckerConfigModel();
            this.checker.siteId = this.siteId;
            this.mode = 'create';
        }
    }
    canDeactivate(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.wasCancelled) {
                return true;
            }
            if (result.output === 'remove') {
                const confirm = yield this.modalService.open({
                    viewModel: aurelia_resources_1.ConfirmDialog,
                    model: { title: 'Are you sure ?', text: `Remove the checker ${this.checker.name} ?` }
                });
                const confirmResult = yield confirm.whenClosed();
                if (!confirmResult.wasCancelled) {
                    this.remove();
                }
                return;
            }
            const validationResult = yield this.checker.validationController.validate();
            if (!validationResult.valid) {
                for (let result of validationResult.results) {
                    if (!result.valid) {
                        aurelia_resources_1.errorify(new Error(result.message));
                    }
                }
                return false;
            }
            try {
                const category = yield this.save();
                result.output = category;
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                return false;
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let checker;
            if (this.mode === 'create') {
                checker = yield this.checker.save();
            }
            else {
                checker = yield this.checker.updateProperties('', Object.keys(this.checker));
            }
            return checker;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode === 'edit') {
                yield this.checker.remove();
            }
        });
    }
    addCondition() {
        this.checker.conditions.push({
            key: '',
            operator: '=',
            value: ''
        });
    }
    removeCondition(index) {
        const i = parseInt(index, 10);
        this.checker.conditions.splice(i, 1);
    }
    setConditionType(condition, operator) {
        condition.operator = operator;
    }
    keyHelperList(destinationObject, destinationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentValue = destinationObject[destinationKey];
            let options = [];
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
            if (this.three && this.three instanceof three_1.ThreeCustomElement) {
                let userDataKeys = [];
                let userDataKeys2 = {};
                this.three.getScene().traverse((obj) => {
                    let newKeys = Object.keys(obj.userData).filter(i => !userDataKeys.includes(i));
                    let keysToAdd = [];
                    for (let key of newKeys) {
                        const value = obj.userData[key];
                        if (typeof value === 'string' || typeof value === 'number') {
                            keysToAdd.push(key);
                        }
                        if (typeof value === 'object' && !Array.isArray(value) && value !== undefined) {
                            if (!userDataKeys2[key]) {
                                userDataKeys2[key] = [];
                            }
                            let newKeys2 = Object.keys(obj.userData[key]).filter(i => !userDataKeys2[key].includes(i));
                            for (let key2 of newKeys2) {
                                const value2 = obj.userData[key][key2];
                                if (typeof value2 === 'string' || typeof value2 === 'number') {
                                    userDataKeys2[key].push(key2);
                                }
                            }
                        }
                    }
                    userDataKeys.push(...keysToAdd);
                });
                for (let key of userDataKeys) {
                    options.push({ value: `userData.${key}`, label: `userData.${key}` });
                }
                for (let key in userDataKeys2) {
                    for (let key2 of userDataKeys2[key]) {
                        options.push({ value: `userData.${key}.${key2}`, label: `userData.${key}.${key2}` });
                    }
                }
            }
            const dialog = yield this.modalService.open({
                viewModel: aurelia_resources_2.PromptSelectDialog,
                model: {
                    options: options,
                    autoClose: true,
                    required: false,
                    mode: 'single',
                    labelKey: 'label',
                    valueKey: 'value',
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
            let options = [];
            if (this.three && this.three instanceof three_1.ThreeCustomElement) {
                let values = [];
                this.three.getScene().traverse((obj) => {
                    let value = resolvePath(obj, key);
                    if (values.indexOf(value) === -1) {
                        values.push(value);
                    }
                });
                for (let value of values) {
                    options.push({ value: `${value}`, label: `${value}` });
                }
            }
            const dialog = yield this.modalService.open({
                viewModel: aurelia_resources_2.PromptSelectDialog,
                model: {
                    options: options,
                    autoClose: true,
                    required: false,
                    mode: 'single',
                    labelKey: 'label',
                    valueKey: 'value',
                    value: currentValue
                }
            });
            const result = yield dialog.whenClosed();
            if (!result.wasCancelled && result.output) {
                destinationObject[destinationKey] = result.output;
            }
        });
    }
    expressionBuilder() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = [
                { label: 'Average', value: 'average' },
                { label: 'Percent', value: 'percent' },
            ];
            const dialog = yield this.modalService.open({
                viewModel: aurelia_resources_2.PromptSelectDialog,
                model: {
                    options: options,
                    autoClose: true,
                    required: false,
                    mode: 'single',
                    labelKey: 'label',
                    valueKey: 'value',
                    value: ''
                }
            });
            const result = yield dialog.whenClosed();
            if (!result.wasCancelled && result.output) {
                if (result.output === 'average') {
                    this.checker.operationSettings.expression = `value / nbItems`;
                }
                else if (result.output === 'percent') {
                    this.checker.operationSettings.expression = `value * 0.5`;
                }
            }
        });
    }
};
ThreeCheckerConfigDialog = __decorate([
    aurelia_framework_1.inject(modal_1.UxModalService),
    __metadata("design:paramtypes", [modal_1.UxModalService])
], ThreeCheckerConfigDialog);
exports.ThreeCheckerConfigDialog = ThreeCheckerConfigDialog;

//# sourceMappingURL=three-checker-config-dialog.js.map
