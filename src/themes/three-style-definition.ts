import * as THREE from 'three';

export class ThreeStyleDefinition {

  public display?: boolean;
  public material?: THREE.Material | THREE.Material[];
  public geometry?: THREE.Geometry | THREE.BufferGeometry;
  // TODO: handle renderOrder
  
  public displayLabel?: boolean;
  public labelKey?: string;
  public labelTemplate?: string;
  public labelBackgroundColor: string;
  public labelTextColor: string;
  public labelScale: number;
  public labelCentroidMethod: string;
  public labelPosition?: THREE.Vector3;
  public labelOpacity?: number;

  public icon?: boolean;
  public iconKey?: string;
  public iconDefault?: string;
  public iconText?: string;
  public iconBackground: string;
  public iconForeground: string;
  public iconScale: number;
  public iconCentroidMethod: string;
  public iconPosition?: THREE.Vector3;
  public iconOpacity?: number;
  public iconTexture?: THREE.Texture;

  public replaceGeometry?: boolean;
  public geometryShape?: string;
  public geometryScale: number;
  public geometryCentroidMethod: string;
  public geometryPosition?: THREE.Vector3;
  public geometryRotation?: THREE.Vector3;

  public edgesDisplay: boolean;

  public clone(): ThreeStyleDefinition {
    let clone = new ThreeStyleDefinition();
    clone.setWithProperties(this);
    return clone;
  }

  public setWithProperties(definition: ThreeStyleDefinition) {
    for (let key in this) {
      if (typeof key !== 'string') continue;
      if (definition[(key as string)] !== undefined) this[(key as string)] = definition[(key as string)];
    }
  }

  public augment(definition: ThreeStyleDefinition) {
    // TODO: fix augment
    const entryDefinition: ThreeStyleDefinition = Object.assign({}, definition);
    entryDefinition.displayLabel = entryDefinition.displayLabel ? true : undefined;
    entryDefinition.icon = entryDefinition.icon ? true : undefined;
    entryDefinition.replaceGeometry = entryDefinition.replaceGeometry ? true : undefined;

    for (const key in entryDefinition) {
      if (entryDefinition.display === undefined && (key === 'material' || key === 'geometry' || key === 'color' || key === 'opacity' || key === 'renderOrder' || key === 'image')) {
        entryDefinition[key] = undefined;
      }
      if (entryDefinition.displayLabel === undefined && key.substr(0, 5) === 'label') {
        entryDefinition[key] = undefined;
      }
      if (entryDefinition.icon === undefined && key.substr(0, 5) === 'icon') {
        entryDefinition[key] = undefined;
      }
      if (entryDefinition.replaceGeometry === undefined && key.substr(0, 8) === 'geometry') {
        entryDefinition[key] = undefined;
      }
      if (entryDefinition.edgesDisplay === undefined && key.substr(0, 5) === 'edges') {
        entryDefinition[key] = undefined;
      }
    }

    for (let key in entryDefinition) {
      if (typeof key !== 'string') continue;
      if (entryDefinition[(key as string)] !== undefined) this[(key as string)] = entryDefinition[(key as string)];
    }
  }

  public clear() {
    this.setWithProperties(new ThreeStyleDefinition);
  }
}
