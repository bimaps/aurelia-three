import { ThreePoints } from './../helpers/three-points';
import { ThreeObjects } from '../helpers/three-objects';
import { ThreeNavigation } from '../helpers/three-navigation';
import * as THREE from 'three';
export interface CursorRawProcessingData {
    mouse: THREE.Vector2;
    camera: THREE.Camera;
    type: 'up' | 'down' | 'move';
}
export interface PlanesIntersects {
    xy: THREE.Vector3 | null;
    xz: THREE.Vector3 | null;
    yz: THREE.Vector3 | null;
}
export interface CursorPlanesIntersects {
    type: 'down' | 'move' | 'up';
    intersects: PlanesIntersects;
    mouse: THREE.Vector2;
}
export declare type IntersectionWithEvent = THREE.Intersection & {
    event: MouseEvent;
};
export declare class ThreeCustomElement {
    private element;
    private log;
    private sceneElement;
    private scene;
    private pointsScene;
    private overlayScene;
    private toolsScene;
    private renderer;
    private camera;
    private cameraFrustrumFactor;
    cameraZoom: number;
    private animating;
    navigation: ThreeNavigation;
    private handleResize;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    private handleMouseLeave;
    private subscriptions;
    objects: ThreeObjects;
    points: ThreePoints;
    constructor(element: HTMLElement);
    attached(): void;
    detached(): void;
    subscribe(event: string, callback: any): void;
    publish(event: string, data?: any): void;
    init(): void;
    initScene(): void;
    private addDomEvents;
    private removeDomEvents;
    previousMousePosition: THREE.Vector2 | null;
    private processCursor;
    initCamera(): void;
    cameraFrustrumFactorChanged(): void;
    cameraZoomChanged(): void;
    initLight(): void;
    addAxis(sceneType?: 'main' | 'overlay' | 'tools'): void;
    removeAxis(sceneType?: 'main' | 'overlay' | 'tools'): void;
    addCube(sceneType?: 'main' | 'overlay' | 'tools'): void;
    removeCube(sceneType?: 'main' | 'overlay' | 'tools'): void;
    rotateCube(sceneType?: 'main' | 'overlay' | 'tools'): void;
    startAnimate(): void;
    stopAnimating(): void;
    private animate;
    requestRendering(): void;
    private render;
    scaleBbox(originalBbox: THREE.Box3, factor: number): THREE.Box3;
    autoExtendBbox(bbox: THREE.Box3): THREE.Box3;
    bboxFromObject(object: THREE.Object3D): THREE.Box3;
    isBbox000(bbox: THREE.Box3): boolean;
    centroidFromBbox(bbox: THREE.Box3): THREE.Vector3;
    getCamera(): THREE.Camera;
    getScene(sceneType?: 'main' | 'points' | 'overlay' | 'tools'): THREE.Scene;
    getSceneElement(): HTMLElement;
    getRenderer(): THREE.Renderer;
    getSnapshot(type: 'png' | 'jpg'): string;
}
export declare class MainScene extends THREE.Scene {
    private three;
    constructor(three: ThreeCustomElement);
    setThree(three: ThreeCustomElement): void;
    add(...object: THREE.Object3D[]): this;
    remove(...object: THREE.Object3D[]): this;
}
