import { TaskQueue } from 'aurelia-framework';
import * as THREE from 'three';
declare type PropertiesCallback = (object: THREE.Object3D) => Array<string>;
export declare class ThreeObjectPropertyExplorer {
    private taskQueue;
    object: THREE.Object3D;
    properties: Array<string> | PropertiesCallback;
    canEdit: boolean;
    private instance;
    private editDocuments;
    private ready;
    private props;
    constructor(taskQueue: TaskQueue);
    bind(): void;
    objectChanged(): void;
    getDocuments(): Promise<void>;
    documentsUpdated(): void;
    propertiesChanged(): void;
    value(prop: string): string | number;
    label(prop: string): string;
    downloadDocument(document: any): Promise<void>;
}
export {};
