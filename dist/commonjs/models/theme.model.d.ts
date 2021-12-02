import { ThreeStyleModel } from '../internal';
import { Model } from 'aurelia-deco';
import { ThreeStyleDefinition } from './../themes/three-style-definition';
import { ThreeTheme } from './../themes/three-theme';
import { ThreeThemeRule } from '../themes/three-theme-rule';
export declare class ThreeThemeModelRule extends ThreeThemeRule {
    styles: Array<string>;
}
export declare class ThreeThemeModel extends Model {
    id: string;
    siteId: string;
    name: string;
    rules: Array<ThreeThemeModelRule>;
    spaceHeight: number;
    theme: ThreeTheme;
    updateTheme(styles: Array<ThreeStyleModel>, keepInstanceIfExists?: boolean): void;
    private createThemeInstance;
    static ruleDefinitionFromRuleStyles(rule: ThreeThemeModelRule, styles: Array<ThreeStyleModel>): ThreeStyleDefinition;
    static ruleDefinitionFromRuleStyle(style: ThreeStyleModel): ThreeStyleDefinition;
}
