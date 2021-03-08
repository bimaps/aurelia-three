import * as THREE from 'three';
export declare class ThreeObjectPropertyList {
    private element;
    private log;
    object: THREE.Object3D | THREE.Material | THREE.Camera;
    editable: boolean;
    private orthoCameraInterval;
    constructor(element: Element);
    objectChanged(): void;
    get properties(): Array<string>;
    get userData(): Array<string>;
    editString(prop: any): boolean;
    edit3d(prop: any): boolean;
    edit4d(prop: any): boolean;
    editNumber(prop: any): boolean;
    editBoolean(prop: any): boolean;
    hidePropDueToEdit(prop: any): boolean;
    propClick(prop: string): boolean;
}
export declare class ThreePropertyValueConverter {
    toView(value: any, key?: string): string;
}
