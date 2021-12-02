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
exports.filterOutSelectedValueConverter = exports.ThreeRuleEditor = void 0;
const three_1 = require("./three");
const theme_model_1 = require("./../models/theme.model");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const aurelia_resources_1 = require("aurelia-resources");
const resolvePath = require("object-resolve-path");
let ThreeRuleEditor = class ThreeRuleEditor {
    constructor(element) {
        this.element = element;
        this.styles = [];
        this.log = aurelia_logging_1.getLogger('comp:three-theme-editor');
    }
    addStyleToRule(styleId) {
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
        }
        this.rule.styles.push(styleId);
        this.notifyModification();
    }
    addStyleToRule2() {
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
        }
        let options = this.styles.filter(i => !this.rule.styles.includes(i.id)).map(i => { return { value: i.id, label: i.name }; });
        let dialog = aurelia_resources_1.arDialog({ title: 'Select a style to add', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                this.rule.styles.push(result.value);
                this.notifyModification();
            }
        });
    }
    removeStyleFromRule(styleId) {
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
            return;
        }
        let index = this.rule.styles.indexOf(styleId);
        if (index !== -1)
            this.rule.styles.splice(index, 1);
        this.notifyModification();
    }
    addConditionToRule(e) {
        if (!Array.isArray(this.rule.conditions)) {
            this.rule.conditions = [];
        }
        this.rule.conditions.push({ key: '', type: '=', value: '' });
        this.notifyModification();
    }
    removeConditionFromRule(index) {
        if (!Array.isArray(this.rule.conditions)) {
            this.rule.conditions = [];
            return;
        }
        this.rule.conditions.splice(index, 1);
        this.notifyModification();
    }
    setConditionType(condition, type) {
        condition.type = type;
        this.notifyModification();
    }
    styleNameFromId(styleId) {
        for (let style of this.styles) {
            if (style.id === styleId)
                return style.name;
        }
        return '';
    }
    notifyModification() {
        let event = aurelia_framework_1.DOM.createCustomEvent('rule-updated', { detail: this.rule, bubbles: true });
        this.element.dispatchEvent(event);
    }
    conditionKeyHelpList(condition) {
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
        let dialog = aurelia_resources_1.arDialog({ title: 'Key List', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                condition.key = result.value;
                this.notifyModification();
            }
        });
    }
    conditionValueHelpList(condition) {
        let options = [];
        if (this.three && this.three instanceof three_1.ThreeCustomElement) {
            let values = [];
            this.three.getScene().traverse((obj) => {
                let value = resolvePath(obj, condition.key);
                if (values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            for (let value of values) {
                options.push({ value: `${value}`, label: `${value}` });
            }
        }
        let dialog = aurelia_resources_1.arDialog({ title: 'Value List', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                condition.value = result.value;
                this.notifyModification();
            }
        });
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", theme_model_1.ThreeThemeModelRule)
], ThreeRuleEditor.prototype, "rule", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Array)
], ThreeRuleEditor.prototype, "styles", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", three_1.ThreeCustomElement)
], ThreeRuleEditor.prototype, "three", void 0);
ThreeRuleEditor = __decorate([
    aurelia_framework_1.inject(Element),
    __metadata("design:paramtypes", [Element])
], ThreeRuleEditor);
exports.ThreeRuleEditor = ThreeRuleEditor;
class filterOutSelectedValueConverter {
    toView(array, selected, length) {
        if (!selected)
            return array;
        return array.filter((item) => {
            return !selected.includes(item.id);
        });
    }
}
exports.filterOutSelectedValueConverter = filterOutSelectedValueConverter;

//# sourceMappingURL=three-rule-editor.js.map
