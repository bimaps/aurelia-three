import { TaskQueue } from 'aurelia-framework';
declare type PropertiesCallback = (object: THREE.Object3D) => Array<string>;
export declare class ThreeObjectPropertyExplorer {
    private taskQueue;
    object: THREE.Object3D;
    properties: Array<string> | PropertiesCallback;
    private ready;
    private props;
    constructor(taskQueue: TaskQueue);
    bind(): void;
    objectChanged(): void;
    propertiesChanged(): void;
    value(prop: string): string | number;
    label(prop: string): string;
}
export {};
