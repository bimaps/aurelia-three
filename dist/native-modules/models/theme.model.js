var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreeStyleDefinition } from './../themes/three-style-definition';
import { ThreeTheme } from './../themes/three-theme';
import { ThreeThemeRule } from '../themes/three-theme-rule';
import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate } from 'aurelia-deco';
import * as THREE from 'three';
import { getLogger } from 'aurelia-logging';
var log = getLogger('theme-model');
var ThreeThemeModelRule = (function (_super) {
    __extends(ThreeThemeModelRule, _super);
    function ThreeThemeModelRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThreeThemeModelRule;
}(ThreeThemeRule));
export { ThreeThemeModelRule };
var ThreeThemeModel = (function (_super) {
    __extends(ThreeThemeModel, _super);
    function ThreeThemeModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rules = [];
        _this.spaceHeight = 0;
        return _this;
    }
    ThreeThemeModel_1 = ThreeThemeModel;
    ThreeThemeModel.prototype.updateTheme = function (styles, keepInstanceIfExists) {
        if (keepInstanceIfExists === void 0) { keepInstanceIfExists = true; }
        if (!this.theme || !keepInstanceIfExists) {
            log.debug('*** create theme instance');
            this.createThemeInstance();
        }
        var rules = [];
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            var newRule = new ThreeThemeRule;
            newRule.name = rule.name;
            newRule.active = rule.active;
            newRule.context = rule.context;
            newRule.conditions = rule.conditions;
            newRule.definition = ThreeThemeModel_1.ruleDefinitionFromRuleStyles(rule, styles);
            newRule.exclusive = rule.exclusive;
            newRule.last = rule.last;
            newRule.applyToChildren = rule.applyToChildren;
            rules.push(newRule);
        }
        this.theme.rules = rules;
        this.theme.spaceHeight = this.spaceHeight;
    };
    ThreeThemeModel.prototype.createThemeInstance = function () {
        var theme = new ThreeTheme();
        theme.name = this.name;
        theme.rules = [];
        this.theme = theme;
    };
    ThreeThemeModel.ruleDefinitionFromRuleStyles = function (rule, styles) {
        var definition = new ThreeStyleDefinition();
        var stylesById = {};
        for (var _i = 0, _a = styles || []; _i < _a.length; _i++) {
            var style = _a[_i];
            stylesById[style.id] = style;
        }
        for (var _b = 0, _c = rule.styles || []; _b < _c.length; _b++) {
            var styleId = _c[_b];
            var style = stylesById[styleId];
            if (!style)
                throw new Error('ruleDefinitionFromRuleStyles must be called with a complete styles array');
            definition.augment(ThreeThemeModel_1.ruleDefinitionFromRuleStyle(style));
        }
        return definition;
    };
    ThreeThemeModel.ruleDefinitionFromRuleStyle = function (style) {
        var definition = new ThreeStyleDefinition();
        definition.display = style.display;
        if ((style.material === 'basic' || style.material === 'phong') && style.color) {
            var opacity = Math.min(style.opacity, 1);
            opacity = Math.max(style.opacity, 0);
            var transparent = opacity < 1;
            if (style.material === 'basic') {
                definition.material = new THREE.MeshBasicMaterial({ color: style.color, opacity: opacity, transparent: transparent });
            }
            else if (style.material === 'phong') {
                definition.material = new THREE.MeshPhongMaterial({ color: style.color, opacity: opacity, transparent: transparent });
            }
        }
        definition.displayLabel = style.displayLabel;
        definition.labelKey = style.labelKey;
        definition.labelTemplate = style.labelTemplate;
        definition.labelBackgroundColor = style.labelBackgroundColor;
        definition.labelTextColor = style.labelTextColor;
        definition.labelScale = style.labelScale;
        definition.labelCentroidMethod = style.labelCentroidMethod;
        if (style.labelPosition) {
            var x = style.labelPosition.x || 0;
            var y = style.labelPosition.y || 0;
            var z = style.labelPosition.z || 0;
            definition.labelPosition = new THREE.Vector3(x, y, z);
        }
        definition.labelOpacity = style.opacity;
        definition.icon = style.icon;
        definition.iconKey = style.iconKey;
        definition.iconDefault = style.iconDefault;
        definition.iconBackground = style.iconBackground;
        definition.iconForeground = style.iconForeground;
        definition.iconScale = style.iconScale;
        definition.iconCentroidMethod = style.iconCentroidMethod;
        if (style.iconPosition) {
            var x = style.iconPosition.x || 0;
            var y = style.iconPosition.y || 0;
            var z = style.iconPosition.z || 0;
            definition.iconPosition = new THREE.Vector3(x, y, z);
        }
        definition.iconOpacity = style.opacity;
        definition.replaceGeometry = style.replaceGeometry;
        definition.geometryShape = style.geometryShape;
        definition.geometryScale = style.geometryScale;
        if (style.geometryPosition) {
            var x = style.geometryPosition.x || 0;
            var y = style.geometryPosition.y || 0;
            var z = style.geometryPosition.z || 0;
            definition.geometryPosition = new THREE.Vector3(x, y, z);
        }
        if (style.geometryRotation) {
            var x = style.geometryRotation.x || 0;
            var y = style.geometryRotation.y || 0;
            var z = style.geometryRotation.z || 0;
            definition.geometryRotation = new THREE.Vector3(x, y, z);
        }
        definition.edgesDisplay = style.edgesDisplay;
        return definition;
    };
    var ThreeThemeModel_1;
    __decorate([
        type.id,
        __metadata("design:type", String)
    ], ThreeThemeModel.prototype, "id", void 0);
    __decorate([
        type.model({ model: ThreeSiteModel }),
        validate.required,
        __metadata("design:type", String)
    ], ThreeThemeModel.prototype, "siteId", void 0);
    __decorate([
        type.string,
        validate.required,
        __metadata("design:type", String)
    ], ThreeThemeModel.prototype, "name", void 0);
    __decorate([
        type.array(),
        __metadata("design:type", Array)
    ], ThreeThemeModel.prototype, "rules", void 0);
    __decorate([
        type.float,
        __metadata("design:type", Number)
    ], ThreeThemeModel.prototype, "spaceHeight", void 0);
    ThreeThemeModel = ThreeThemeModel_1 = __decorate([
        model('/three/theme')
    ], ThreeThemeModel);
    return ThreeThemeModel;
}(Model));
export { ThreeThemeModel };

//# sourceMappingURL=theme.model.js.map
