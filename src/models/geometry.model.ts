import { model, Model, type, validate, GetAllOptions } from 'aurelia-deco';
import * as THREE from 'three';
import { ThreeSiteModel } from '../internal';


@model('/three/geometry')
export class ThreeGeometryModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string

  @type.string
  public importId: string;

  @type.string
  public formatVersion: string;

  @type.string
  public uuid: string;

  @type.string
  public type: string;

  @type.array({type: 'object', options: {
    keys: {
      x: {type: 'float', required: true},
      y: {type: 'float', required: true},
      z: {type: 'float', required: true}
    }
  }, allowOtherKeys: true})
  public vertices: Array<THREE.Vector3>;

  @type.array({type: 'any'})
  public colors: Array<any>;

  @type.array({type: 'any'})
  public faces: Array<THREE.Face>;

  @type.any
  public faceVertexUvs: any;

  @type.any
  public morphTargets: any;

  @type.any
  public morphNormals: any;

  @type.any
  public skinWeights: any;

  @type.any
  public skinIndices: any;

  @type.any
  public lineDistances: any;
  
  @type.any
  public boundingBox: THREE.Box3;

  @type.any
  public boundingSphere: THREE.Sphere;

  @type.any
  public index: THREE.BufferAttribute;

  @type.any
	public attributes: {
		[name: string]: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
  };
  
  @type.any
  public morphAttributes: {
		[name: string]: ( THREE.BufferAttribute | THREE.InterleavedBufferAttribute )[];
  };
  
  @type.any
  public groups: { start: number; count: number; materialIndex?: number }[];
  
  @type.any
  public drawRange: { start: number; count: number };
  
  @type.object({allowOtherKeys: true})
  public userData: {[key: string]: any};
  
  @type.boolean
  public isBufferGeometry: boolean;
  
  @type.any
  public data: any;

  @type.any
  public scale: any;

  @type.any
  public visible: any;

  @type.any
  public castShadow: any;

  @type.any
  public receiveShadow: any;

  @type.any
  public doubleSided: any;

  @type.float
  public radius: number;

  @type.float
  public radiusTop: number;

  @type.float
  public radiusBottom: number;
  
  @type.float
  public width: number;

  @type.float
  public height: number;

  @type.float
  public depth: number;

  @type.any
  public segments: any;
  
  @type.float
  public radialSegments: number;

  @type.float
  public tubularSegments: number;

  @type.float
  public radiusSegments: number;
  
  @type.float
  public widthSegments: number;
  
  @type.float
  public heightSegments: number;

  @type.boolean
  public openEnded: boolean;

  @type.float
  public thetaStart: number;

  @type.float
  public thetaLength: number;

  static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions): Promise<Array<InstanceType<T>>> {
    return super.getAll(suffix, options).then((el) => {
      const elements: Array<InstanceType<T>> = (el as Array<InstanceType<T>>);
      for (let element of elements) {
        if (element instanceof ThreeGeometryModel) {
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
