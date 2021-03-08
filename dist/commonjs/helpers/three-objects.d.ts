import { ThreeCustomElement } from './../components/three';
import { StringAnyMap } from 'aurelia-resources';
import * as THREE from 'three';
export interface ParseLoadedDataOptions {
    render?: boolean;
    applyStyles?: boolean;
    calculateOffsetCenter?: 'never' | 'if-no-offset' | 'always';
    userData?: StringAnyMap;
}
export interface ParseLoadResult {
    empty: boolean;
    bbox: THREE.Box3 | null;
    object: THREE.Object3D | null;
}
export interface AddObjectOptions {
    userData?: StringAnyMap;
}
export declare class ThreeObjects {
    private jsonLoader;
    private mtlLoader;
    private objLoader;
    private colladaLoader;
    private gltfLoader;
    private log;
    private scene;
    private overlayScene;
    private toolsScene;
    private subscriptions;
    private offset;
    private bbox;
    private three;
    private showEdges;
    edgeMaterial: THREE.LineBasicMaterial;
    constructor(three: ThreeCustomElement);
    setShowEdges(show: boolean): void;
    subscribe(event: string, callback: any): void;
    clearScene(clearToolsScene?: boolean): void;
    loadJSON(json: any, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    loadFile(file: File, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    loadJSONFile(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    loadMTL(filename: string, preLoad?: boolean, addToObjLoader?: boolean): Promise<any>;
    loadOBJ(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    loadDae(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    loadGltf(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult>;
    parseLoadedData(object: THREE.Object3D, options?: ParseLoadedDataOptions): ParseLoadResult;
    addObject(object: THREE.Object3D, options?: AddObjectOptions): void;
    removeObject(object: any): void;
    counter: number;
    addEdgestoObject(object: any): void;
    removeEdgesObject(object: any): void;
    addAllEdges(): void;
    removeAllEdges(): void;
    get sceneWidth(): number;
    get sceneHeight(): number;
    get sceneDepth(): number;
    getBbox(): THREE.Box3;
    get rootObjects(): Array<THREE.Object3D>;
    get lights(): Array<THREE.Light>;
}
