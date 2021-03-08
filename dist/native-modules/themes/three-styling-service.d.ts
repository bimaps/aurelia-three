import { ThreeCustomElement } from '../components/three';
import * as THREE from 'three';
import { ThreeTheme } from './three-theme';
export declare class ThreeStylingService {
    private atv?;
    private three;
    private currentTheme;
    private log;
    constructor(three: ThreeCustomElement, atv?: any);
    registerSubscribers(): void;
    get currentThemeName(): string;
    activate(theme: ThreeTheme): void;
    clearTheme(): void;
    applyCurrentTheme(context?: Array<string>, options?: ApplyThemeOptions): void;
    removeRelatedObjects(obj: THREE.Object3D): void;
    applyTheme(objects: Array<THREE.Object3D> | THREE.Object3D, theme: ThreeTheme, context?: Array<string>, options?: ApplyThemeOptions): void;
    private preparePathKey;
    private compareRuleWithObject;
    private makeNumerIfPossible;
    private fixKeyWithOriginal;
    private resetDefinition;
    private applyDefinition;
    private addObjectLabel;
    private removeObjectLabel;
    private addLabel;
    private addObjectIcon;
    private addIcon;
    private removeObjectIcon;
    private replaceObjectGeometry;
    private setOriginalObjectValues;
    private unsetOriginalObjectValues;
}
export interface ApplyThemeOptions {
}
export declare class StylingObject extends THREE.Object3D {
    __originalSaved?: boolean;
    __originalMaterial?: THREE.Material | THREE.Material[];
    __originalGeometry?: THREE.Geometry | THREE.BufferGeometry;
    __originalVisible?: boolean;
    __originalOpacity?: number;
    __originalPosition?: THREE.Vector3;
    __originalRotation?: THREE.Euler;
}
export interface AddIconOptions {
    strokeColor?: string;
    backgroundColor?: string;
    text?: string;
}
