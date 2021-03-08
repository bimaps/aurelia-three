import { ThreeCustomElement } from '../components/three';
import { ThreeThemeRule } from './three-theme-rule';

export class ThreeTheme {
  name: string;
  rules: Array<ThreeThemeRule> = [];
  spaceHeight: number;
  active: boolean;
  three: ThreeCustomElement;

  activate(three: ThreeCustomElement) {
    this.three = three;
    this.active = true;
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
    this.active = false;
  }

  onActivate() {

  }

  onDeactivate() {

  }
}
