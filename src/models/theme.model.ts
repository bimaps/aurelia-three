import * as THREE from 'three';
import { ThreeSiteModel, ThreeStyleModel } from '../internal';
import { model, Model, type, validate } from 'aurelia-deco';
import { Logger, getLogger } from 'aurelia-logging';
import { ThreeStyleDefinition } from './../themes/three-style-definition';
import { ThreeTheme } from './../themes/three-theme';
import { ThreeThemeRule } from '../themes/three-theme-rule';

const log: Logger = getLogger('theme-model');

export class ThreeThemeModelRule extends ThreeThemeRule {
  styles: Array<string>;
}

@model('/three/theme')
export class ThreeThemeModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.string
  @validate.required
  public name: string;

  @type.array()
  public rules: Array<ThreeThemeModelRule> = [];

  @type.float
  public spaceHeight: number = 0; // 0 => real height from data

  public theme: ThreeTheme;

  updateTheme(styles: Array<ThreeStyleModel>, keepInstanceIfExists: boolean = true) {
    if (!this.theme || !keepInstanceIfExists) {
      log.debug('*** create theme instance');
      this.createThemeInstance();
    }
    let rules: Array<ThreeThemeRule> = [];
    for (let rule of this.rules) {
      let newRule = new ThreeThemeRule;
      newRule.name = rule.name;
      newRule.active = rule.active;
      newRule.context = rule.context;
      newRule.conditions = rule.conditions;
      newRule.definition = ThreeThemeModel.ruleDefinitionFromRuleStyles(rule, styles);
      newRule.exclusive = rule.exclusive;
      newRule.last = rule.last;
      newRule.applyToChildren = rule.applyToChildren;
      rules.push(newRule);
    }
    this.theme.rules = rules;
    this.theme.spaceHeight = this.spaceHeight;
  }

  private createThemeInstance() {
    let theme = new ThreeTheme();
    theme.name = this.name;
    theme.rules = [];
    this.theme = theme;
  }

  static ruleDefinitionFromRuleStyles(rule: ThreeThemeModelRule, styles: Array<ThreeStyleModel>): ThreeStyleDefinition {
    let definition = new ThreeStyleDefinition();
    let stylesById: {[key: string]: ThreeStyleModel} = {};
    for (let style of styles || []) {
      stylesById[style.id] = style;
    }
    for (let styleId of rule.styles || []) {
      let style = stylesById[styleId];
      if (!style) throw new Error('ruleDefinitionFromRuleStyles must be called with a complete styles array');
      definition.augment(ThreeThemeModel.ruleDefinitionFromRuleStyle(style));
    }
    return definition;
  }

  static ruleDefinitionFromRuleStyle(style: ThreeStyleModel): ThreeStyleDefinition {
    let definition = new ThreeStyleDefinition();
    definition.display = style.display;
    if ((style.material === 'basic' || style.material === 'phong') && style.color) {
      let opacity = Math.min(style.opacity, 1);
      opacity = Math.max(style.opacity, 0);
      let transparent = opacity < 1;
      if (style.material === 'basic') {
        definition.material = new THREE.MeshBasicMaterial({color: style.color, opacity: opacity, transparent: transparent})
      } else if (style.material === 'phong') {
        definition.material = new THREE.MeshPhongMaterial({color: style.color, opacity: opacity, transparent: transparent})
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
}
