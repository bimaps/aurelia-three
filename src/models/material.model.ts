import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate, Metadata, GetAllOptions } from 'aurelia-deco';
import * as THREE from 'three';


@model('/three/material')
export class ThreeMaterialModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

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

  @type.any
  public color: THREE.Color;

  @type.any
  public ambient: THREE.Color;

  @type.any
  public emissive: THREE.Color;

  @type.any
  public specular: THREE.Color;

  @type.float
  public shininess: number;

  @type.any
  public roughness: any;

  @type.any
  public metalness: any;

  @type.float
  public opacity: number;

  @type.boolean
  public transparent: boolean;

  @type.any
  public side: any;

  @type.any
  public children: any;

  @type.any
  public depthFunc: THREE.DepthModes;

  @type.boolean
  public depthTest: boolean;

  @type.boolean
  public depthWrite: boolean;

  @type.object({allowOtherKeys: true})
  public userData: {[key: string]: any;};

  static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions): Promise<Array<InstanceType<T>>> {
    return super.getAll(suffix, options).then((el) => {
      const elements: Array<InstanceType<T>> = (el as Array<InstanceType<T>>);
      for (let element of elements) {
        if (element instanceof ThreeMaterialModel) {
          if (!element.userData) element.userData = {};
          element.userData.id = element.id;
          element.userData.siteId = element.siteId;
          element.userData.importId = element.importId;
        }
      }
      return elements;
    });
  }

}
