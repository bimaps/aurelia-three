import { ThreeCustomElement } from '../components/three';
import { ThreeThemeRule } from './three-theme-rule';
export declare class ThreeTheme {
    name: string;
    rules: Array<ThreeThemeRule>;
    spaceHeight: number;
    active: boolean;
    three: ThreeCustomElement;
    activate(three: ThreeCustomElement): void;
    deactivate(): void;
    onActivate(): void;
    onDeactivate(): void;
}
