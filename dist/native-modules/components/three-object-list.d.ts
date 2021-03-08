import * as THREE from 'three';
export declare class ThreeObjectList {
    private element;
    private log;
    objects: Array<THREE.Object3D>;
    q: string;
    limit: number;
    private showAll;
    constructor(element: Element);
    toggleObject(object: THREE.Object3D, event: any): void;
    toggleVisible(object: THREE.Object3D, event: any): void;
    selectObject(object: THREE.Object3D, event: any): void;
    isCamera(object: THREE.Object3D): boolean;
    isLight(object: THREE.Object3D): boolean;
    isGroup(object: THREE.Object3D): boolean;
    isMesh(object: THREE.Object3D): boolean;
    isGeometry(object: THREE.Object3D): boolean;
    isPointClouds(object: THREE.Object3D): boolean;
    isObject(object: THREE.Object3D): boolean;
}
export declare class FilterObjectListValueConverter {
    toView(list: Array<THREE.Object3D>, q: string, limit?: number, showAll?: boolean): Array<THREE.Object3D>;
}
