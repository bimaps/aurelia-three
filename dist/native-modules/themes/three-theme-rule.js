import { ThreeStyleDefinition } from "./three-style-definition";
export class ThreeThemeRule {
    constructor() {
        this.active = true;
        this.context = [];
        this.conditions = [];
        this.definition = new ThreeStyleDefinition();
        this.priority = 0;
        this.exclusive = false;
        this.last = false;
        this.applyToChildren = true;
    }
}

//# sourceMappingURL=three-theme-rule.js.map
