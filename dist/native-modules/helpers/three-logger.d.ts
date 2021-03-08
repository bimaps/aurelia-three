import { ThreeCustomElement } from './../components/three';
import * as THREE from 'three';
export declare class ThreeLogger {
    private three;
    log: boolean;
    constructor(three: ThreeCustomElement);
    logPoints(points: THREE.Vector3 | THREE.Vector3[] | null, name: string, color: string, timeout?: number): void;
    logAxis(axis: THREE.Vector3 | null, name: string, color: string, timeout?: number): void;
    logPlane(plane: THREE.Plane | null, name: any, color: any, timeout?: number): void;
}
