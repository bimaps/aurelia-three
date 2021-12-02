"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_theme_rule_1 = require("./three-theme-rule");
const three_style_definition_1 = require("./three-style-definition");
const three_theme_1 = require("./three-theme");
const THREE = require("three");
let rule1 = new three_theme_rule_1.ThreeThemeRule();
rule1.conditions = [{
        key: 'userData.id',
        type: '!=',
        value: '5def55920a65a95c22084e87'
    }];
rule1.definition = new three_style_definition_1.ThreeStyleDefinition();
rule1.definition.display = true;
rule1.definition.material = new THREE.MeshBasicMaterial({ color: 'blue', opacity: 0.5, transparent: true });
rule1.applyToChildren = false;
let theme = new three_theme_1.ThreeTheme();
theme.name = 'default';
theme.rules = [
    rule1
];
exports.default = theme;

//# sourceMappingURL=three-default-theme.js.map
