"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_theme_rule_1 = require("./three-theme-rule");
var three_style_definition_1 = require("./three-style-definition");
var three_theme_1 = require("./three-theme");
var THREE = require("three");
var rule1 = new three_theme_rule_1.ThreeThemeRule();
rule1.conditions = [{
        key: 'userData.id',
        type: '!=',
        value: '5def55920a65a95c22084e87'
    }];
rule1.definition = new three_style_definition_1.ThreeStyleDefinition();
rule1.definition.display = true;
rule1.definition.material = new THREE.MeshBasicMaterial({ color: 'red' });
rule1.applyToChildren = false;
var theme = new three_theme_1.ThreeTheme();
theme.name = 'default';
theme.rules = [
    rule1
];
exports.default = theme;

//# sourceMappingURL=three-alt-theme.js.map
