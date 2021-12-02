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
import * as THREE from 'three';
import { ThreeSiteModel } from '../internal';
import { model, Model, type, validate } from 'aurelia-deco';
import { getLogger } from 'aurelia-logging';
import { ThreeStyleDefinition } from './../themes/three-style-definition';
import { ThreeTheme } from './../themes/three-theme';
import { ThreeThemeRule } from '../themes/three-theme-rule';
const log = getLogger('theme-model');
export class ThreeThemeModelRule extends ThreeThemeRule {
}
let ThreeThemeModel = ThreeThemeModel_1 = class ThreeThemeModel extends Model {
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
            let newRule = new ThreeThemeRule;
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
        let theme = new ThreeTheme();
        theme.name = this.name;
        theme.rules = [];
        this.theme = theme;
    }
    static ruleDefinitionFromRuleStyles(rule, styles) {
        let definition = new ThreeStyleDefinition();
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
        let definition = new ThreeStyleDefinition();
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
export { ThreeThemeModel };

//# sourceMappingURL=theme.model.js.map
