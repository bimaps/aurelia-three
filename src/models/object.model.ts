import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate, Metadata, GetAllOptions } from 'aurelia-deco';
import * as THREE from 'three';
import { StringTMap } from 'aurelia-resources';
import { Logger, getLogger } from 'aurelia-logging';
const log: Logger = getLogger('three-object-model');

@model('/three/object')
export class ThreeObjectModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.string
  public buildingId: string;

  @type.array({type: 'string'})
  public storeys: Array<string>;

  @type.string
  public spaceId: string;

  @type.string
  public importId: string;

  @type.string
  public formatVersion: string;

  @type.string
  public uuid: string;

  @type.string
  public name: string;

  @type.string
  public type: string;

  @type.array()
  public matrix: Array<number>;

  @type.any()
  public material: string | Array<string>;

  @type.any()
  public geometry: string | Array<string>;

  @type.object({allowOtherKeys: true})
  public userData: {[key: string]: any;};

  @type.array()
  public children: Array<any>;

  @type.array()
  public childrenIds: Array<string>;

  @type.id
  public parentId: string;

  @type.object({keys: {
    x: {type: 'float', required: true},
    y: {type: 'float', required: true},
    z: {type: 'float', required: true},
  }, allowOtherKeys: true})
  public _min: THREE.Vector3;

  @type.object({keys: {
    x: {type: 'float', required: true},
    y: {type: 'float', required: true},
    z: {type: 'float', required: true},
  }, allowOtherKeys: true})
  public _max: THREE.Vector3;


  // let box = new THREE.Box3;
  // let v = 1000;
  // box.min.x = v * -1;
  // box.min.y = v * -1;
  // box.min.z = v * -1;
  // box.max.x = v;
  // box.max.y = v;
  // box.max.z = v;
  // let options: ThreeObjectPrepareFiltersOptions = {
  //   insideBbox: box,
  //   touchBbox: box,
  //   type: 'Mesh',
  //   userData: {
  //     'str': 'test',
  //     'val': {$gte: 40},
  //     'visible': 'asfd'
  //   }
  // }
  static prepareFilters(options: ThreeObjectPrepareFiltersOptions): string {
    let filters: Array<string> = [];
    let globalFilters: Array<string> = [];

    ['uuid', 'name', 'type', 'material', 'geometry', 'parentId'].map((key) => {
      if (typeof options[key] === 'string') {
        filters.push(`${key}=${options[key]}`);
      } else if (Array.isArray(options[key])) {
        filters.push(`${key}=${options[key].join(',')}`);
      }
    });

    if (options.insideBbox) {
      globalFilters.push(`{"_min.x": {"$gte": ${options.insideBbox.min.x}}}`);
      globalFilters.push(`{"_min.y": {"$gte": ${options.insideBbox.min.y}}}`);
      globalFilters.push(`{"_min.z": {"$gte": ${options.insideBbox.min.z}}}`);
      globalFilters.push(`{"_max.x": {"$lte": ${options.insideBbox.max.x}}}`);
      globalFilters.push(`{"_max.y": {"$lte": ${options.insideBbox.max.y}}}`);
      globalFilters.push(`{"_max.z": {"$lte": ${options.insideBbox.max.z}}}`);
    }
    if (options.touchBbox) {
      let globalFilters: Array<string> = [];
      globalFilters.push(`{"_min.x": {"$lte": ${options.touchBbox.max.x}}}`);
      globalFilters.push(`{"_min.y": {"$lte": ${options.touchBbox.max.y}}}`);
      globalFilters.push(`{"_min.z": {"$lte": ${options.touchBbox.max.z}}}`);
      globalFilters.push(`{"_max.x": {"$gte": ${options.touchBbox.min.x}}}`);
      globalFilters.push(`{"_max.y": {"$gte": ${options.touchBbox.min.y}}}`);
      globalFilters.push(`{"_max.z": {"$gte": ${options.touchBbox.min.z}}}`);
    }

    if (options.userData) {
      for (let key in options.userData) {
        let value = options.userData[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string') {
            value = `"${value}"`;
          }
          globalFilters.push(`{"userData.${key}": ${value}}`); // equality query
        } else if (typeof value === 'object'){
          // we assume that the value is a query
          globalFilters.push(`{"userData.${key}": ${JSON.stringify(value)}}`)
        }
      }
    }

    if (options.globalFilters) {
      globalFilters.concat(options.globalFilters);
    }

    if (globalFilters.length > 0) {
      let globalFiltersString = `__global__=<{"$and":[${globalFilters.join(', ')}]}>`;
      filters.push(globalFiltersString);
    }

    return filters.join('&');
  }

  static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions, flat: boolean = false): Promise<Array<InstanceType<T>>> {
    return super.getAll(suffix, options).then((el) => {
      const elements: Array<InstanceType<T>> = (el as Array<InstanceType<T>>);
      if (elements.length === 0) return elements;
      let containsLighting: boolean = false;
      let hObjects: StringTMap<InstanceType<T>> = {};
      let rObjects: Array<InstanceType<T>> = [];
      let allIds: Array<string> = elements.map(i => i.id);
      for (let element of elements) {
        if (element instanceof ThreeObjectModel) {
          hObjects[element.id] = element;
          if (!element.parentId || allIds.indexOf(element.parentId) === -1) rObjects.push(element);
          if (element.type.indexOf('Light') !== -1) containsLighting = true;
          if (!element.userData) element.userData = {};
          element.userData.id = element.id;
          element.userData.siteId = element.siteId;
          element.userData.parentId = element.parentId;
          element.userData.childrenIds = element.childrenIds;
          element.userData.importId = element.importId;
          element.userData.buildingId = element.buildingId;
          element.userData.storeys = element.storeys;
          element.userData.spaceId = element.spaceId;
        }
      }
      // create hierarchical data
      if (!flat) {
        for (let obj of rObjects) {
          ThreeObjectModel.addChildren(obj as ThreeObjectModel, hObjects as StringTMap<ThreeObjectModel>);
        }
      }

      const retValue = flat ? elements : rObjects;
      retValue[0].set('_loadInfos', {
        containsLighting: containsLighting
      });
      return retValue;
    });
  }

  static addChildren(object: ThreeObjectModel, hObjects: StringTMap<ThreeObjectModel>) {
    let children: Array<ThreeObjectModel> = [];
    for (let childId of object.childrenIds || []) {
      if (hObjects[childId]) {
        let child = hObjects[childId];
        ThreeObjectModel.addChildren(child, hObjects);
        children.push(child);
      }
    }
    object.children = children;
    delete object.childrenIds;
  }

  static fromThreeObject(object: THREE.Object3D) {
    let obj = new ThreeObjectModel();
    object = object.clone();
    obj.id = object.userData && object.userData.id ? object.userData.id : undefined;
    obj.siteId = object.userData && object.userData.siteId ? object.userData.siteId : undefined;
    obj.parentId = object.parent.userData.id ? object.parent.userData.id : undefined;
    obj.childrenIds = object.children.length ? object.children.map(i => i.userData.id).filter(v => v !== undefined) : [];
    obj.importId = object.userData && object.userData.importId ? object.userData.importId : undefined;
    obj.uuid = object.uuid;
    obj.name = object.name ? object.name : undefined;
    obj.type = object.type;
    obj.matrix = object.matrix.elements;

    const objectMesh: THREE.Mesh = (object as THREE.Mesh);
    if (objectMesh.material) {
      if (Array.isArray(objectMesh.material)) {
        obj.material = objectMesh.material.map(i => i.uuid);
      } else {
        obj.material = objectMesh.material.uuid;
      }
    }

    if (objectMesh.geometry) {
      if (Array.isArray(objectMesh.geometry)) {
        obj.geometry = objectMesh.geometry.map(i => i.uuid);
      } else {
        obj.geometry = objectMesh.geometry.uuid;
      }
    }
    
    obj.userData = Object.assign({}, object.userData);
    delete obj.userData.id;
    delete obj.userData.siteId;
    delete obj.userData.parentId;
    delete obj.userData.childrenIds;
    delete obj.userData.importId;

    let bbox = new THREE.BoxHelper( object );
    bbox.geometry.computeBoundingBox();
    obj._min = bbox.geometry.boundingBox.min;
    obj._max = bbox.geometry.boundingBox.max;

    return obj;
  }
  
}

export interface ThreeObjectPrepareFiltersOptions {
  insideBbox?: THREE.Box3;
  touchBbox?: THREE.Box3;
  uuid?: string | Array<string>;
  name?: string | Array<string>;
  geometry?: string | Array<string>;
  material?: string | Array<string>;
  parentId?: string | Array<string>;
  type?: string | Array<string>;
  userData?: {[key: string]: any;};
  globalFilters?: Array<string>;
}
