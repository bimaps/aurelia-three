"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeThemeRule = void 0;
var three_style_definition_1 = require("./three-style-definition");
var ThreeThemeRule = (function () {
    function ThreeThemeRule() {
        this.active = true;
        this.context = [];
        this.conditions = [];
        this.definition = new three_style_definition_1.ThreeStyleDefinition();
        this.priority = 0;
        this.exclusive = false;
        this.last = false;
        this.applyToChildren = true;
    }
    return ThreeThemeRule;
}());
exports.ThreeThemeRule = ThreeThemeRule;

//# sourceMappingURL=three-theme-rule.js.map
