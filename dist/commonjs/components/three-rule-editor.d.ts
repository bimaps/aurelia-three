import { ThreeThemeRuleCondition } from './../themes/three-theme-rule';
import { ThreeStyleModel } from '../models/style.model';
export declare class ThreeRuleEditor {
    private element;
    private log;
    private rule;
    private styles;
    private three;
    constructor(element: Element);
    addStyleToRule(styleId: string): void;
    addStyleToRule2(): void;
    removeStyleFromRule(styleId: string): void;
    addConditionToRule(e: any): void;
    removeConditionFromRule(index: number): void;
    setConditionType(condition: ThreeThemeRuleCondition, type: '<' | '>' | '=' | '!='): void;
    styleNameFromId(styleId: any): string;
    notifyModification(): void;
    conditionKeyHelpList(condition: ThreeThemeRuleCondition): void;
    conditionValueHelpList(condition: ThreeThemeRuleCondition): void;
}
export declare class filterOutSelectedValueConverter {
    toView(array: Array<ThreeStyleModel>, selected: Array<string>, length: number): Array<ThreeStyleModel>;
}
