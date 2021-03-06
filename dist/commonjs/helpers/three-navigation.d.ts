import { ThreeCustomElement } from '../components/three';
import * as THREE from 'three';
import { Subscription } from 'aurelia-event-aggregator';
export declare type NavigationOrientation = '3d' | 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';
export interface ThreeControls {
    autoRotate: boolean;
    autoRotateSpeed: number;
    dampingFactor: number;
    enableDamping: boolean;
    enableKeys: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    enableZoom: boolean;
    enabled: boolean;
    keyPanSpeed: number;
    maxAzimuthAngle: number;
    maxDistance: number;
    maxPolarAngle: number;
    maxZoom: number;
    minAzimuthAngle: number;
    minDistance: number;
    minPolarAngle: number;
    minZoom: number;
    panSpeed: number;
    rotateSpeed: number;
    screenSpacePanning: boolean;
    zoom0: number;
    zoomSpeed: number;
    target: THREE.Vector3;
    mouseButtons: {
        LEFT: number;
        MIDDLE: number;
        ORBIT: number;
        PAN: number;
        RIGHT: number;
    };
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
}
export declare class ThreeNavigation {
    private three;
    controls: ThreeControls;
    private log;
    constructor(three: ThreeCustomElement);
    initControls(): void;
    private zoomOnBboxObject;
    private tweenCamera;
    cameraIsAnimating: boolean;
    zoomOnBbox(bbox: THREE.Box3, orientation: NavigationOrientation, animate?: boolean, render?: boolean): void;
    zoom(target: 'scene' | 'currentBbox' | THREE.Object3D | THREE.Box3 | Array<THREE.Object3D>, factor: number | 'auto', orientation?: NavigationOrientation, animate?: boolean, render?: boolean): void;
    zoomOnObject(object: THREE.Object3D, factor?: number | 'auto', orientation?: NavigationOrientation, animate?: boolean, render?: boolean): void;
    zoomOnScene(factor: any, orientation?: NavigationOrientation, animate?: boolean, render?: boolean): void;
    get camera(): THREE.Camera;
    observationOn: boolean;
    observationViewer: HTMLElement;
    observationRenderer: THREE.WebGLRenderer;
    observationSubscription: Subscription;
    observationCamera: THREE.Camera;
    observationCameraFrustrumFactor: number;
    observationCameraZoom: number;
    startObservation(): void;
    endObservation(): void;
    toggleObservation(): void;
    showCameraHelper(): void;
    removeCameraHelper(): void;
}
