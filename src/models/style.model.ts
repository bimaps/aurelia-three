import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate } from 'aurelia-deco';

export interface ThreePos {
  x: number;
  y: number;
  z: number;
}

@model('/three/style')
export class ThreeStyleModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.string
  @validate.required
  public name: string;

  @type.boolean
  public display?: boolean;

  @type.string
  public color?: string;

  @type.select({options: ['basic', 'phong', 'texture']})
  public material?: 'original' | 'basic' | 'phong' | 'texture';

  @type.file({accept: ['image/*']})
  public image?: any;

  @type.float
  public opacity?: number  = 1;

  @type.integer
  public renderOrder?: number;

  @type.boolean
  public displayLabel?: boolean;

  @type.string
  public labelKey?: string;

  @type.string({textarea: true})
  public labelTemplate?: string;

  @type.string
  public labelBackgroundColor?: string;

  @type.string
  public labelTextColor?: string;

  @type.string
  public labelScale?: number;

  @type.select({options: ['auto', 'bbox', 'polylabel']})
  public labelCentroidMethod?: 'auto' | 'bbox' | 'polylabel' = 'auto';

  @type.object({keys: {
    x: {type: 'float'},
    y: {type: 'float'},
    z: {type: 'float'},
  }, allowOtherKeys: true})
  public labelPosition?: ThreePos;

  @type.float
  public labelOpacity?: number = 1;

  @type.boolean
  public icon?: boolean;

  @type.string
  public iconKey?: string;

  @type.string
  public iconDefault?: string;

  @type.string
  public iconBackground?: string;

  @type.string
  public iconForeground?: string;

  @type.float
  public iconScale?: number;

  @type.select({options: ['auto', 'bbox', 'polylabel']})
  public iconCentroidMethod?: 'auto' | 'bbox' | 'polylabel' = 'auto';

  @type.object({keys: {
    x: {type: 'float'},
    y: {type: 'float'},
    z: {type: 'float'},
  }})
  public iconPosition?: ThreePos;

  @type.float
  public iconOpacity?: number = 1;

  @type.boolean
  public replaceGeometry?: boolean;

  @type.select({options: ['cone', 'sphere', 'cube', 'cylinder']})
  public geometryShape: 'cone' | 'sphere' | 'cube' | 'cylinder'

  @type.float
  public geometryScale?: number;

  @type.object({keys: {
    x: {type: 'float'},
    y: {type: 'float'},
    z: {type: 'float'},
  }})
  public geometryPosition?: ThreePos;

  @type.object({keys: {
    x: {type: 'float'},
    y: {type: 'float'},
    z: {type: 'float'},
  }})
  public geometryRotation?: ThreePos;

  @type.boolean
  public edgesDisplay?: boolean;
  
}
