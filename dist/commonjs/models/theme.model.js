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
var ThreeThemeModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeThemeModel = exports.ThreeThemeModelRule = void 0;
const three_style_definition_1 = require("./../themes/three-style-definition");
const three_theme_1 = require("./../themes/three-theme");
const three_theme_rule_1 = require("../themes/three-theme-rule");
const site_model_1 = require("./site.model");
const aurelia_deco_1 = require("aurelia-deco");
const THREE = require("three");
const aurelia_logging_1 = require("aurelia-logging");
const log = aurelia_logging_1.getLogger('theme-model');
class ThreeThemeModelRule extends three_theme_rule_1.ThreeThemeRule {
}
exports.ThreeThemeModelRule = ThreeThemeModelRule;
let ThreeThemeModel = ThreeThemeModel_1 = class ThreeThemeModel extends aurelia_deco_1.Model {
    constructor() {
        super(...arguments);
        this.rules = [];
        this.spaceHeight = 0;
    }
    updateTheme(styles, keepInstanceIfExists = true) {
        if (!this.theme || !keepInstanceIfExists) {
            log.debug('*** create theme instance');
            this.createThemeInstance();
        }
        let rules = [];
        for (let rule of this.rules) {
            let newRule = new three_theme_rule_1.ThreeThemeRule;
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
    }
    createThemeInstance() {
        let theme = new three_theme_1.ThreeTheme();
        theme.name = this.name;
        theme.rules = [];
        this.theme = theme;
    }
    static ruleDefinitionFromRuleStyles(rule, styles) {
        let definition = new three_style_definition_1.ThreeStyleDefinition();
        let stylesById = {};
        for (let style of styles || []) {
            stylesById[style.id] = style;
        }
        for (let styleId of rule.styles || []) {
            let style = stylesById[styleId];
            if (!style)
                throw new Error('ruleDefinitionFromRuleStyles must be called with a complete styles array');
            definition.augment(ThreeThemeModel_1.ruleDefinitionFromRuleStyle(style));
        }
        return definition;
    }
    static ruleDefinitionFromRuleStyle(style) {
        let definition = new three_style_definition_1.ThreeStyleDefinition();
        definition.display = style.display;
        if ((style.material === 'basic' || style.material === 'phong') && style.color) {
            let opacity = Math.min(style.opacity, 1);
            opacity = Math.max(style.opacity, 0);
            let transparent = opacity < 1;
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
            let x = style.labelPosition.x || 0;
            let y = style.labelPosition.y || 0;
            let z = style.labelPosition.z || 0;
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
            let x = style.iconPosition.x || 0;
            let y = style.iconPosition.y || 0;
            let z = style.iconPosition.z || 0;
            definition.iconPosition = new THREE.Vector3(x, y, z);
        }
        definition.iconOpacity = style.opacity;
        definition.replaceGeometry = style.replaceGeometry;
        definition.geometryShape = style.geometryShape;
        definition.geometryScale = style.geometryScale;
        if (style.geometryPosition) {
            let x = style.geometryPosition.x || 0;
            let y = style.geometryPosition.y || 0;
            let z = style.geometryPosition.z || 0;
            definition.geometryPosition = new THREE.Vector3(x, y, z);
        }
        if (style.geometryRotation) {
            let x = style.geometryRotation.x || 0;
            let y = style.geometryRotation.y || 0;
            let z = style.geometryRotation.z || 0;
            definition.geometryRotation = new THREE.Vector3(x, y, z);
        }
        definition.edgesDisplay = style.edgesDisplay;
        return definition;
    }
};
__decorate([
    aurelia_deco_1.type.id,
    __metadata("design:type", String)
], ThreeThemeModel.prototype, "id", void 0);
__decorate([
    aurelia_deco_1.type.model({ model: site_model_1.ThreeSiteModel }),
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], ThreeThemeModel.prototype, "siteId", void 0);
__decorate([
    aurelia_deco_1.type.string,
    aurelia_deco_1.validate.required,
    __metadata("design:type", String)
], ThreeThemeModel.prototype, "name", void 0);
__decorate([
    aurelia_deco_1.type.array(),
    __metadata("design:type", Array)
], ThreeThemeModel.prototype, "rules", void 0);
__decorate([
    aurelia_deco_1.type.float,
    __metadata("design:type", Number)
], ThreeThemeModel.prototype, "spaceHeight", void 0);
ThreeThemeModel = ThreeThemeModel_1 = __decorate([
    aurelia_deco_1.model('/three/theme')
], ThreeThemeModel);
exports.ThreeThemeModel = ThreeThemeModel;

//# sourceMappingURL=theme.model.js.map
