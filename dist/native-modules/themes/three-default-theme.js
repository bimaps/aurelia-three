import { ThreeThemeRule } from "./three-theme-rule";
import { ThreeStyleDefinition } from "./three-style-definition";
import { ThreeTheme } from "./three-theme";
import * as THREE from 'three';
let rule1 = new ThreeThemeRule();
rule1.conditions = [{
        key: 'userData.id',
        type: '!=',
        value: '5def55920a65a95c22084e87'
    }];
rule1.definition = new ThreeStyleDefinition();
rule1.definition.display = true;
rule1.definition.material = new THREE.MeshBasicMaterial({ color: 'blue', opacity: 0.5, transparent: true });
rule1.applyToChildren = false;
let theme = new ThreeTheme();
theme.name = 'default';
theme.rules = [
    rule1
];
export default theme;

//# sourceMappingURL=three-default-theme.js.map
