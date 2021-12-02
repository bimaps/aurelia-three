"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeThemeRule = void 0;
const three_style_definition_1 = require("./three-style-definition");
class ThreeThemeRule {
    constructor() {
        this.active = true;
        this.context = [];
        this.conditions = [];
        this.definition = new three_style_definition_1.ThreeStyleDefinition();
        this.priority = 0;
        this.exclusive = false;
        this.last = false;
        this.applyToChildren = true;
    }
}
exports.ThreeThemeRule = ThreeThemeRule;

//# sourceMappingURL=three-theme-rule.js.map
