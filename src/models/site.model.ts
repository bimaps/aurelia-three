import { model, Model, type, jsonify, Metadata } from 'aurelia-deco';
import * as THREE from 'three';
import { Logger, getLogger } from 'aurelia-logging';
import * as GeoJSON from 'geojson';
import { ThreeMaterialModel, ThreeGeometryModel, ThreeObjectModel, ThreeObjectPrepareFiltersOptions } from '../internal';
const log: Logger = getLogger('three-site-model');

export interface ThreeSiteModelAddJsonDataOptions {
  importId?: string;
  saveLights?: boolean;
  callbackWhenUploadDone?: (result: any) => void;
  ignoreWaitForCompletion?: boolean;
  reportId?: string;
  sendReportToEmail?: string;
};

export interface ThreeBuilding {
  id: string;
  name: string;
  siteId: string;
  importId: string;
  userData: {[key: string]: any};
  metadata: Array<Metadata>;
}

export interface ThreeStorey {
  id: string;
  name: string;
  siteId: string;
  buildingId: string;
  importId: string;
  userData: {[key: string]: any};
  metadata: Array<Metadata>;
}

export interface ThreeSpace {
  id: string;
  name: string;
  siteId: string;
  buildingId: string;
  storeyIds: string;
  importId: string;
  userData: {[key: string]: any};
  boundary?: GeoJSON.Feature;
  metadata: Array<Metadata>;
}

@model('/three/site')
export class ThreeSiteModel extends Model {

  @type.id
  public id: string;

  @type.string
  public name: string;

  @type.any
  public center: THREE.Vector3;

  @type.any
  public originalCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  @type.float
  public originalCameraZoom: number = 10;
  
  @type.any
  public originalCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  @type.id
  public bcfProjectId?: string;

  @type.array({type: 'any'})
  public buildings: Array<ThreeBuilding> = [];

  @type.array({type: 'any'})
  public storeys: Array<ThreeStorey> = [];

  @type.array({type: 'any'})
  public spaces: Array<ThreeSpace> = [];

  @type.metadata
  public metadata: Array<Metadata>;
  
  @type.string
  public business: string;
  
  @type.array({type: 'string'})
  public authorizedBusinesses: Array<string> = [];

  static clearData(siteId: string, models: Array<string> = [
    'material',
    'geometry',
    'object',
    'building',
    'storey',
    'space',
    'theme',
    'style',
    'report',
    'checker-flow',
    'checker-modules']) {
    return ThreeSiteModel.api.delete(`/three/site/${siteId}/delete-data`, {models: models}).then(jsonify);
  }

  static clearImport(siteId: string, importId: string) {
    return ThreeSiteModel.api.delete(`/three/site/${siteId}/delete-import`, importId).then(jsonify);
  }

  static downloadJsonData(json: any, filename: string = 'scene.json') {
    let jsonString = JSON.stringify(json);
    let blob = new Blob([jsonString], {type: 'octet/stream'});
    let url = URL.createObjectURL(blob);
    location.href = url;
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  static addJsonData(siteId: string, json: Blob | any, options?: ThreeSiteModelAddJsonDataOptions) {
    let blob: Blob;
    if (json instanceof Blob) {
      blob = json;
    } else {
      let jsonString = JSON.stringify(json);
      blob = new Blob([jsonString], {type: 'octet/stream'});
    }
    let formData = new FormData;
    formData.append('json', blob);
    let url = `/three/site/${siteId}/import/json?`;
    if (options && options.importId) url += `&importId=${options.importId}`;
    if (options && options.saveLights) url += `&saveLights=1`;
    return ThreeSiteModel.api.post(url, formData, {bodyFormat: 'FormData'}).then(jsonify);
  }

  static async addIFCData(siteId: string, ifcBlob: Blob, options?: ThreeSiteModelAddJsonDataOptions): Promise<boolean> {
    let blob = ifcBlob;
    let formData = new FormData;
    formData.append('ifc', blob);
    let url = `/three/site/${siteId}/import/ifc?`;
    if (options && options.importId) url += `&importId=${options.importId}`;
    if (options && options.saveLights) url += `&saveLights=1`;
    if (options && options.reportId) url += `&reportId=${options.reportId}`;
    if (options && options.sendReportToEmail) url += `&email=${options.sendReportToEmail}`
    const result = await ThreeSiteModel.api.post(url, formData, {bodyFormat: 'FormData'}).then(jsonify);
    if (options && options.callbackWhenUploadDone) {
      options.callbackWhenUploadDone.call(null, result);
    }
    if (options && options.ignoreWaitForCompletion) {
      return true;
    }
    if (result?.status === 'in-progress') {
      return await ThreeSiteModel.waitForOperationCompleted(siteId, result.id);
    }
  }

  static async waitForOperationCompleted(siteId: string, operationId: string): Promise<boolean> {
    const result = await ThreeSiteModel.api.get(`/three/site/${siteId}/import/ifc/${operationId}`).then(jsonify);
    if (result.status === 'completed') {
      return true;
    }
    if (result.status === 'in-progress' || result.message === 'Failed to fetch') {
      return ThreeSiteModel.waitForOperationCompleted(siteId, operationId);
    }
    throw new Error(result.message);
  }

  static getSiteJson(siteId: string, filterObjectsOptions?: ThreeObjectPrepareFiltersOptions): Promise<any> {
    return ThreeSiteModel.getSiteData(siteId, filterObjectsOptions).then((values) => {
      let loadInfos: any = {};
      if (values[0] && values[0][0] && values[0][0].get) loadInfos = values[0][0].get('_loadInfos');
      let json = {
        metadata: {
          version: 4.5,
          type: 'Object',
          generator: 'swissdata',
          loadInfos: loadInfos
        },
        geometries: values[1],
        materials: values[2],
        object: {
          children: values[0].length === 0 ? [] : values[0].map((obj) => {
            if (obj.children === null) delete obj.children;
            return obj
          }),
          layers: 1,
          matrix: [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1
          ],
          type: 'Scene',
          uuid: siteId
        }
      }
      return json;
    });
  }

  static getSiteData(siteId: string, filterObjectsOptions?: ThreeObjectPrepareFiltersOptions) {
    let promises: Array<Promise<any>> = [];
    let filterObjects = '';
    if (filterObjectsOptions) {
      filterObjects = '&' + ThreeObjectModel.prepareFilters(filterObjectsOptions);
    }
    promises.push(ThreeObjectModel.getAll(`?siteId=${siteId}${filterObjects}`));
    promises.push(ThreeGeometryModel.getAll(`?siteId=${siteId}`));
    promises.push(ThreeMaterialModel.getAll(`?siteId=${siteId}`));
    return Promise.all(promises);
  }

}
