import { Model, GetAllOptions } from 'aurelia-deco';
import * as THREE from 'three';
export declare class ThreeMaterialModel extends Model {
    id: string;
    siteId: string;
    importId: string;
    formatVersion: string;
    uuid: string;
    name: string;
    type: string;
    color: THREE.Color;
    ambient: THREE.Color;
    emissive: THREE.Color;
    specular: THREE.Color;
    shininess: number;
    roughness: any;
    metalness: any;
    opacity: number;
    transparent: boolean;
    side: any;
    children: any;
    depthFunc: THREE.DepthModes;
    depthTest: boolean;
    depthWrite: boolean;
    userData: {
        [key: string]: any;
    };
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions): Promise<Array<InstanceType<T>>>;
}
