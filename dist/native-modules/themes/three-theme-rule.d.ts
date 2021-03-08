import { ThreeStyleDefinition } from "./three-style-definition";
export interface ThreeThemeRuleCondition {
    key: string;
    type: '=' | '<' | '>' | '!=' | '*';
    value: string | number | Date;
}
export declare class ThreeThemeRule {
    name: string;
    active: boolean;
    context: Array<string>;
    conditions: Array<ThreeThemeRuleCondition>;
    definition: ThreeStyleDefinition;
    priority: number;
    exclusive: boolean;
    last: boolean;
    applyToChildren: boolean;
}
