import { ThreeStyleDefinition } from "./three-style-definition";

export interface ThreeThemeRuleCondition {
  key: string; // use "uuid" to target main "uuid" property and "userData.prop" to target a "prop" key in "userData"
  type: '=' | '<' | '>' | '!=' | '*';
  value: string | number | Date;
}

export class ThreeThemeRule {
  name: string;
  active: boolean = true; // if false, the rule is temporarilly inactive
  context: Array<string> = []; // if a rule has any string context, this context must be given to the applyTheme() method for this rule to be applied
  conditions: Array<ThreeThemeRuleCondition> = [];
  definition: ThreeStyleDefinition = new ThreeStyleDefinition();
  priority: number = 0; // the higher the priority, the more "chance" for this definition to be the final one
  exclusive: boolean = false; // if the rule is set as exclusive, then it replaces all previous rule
  last: boolean = false; // if last, then no other rule can be applied after this one
  applyToChildren: boolean = true;
}
