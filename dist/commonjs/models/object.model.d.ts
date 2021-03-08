import { Model, GetAllOptions } from 'aurelia-deco';
import * as THREE from 'three';
import { StringTMap } from 'aurelia-resources';
export declare class ThreeObjectModel extends Model {
    id: string;
    siteId: string;
    buildingId: string;
    storeys: Array<string>;
    spaceId: string;
    importId: string;
    formatVersion: string;
    uuid: string;
    name: string;
    type: string;
    matrix: Array<number>;
    material: string | Array<string>;
    geometry: string | Array<string>;
    userData: {
        [key: string]: any;
    };
    children: Array<any>;
    childrenIds: Array<string>;
    parentId: string;
    _min: THREE.Vector3;
    _max: THREE.Vector3;
    static prepareFilters(options: ThreeObjectPrepareFiltersOptions): string;
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions, flat?: boolean): Promise<Array<InstanceType<T>>>;
    static addChildren(object: ThreeObjectModel, hObjects: StringTMap<ThreeObjectModel>): void;
    static fromThreeObject(object: THREE.Object3D): ThreeObjectModel;
}
export interface ThreeObjectPrepareFiltersOptions {
    insideBbox?: THREE.Box3;
    touchBbox?: THREE.Box3;
    uuid?: string | Array<string>;
    name?: string | Array<string>;
    geometry?: string | Array<string>;
    material?: string | Array<string>;
    parentId?: string | Array<string>;
    type?: string | Array<string>;
    userData?: {
        [key: string]: any;
    };
    globalFilters?: Array<string>;
}
