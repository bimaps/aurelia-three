import { ThreeStyleDefinition } from "./three-style-definition";
var ThreeThemeRule = (function () {
    function ThreeThemeRule() {
        this.active = true;
        this.context = [];
        this.conditions = [];
        this.definition = new ThreeStyleDefinition();
        this.priority = 0;
        this.exclusive = false;
        this.last = false;
        this.applyToChildren = true;
    }
    return ThreeThemeRule;
}());
export { ThreeThemeRule };

//# sourceMappingURL=three-theme-rule.js.map
