import { ThreeObjectPrepareFiltersOptions } from './object.model';
import { Model, Metadata } from 'aurelia-deco';
import * as THREE from 'three';
import * as GeoJSON from 'geojson';
export interface ThreeSiteModelAddJsonDataOptions {
    importId?: string;
    saveLights?: boolean;
    callbackWhenUploadDone?: (result: any) => void;
    ignoreWaitForCompletion?: boolean;
    reportId?: string;
    sendReportToEmail?: string;
}
export interface ThreeBuilding {
    id: string;
    name: string;
    siteId: string;
    importId: string;
    userData: {
        [key: string]: any;
    };
    metadata: Array<Metadata>;
}
export interface ThreeStorey {
    id: string;
    name: string;
    siteId: string;
    buildingId: string;
    importId: string;
    userData: {
        [key: string]: any;
    };
    metadata: Array<Metadata>;
}
export interface ThreeSpace {
    id: string;
    name: string;
    siteId: string;
    buildingId: string;
    storeyIds: string;
    importId: string;
    userData: {
        [key: string]: any;
    };
    boundary?: GeoJSON.Feature;
    metadata: Array<Metadata>;
}
export declare class ThreeSiteModel extends Model {
    id: string;
    name: string;
    center: THREE.Vector3;
    originalCameraPosition: THREE.Vector3;
    originalCameraZoom: number;
    originalCameraLookAt: THREE.Vector3;
    bcfProjectId?: string;
    buildings: Array<ThreeBuilding>;
    storeys: Array<ThreeStorey>;
    spaces: Array<ThreeSpace>;
    metadata: Array<Metadata>;
    business: string;
    authorizedBusinesses: Array<string>;
    static clearData(siteId: string, models?: Array<string>): Promise<any>;
    static clearImport(siteId: string, importId: string): Promise<any>;
    static downloadJsonData(json: any, filename?: string): void;
    static addJsonData(siteId: string, json: Blob | any, options?: ThreeSiteModelAddJsonDataOptions): Promise<any>;
    static addIFCData(siteId: string, ifcBlob: Blob, options?: ThreeSiteModelAddJsonDataOptions): Promise<boolean>;
    static waitForOperationCompleted(siteId: string, operationId: string): Promise<boolean>;
    static getSiteJson(siteId: string, filterObjectsOptions?: ThreeObjectPrepareFiltersOptions): Promise<any>;
    static getSiteData(siteId: string, filterObjectsOptions?: ThreeObjectPrepareFiltersOptions): Promise<any[]>;
}
