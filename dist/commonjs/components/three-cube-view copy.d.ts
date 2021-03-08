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
}
export interface OrientationControlsOptions {
    perspective?: boolean;
}
