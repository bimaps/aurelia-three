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
var three_1 = require("./three");
var theme_model_1 = require("./../models/theme.model");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var aurelia_resources_1 = require("aurelia-resources");
var resolvePath = require("object-resolve-path");
var ThreeRuleEditor = (function () {
    function ThreeRuleEditor(element) {
        this.element = element;
        this.styles = [];
        this.log = aurelia_logging_1.getLogger('comp:three-theme-editor');
    }
    ThreeRuleEditor.prototype.addStyleToRule = function (styleId) {
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
        }
        this.rule.styles.push(styleId);
        this.notifyModification();
    };
    ThreeRuleEditor.prototype.addStyleToRule2 = function () {
        var _this = this;
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
        }
        var options = this.styles.filter(function (i) { return !_this.rule.styles.includes(i.id); }).map(function (i) { return { value: i.id, label: i.name }; });
        var dialog = aurelia_resources_1.arDialog({ title: 'Select a style to add', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                _this.rule.styles.push(result.value);
                _this.notifyModification();
            }
        });
    };
    ThreeRuleEditor.prototype.removeStyleFromRule = function (styleId) {
        if (!Array.isArray(this.rule.styles)) {
            this.rule.styles = [];
            return;
        }
        var index = this.rule.styles.indexOf(styleId);
        if (index !== -1)
            this.rule.styles.splice(index, 1);
        this.notifyModification();
    };
    ThreeRuleEditor.prototype.addConditionToRule = function (e) {
        if (!Array.isArray(this.rule.conditions)) {
            this.rule.conditions = [];
        }
        this.rule.conditions.push({ key: '', type: '=', value: '' });
        this.notifyModification();
    };
    ThreeRuleEditor.prototype.removeConditionFromRule = function (index) {
        if (!Array.isArray(this.rule.conditions)) {
            this.rule.conditions = [];
            return;
        }
        this.rule.conditions.splice(index, 1);
        this.notifyModification();
    };
    ThreeRuleEditor.prototype.setConditionType = function (condition, type) {
        condition.type = type;
        this.notifyModification();
    };
    ThreeRuleEditor.prototype.styleNameFromId = function (styleId) {
        for (var _i = 0, _a = this.styles; _i < _a.length; _i++) {
            var style = _a[_i];
            if (style.id === styleId)
                return style.name;
        }
        return '';
    };
    ThreeRuleEditor.prototype.notifyModification = function () {
        var event = aurelia_framework_1.DOM.createCustomEvent('rule-updated', { detail: this.rule, bubbles: true });
        this.element.dispatchEvent(event);
    };
    ThreeRuleEditor.prototype.conditionKeyHelpList = function (condition) {
        var _this = this;
        var options = [];
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
            var userDataKeys_2 = [];
            var userDataKeys2_1 = {};
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
                        for (var _a = 0, newKeys2_1 = newKeys2; _a < newKeys2_1.length; _a++) {
                            var key2 = newKeys2_1[_a];
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
            for (var _i = 0, userDataKeys_1 = userDataKeys_2; _i < userDataKeys_1.length; _i++) {
                var key = userDataKeys_1[_i];
                options.push({ value: "userData." + key, label: "userData." + key });
            }
            for (var key in userDataKeys2_1) {
                for (var _a = 0, _b = userDataKeys2_1[key]; _a < _b.length; _a++) {
                    var key2 = _b[_a];
                    options.push({ value: "userData." + key + "." + key2, label: "userData." + key + "." + key2 });
                }
            }
        }
        var dialog = aurelia_resources_1.arDialog({ title: 'Key List', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                condition.key = result.value;
                _this.notifyModification();
            }
        });
    };
    ThreeRuleEditor.prototype.conditionValueHelpList = function (condition) {
        var _this = this;
        var options = [];
        if (this.three && this.three instanceof three_1.ThreeCustomElement) {
            var values_2 = [];
            this.three.getScene().traverse(function (obj) {
                var value = resolvePath(obj, condition.key);
                if (values_2.indexOf(value) === -1) {
                    values_2.push(value);
                }
            });
            for (var _i = 0, values_1 = values_2; _i < values_1.length; _i++) {
                var value = values_1[_i];
                options.push({ value: "" + value, label: "" + value });
            }
        }
        var dialog = aurelia_resources_1.arDialog({ title: 'Value List', type: 'prompt', promptOptions: options });
        dialog.whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                condition.value = result.value;
                _this.notifyModification();
            }
        });
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
    return ThreeRuleEditor;
}());
exports.ThreeRuleEditor = ThreeRuleEditor;
var filterOutSelectedValueConverter = (function () {
    function filterOutSelectedValueConverter() {
    }
    filterOutSelectedValueConverter.prototype.toView = function (array, selected, length) {
        if (!selected)
            return array;
        return array.filter(function (item) {
            return !selected.includes(item.id);
        });
    };
    return filterOutSelectedValueConverter;
}());
exports.filterOutSelectedValueConverter = filterOutSelectedValueConverter;

//# sourceMappingURL=three-rule-editor.js.map
