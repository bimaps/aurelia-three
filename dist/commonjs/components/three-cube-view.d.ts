import * as THREE from 'three';
import { ThreeCustomElement } from './three';
export declare class ThreeCubeView {
    three: ThreeCustomElement;
    private controls;
    host: HTMLElement;
    private observing;
    bind(): void;
    startObserving(): void;
    stopObserving(): void;
    private update;
    threeChanged(): void;
    handleEvent(event: MouseEvent): void;
    home(): void;
}
export interface OrientationControlsOptions {
    perspective?: boolean;
}
export declare class CubeView {
    private camera;
    private size;
    private options?;
    element: HTMLElement;
    private matrix;
    private unit;
    private half;
    private box;
    private ring;
    private directions;
    constructor(camera: THREE.Camera, size: number, options?: OrientationControlsOptions);
    private direction;
    private plane;
    update(): void;
    private epsilon;
    private getObjectCSSMatrix;
}
