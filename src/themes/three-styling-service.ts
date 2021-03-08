import { ThreeGeometry } from './three-geometry';
import { ThreeUtils } from './../helpers/three-utils';
import { ThreeGenerator } from './../helpers/three-generator';
import { ThreeCustomElement } from '../components/three';
import { StringTMap, Parser } from "aurelia-resources";
import * as THREE from 'three';
import * as resolvePath from 'object-resolve-path';
import * as moment from 'moment';
import { computedFrom } from 'aurelia-binding';
import { ThreeTheme } from './three-theme';
import { ThreeThemeRule } from './three-theme-rule';
import { ThreeStyleDefinition } from './three-style-definition';
import { Logger, getLogger } from 'aurelia-logging';
import { SpriteText2D, textAlign } from 'three-text2d';
import { ThreeIcon } from './three-icon';

export class ThreeStylingService {

  private three: ThreeCustomElement;
  private currentTheme: ThreeTheme;

  private log: Logger = getLogger('three-styling-service');

  constructor(three: ThreeCustomElement, private atv?: any) { // TODO: cast the right type for atv once its merged inside the plugin (if ever)
    this.three = three;
    this.registerSubscribers();
  }

  public registerSubscribers() {
    this.three.subscribe('three-scene.request-styling', (data) => {
      if (data.three === this.three && this.currentTheme) {
        this.applyCurrentTheme();
      }
    });
  }

  @computedFrom('currentTheme', 'currentTheme.name')
  get currentThemeName(): string {
    if (!this.currentTheme) return '';
    return this.currentTheme.name;
  }

  public activate(theme: ThreeTheme) {
    //if (this.currentTheme === theme) return;
    if (this.currentTheme) {
      this.currentTheme.deactivate();
    }
    theme.activate(this.three);
    this.currentTheme = theme;
    return this.applyCurrentTheme();
  }

  public clearTheme() {
    if (this.currentTheme) {
      this.currentTheme.deactivate();
    }
    this.currentTheme = undefined;
    
    this.three.getScene().traverse((object) => {
      this.resetDefinition(object);
    });

    this.three.objects.removeAllEdges();
  }

  public applyCurrentTheme(context: Array<string> = [], options: ApplyThemeOptions = {}) {
    return this.applyTheme(this.three.getScene(), this.currentTheme, context, options);
  }

  public removeRelatedObjects(obj: THREE.Object3D) {
    this.removeObjectIcon(obj);
    this.removeObjectLabel(obj);
  }

  /**
   * 
   * @param objects THREE.Object3D | THREE.Object3D[]: list of objects to be styled. Note that they will be traversed, so for styling a full scene, only pass the Scene object
   * @param theme 
   * @param context 
   * @param options 
   */
  public applyTheme(objects: Array<THREE.Object3D> | THREE.Object3D, theme: ThreeTheme, context: Array<string> = [], options: ApplyThemeOptions = {}) {
    if (objects instanceof THREE.Object3D) objects = [objects];

    let rules = theme.rules.filter((rule) => {
      if (rule.active === false) return false;
      if (rule.context.length === 0) return true;
      return (rule.context.filter(x => context.includes(x))).length > 0;
    });

    rules.sort((a, b) => {
      if (a.priority > b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0
    });

    let childrenDefinitions: StringTMap<ThreeStyleDefinition> = {};

    for (let rootObject of objects) {
      rootObject.traverse((object) => {
        const o: any = object;
        if (o.__filterToolVisible == false) {
          this.removeObjectIcon(object);
          this.removeObjectLabel(object);
          return;
        }
        let definition = new ThreeStyleDefinition();
        if (childrenDefinitions[object.uuid]) definition.augment(childrenDefinitions[object.uuid]);
        for (let rule of rules) {
          if (!this.compareRuleWithObject(rule, object)) continue;
          if (rule.exclusive) {
            definition.clear();
          }
          definition.augment(rule.definition);
          if (rule.applyToChildren) {
            // traverse object children to save a future base definition
            object.traverse((child) => {
              if (child === object) return;
              let uuid = child.uuid;
              let def = childrenDefinitions[uuid] ? childrenDefinitions[uuid] : new ThreeStyleDefinition();
              def.augment(definition);
              childrenDefinitions[uuid] = def;
            });
          }
          if (rule.last) {
            break;
          }
        }
        this.applyDefinition(object, definition);
      });
    }

    childrenDefinitions = undefined;


  }

  

  private preparePathKey(key: string) {
    const parts = key.split('.');
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        continue;
      }
      parts[i] = `["${parts[i]}"]`;
    }
    return parts.join('');
  }

  private compareRuleWithObject(rule: ThreeThemeRule, object: THREE.Object3D): boolean {
    for (let condition of rule.conditions) {
      let key = this.fixKeyWithOriginal(object, condition.key);
      let value = resolvePath(object, this.preparePathKey(key));
      if (typeof condition.value === 'number' && typeof value === 'string') {
        value = parseFloat(value);
      } else if (condition.value instanceof Date && typeof value === 'string') {
        value = moment(value).toDate();
      }
      if (condition.type === '=') {
        if (this.makeNumerIfPossible(value) != this.makeNumerIfPossible(condition.value)) return false;
      } else if (condition.type === '!=') {
        if (this.makeNumerIfPossible(value) == this.makeNumerIfPossible(condition.value)) return false;
      } else if (condition.type === '<') {
        if (this.makeNumerIfPossible(value) > this.makeNumerIfPossible(condition.value)) return false;
      } else if (condition.type === '>') {
        if (this.makeNumerIfPossible(value) < this.makeNumerIfPossible(condition.value)) return false;
      } else if (condition.type === '*') {
        if (typeof condition.value !== 'string' && condition.value.toString) condition.value = condition.value.toString();
        if (typeof value !== 'string' && value.toString) value = value.toString();
        if (typeof value !== 'string' || typeof condition.value !== 'string') {
          // could not convert values to string
          return false;
        }
        if (value.toLowerCase().indexOf(condition.value.toLowerCase()) === -1) return false;
      }
    }
    return true;
  }

  private makeNumerIfPossible(input: string | any): number | any {
    if (typeof input !== 'string') {
      return input;
    }
    const num = parseFloat(input.trim());
    return `${num}` === input.trim() ? num : input;
  }

  private fixKeyWithOriginal(object: THREE.Object3D, key: string): string {
    const o: StylingObject = object;
    if (key.indexOf('geometry.') === 0 && o.__originalGeometry) {
      key = key.replace('geometry.', '__originalGeometry.');
    }
    if (key.indexOf('material.') === 0 && o.__originalMaterial) {
      key = key.replace('material.', '__originalMaterial.');
    }
    return key;
  }

  private resetDefinition(object: THREE.Object3D) {
    const o: StylingObject = object;

    if (!o.__originalSaved) {
      return;
    }

    // this ensure that the filter service
    // is reset when changing the visibility through themes
    // delete (object as any).__filterToolOriginalVisible;
    object.visible = o.__originalVisible;
    if (object instanceof THREE.Mesh) {
      // this ensure that the selection styles
      // is reset when changin the material through themes
      delete (object as any).__selectToolOriginalMaterial;
      object.material = o.__originalMaterial;
      object.geometry = o.__originalGeometry;
    }

    if (o.__originalSaved) {
      this.unsetOriginalObjectValues(object);
    }

    this.removeObjectLabel(object);
    this.removeObjectIcon(object);
  }

  private applyDefinition(object: THREE.Object3D, definition: ThreeStyleDefinition) {
    const o: StylingObject = object;
    if (!o.__originalSaved) {
      this.setOriginalObjectValues(object);
    }

    // this ensure that the filter service
    // is reset when changing the visibility through themes
    // delete (object as any).__filterToolOriginalVisible;
    if (definition.display === undefined) {
      object.visible = (object as any).__filterToolVislble;
    } else {
      object.visible = definition.display;
    }

    if (object instanceof THREE.Mesh) {
      // this ensure that the selection styles
      // is reset when changin the material through themes
      delete (object as any).__selectToolOriginalMaterial;
      if (definition.material === undefined) {
        object.material = o.__originalMaterial;
      } else {
        object.material = definition.material;
      }
      if (definition.replaceGeometry === true) {
        this.replaceObjectGeometry(object, definition);
      } else if (o.__originalGeometry && object.geometry !== o.__originalGeometry && definition.replaceGeometry === false) {
        object.geometry = o.__originalGeometry;
      }
      if (definition.edgesDisplay) {
        this.three.objects.addEdgestoObject(object);
      } else {
        this.three.objects.removeEdgesObject(object);
      }
    }

    if (definition.displayLabel === true) {
      this.addObjectLabel(object, definition);
    } else {
      this.removeObjectLabel(object);
    }

    if (definition.icon === true) {
      this.addObjectIcon(object, definition);
    } else {
      this.removeObjectIcon(object);
    }

  }

  private addObjectLabel(object: THREE.Object3D, definition: ThreeStyleDefinition) {
    this.removeObjectLabel(object);
    // label name
    let name = `label-${object.uuid}`;
    // label position
    let position;
    if (object.userData.__labelPosition) {
      // if the object has a property (__labelPosition) to determine the label position, we use it
      let labelPosition = object.userData.__labelPosition.split(',');
      position = {
        x: parseFloat(labelPosition[0]),
        y: parseFloat(labelPosition[1]),
        z: parseFloat(labelPosition[2])
      };
    } else {
      // otherwise we position the label using the centroid of the object
      let bbox = ThreeUtils.bboxFromObject(object);
      if (definition.labelCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
        position = ThreeUtils.polylabel(object, bbox.min.y);
      } else {
        position = ThreeUtils.centroidFromBbox(bbox);
      }
    }
    // apply position offset (from style)
    let offsetX = 0;
    let offsetY = 0;
    let offsetZ = 0;
    if (definition.labelPosition && definition.labelPosition.x) {
      offsetX = definition.labelPosition.x;
    }
    if (definition.labelPosition && definition.labelPosition.y) {
      offsetY = definition.labelPosition.y;
    }
    if (definition.labelPosition && definition.labelPosition.z) {
      offsetZ = definition.labelPosition.z;
    }
    
    position.x += offsetX;
    position.y += offsetY;
    position.z += offsetZ;

    let options = {
      textAlign: textAlign.center,
      font: '40px Arial',
      textColor: definition.labelTextColor,
      backgroundColor: definition.labelBackgroundColor,
      paddingX: 10
    };

    let text = '';
    if (definition.labelTemplate) {
      text = Parser.parseTemplate(definition.labelTemplate, {object});
    } else {
      text = resolvePath(object, definition.labelKey || 'userData.label');
    }

    if (!text) return;
    this.addLabel(name, text, position, definition.labelScale, options);
  }

  private removeObjectLabel(object: THREE.Object3D) {
    let name = `label-${object.uuid}`;
    let labelObject = this.three.getScene('overlay').getObjectByName(name);
    if (labelObject) this.three.getScene('overlay').remove(labelObject);
  }

  private addLabel(name: string, text: string, position = { x: 0, y: 0, z: 0 }, scale = 1, options: any = {}) {
    if (options.textAlign === undefined) options.textAlign = textAlign.center;
    if (options.font === undefined) options.font = '20px Arial';
    if (options.textColor === undefined) options.textColor = '#000000';
    if (options.backgroundColor === undefined) options.backgroundColor = '#fffff';
    if (options.paddingX === undefined) options.paddingX = 10;

    if (typeof scale !== 'number' || Number.isNaN(scale)) scale = 1;

    let sprite = new SpriteText2D(text, {
      align: options.textAlign,
      font: options.font,
      fillStyle: options.textColor,
      backgroundColor: options.backgroundColor,
      verticalPadding: 2,
      horizontalPadding: 2,
      antialias: false
    });
    
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(scale * 0.1, scale * 0.1, scale * 0.1);

    sprite.name = name;
    sprite.userData._type = '_label';
    sprite.material.depthTest = false;
    sprite.renderOrder = 10;

    this.three.getScene('overlay').add(sprite);

    return sprite;
  }

  private addObjectIcon(object: THREE.Object3D, definition: ThreeStyleDefinition) {
    this.removeObjectIcon(object);
    // icon name
    let name = `icon-${object.uuid}`;
    // icon position
    let position;
    if (object.userData.__iconPosition) {
      // if the object has a property (__iconPosition) to determine the label position, we use it
      let iconPosition = object.userData.__iconPosition.split(',');
      position = {
        x: parseFloat(iconPosition[0]),
        y: parseFloat(iconPosition[1]),
        z: parseFloat(iconPosition[2])
      };
    } else {
      // otherwise we position the label using the centroid of the object
      let bbox = ThreeUtils.bboxFromObject(object);
      if (definition.iconCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
        position = ThreeUtils.polylabel(object, bbox.min.y);
      } else {
        position = ThreeUtils.centroidFromBbox(bbox);
      }
    }

    // apply position offset (from style)
    let offsetX = 0;
    let offsetY = 0;
    let offsetZ = 0;
    if (definition.iconPosition && definition.iconPosition.x) {
      offsetX = definition.iconPosition.x;
    }
    if (definition.iconPosition && definition.iconPosition.y) {
      offsetY = definition.iconPosition.y;
    }
    if (definition.iconPosition && definition.iconPosition.z) {
      offsetZ = definition.iconPosition.z;
    }
    
    position.x += offsetX;
    position.y += offsetY;
    position.z += offsetZ;

    let options:AddIconOptions = {
      strokeColor: definition.iconForeground,
      backgroundColor: definition.iconBackground,
      text: definition.iconText
    };


    let iconName = definition.iconDefault;
    let iconValue = resolvePath(object, definition.iconKey || 'userData.icon');
    if (iconValue) {
      iconName = iconValue;
    }

    if (!iconName && !options.text) return;

    this.addIcon(name, iconName, position, definition.iconScale, options);
  }

  private addIcon(objectName: string, iconName: string, position: THREE.Vector3, scale = 1, options: AddIconOptions = {}): Promise<THREE.Sprite> {
    if (!options.backgroundColor) options.backgroundColor = 'default';
    if (!options.strokeColor) options.strokeColor = 'default';

    return ThreeIcon.getTexture(iconName, options.backgroundColor, options.strokeColor, options.text).then((texture) => {
      if (!texture) {
        throw new Error('Impossible to draw icon, missing texture');
      }
      let material = new THREE.SpriteMaterial({ map: texture });
      let sprite = new THREE.Sprite(material);
      sprite.position.set(position.x, position.y, position.z);
      sprite.scale.set(scale, scale, scale);
      sprite.name = objectName;
      sprite.userData._type = '_icon';
      sprite.material.depthTest = false;
      sprite.renderOrder = 10;
      this.three.getScene('overlay').add(sprite);
  
      return sprite;
    }); 
  }

  private removeObjectIcon(object) {
    let name = `icon-${object.uuid}`;
    let iconObject = this.three.getScene('overlay').getObjectByName(name);
    if (iconObject) this.three.getScene('overlay').remove(iconObject);
  }

  private replaceObjectGeometry(object: THREE.Object3D, definition: ThreeStyleDefinition) {
    // measure original object position
    const o: StylingObject = object;
    let position = ThreeUtils.centroidFromObject(object);

    // determine translation and rotation to apply to the replaced geometry
    let tx = position.x + (definition.geometryPosition ? definition.geometryPosition.x : 0);
    let ty = position.x + (definition.geometryPosition ? definition.geometryPosition.y : 0);
    let tz = position.x + (definition.geometryPosition ? definition.geometryPosition.z : 0);

    let rx;
    let ry;
    let rz;
    if (object.userData.__geometryRotation) {
      // if the object has a property (__geometryRotation)
      let geometryRotation = object.userData.__geometryRotation.split(',');
      rx = parseFloat(geometryRotation[0]);
      ry = parseFloat(geometryRotation[1]);
      rz = parseFloat(geometryRotation[2]);
    } else {
      rx = definition.geometryRotation ? definition.geometryRotation.x :  0;
      ry = definition.geometryRotation ? definition.geometryRotation.y :  0;
      rz = definition.geometryRotation ? definition.geometryRotation.z :  0;
    }

    let matrix = new THREE.Matrix4();
    let translation = new THREE.Matrix4().makeTranslation(tx, ty, tz);
    let rotationX = new THREE.Matrix4().makeRotationX(rx);
    let rotationY = new THREE.Matrix4().makeRotationY(ry);
    let rotationZ = new THREE.Matrix4().makeRotationZ(rz);
    let scale = new THREE.Matrix4().makeScale(definition.geometryScale, definition.geometryScale, definition.geometryScale);
    matrix.multiply(translation).multiply(rotationX).multiply(rotationY).multiply(rotationZ).multiply(scale);

    let geometry = ThreeGeometry.get(definition.geometryShape);
    geometry.applyMatrix(matrix);
    if (object instanceof THREE.Mesh) {
      // if the object is a mesh we can directly replace its geometry
      // todo: evaluate the impact of not registering function to create geometries but to actually only have one geometry by shape to save memory
      object.geometry = geometry; // .clone(); // no need to clone as we get the geometry from a function, this by the way might be a bad idea in terms of performance
    } else if (definition.material) {
      // otherwise we create a child object
      let replacingObject = new THREE.Mesh(geometry, definition.material);
      // transfer all flag properties
      for (let key of Object.keys(object)) {
        if (key.substr(0, 1) === '_') replacingObject[key] = object[key];
      }
      replacingObject.userData = object.userData;
      replacingObject.userData._replacing = object;
      object.add(replacingObject);
    }
  }

  private setOriginalObjectValues(object: THREE.Object3D): StylingObject {
    const o: StylingObject = object;
    o.__originalVisible = object.visible;
    o.__originalGeometry = object instanceof THREE.Mesh ? object.geometry : undefined;
    o.__originalMaterial = object instanceof THREE.Mesh ? object.material : undefined;
    
    o.__originalSaved = true;
    return o;
  }

  private unsetOriginalObjectValues(object: THREE.Object3D): StylingObject {
    const o: StylingObject = object;
    delete o.__originalVisible;
    delete o.__originalGeometry;
    delete o.__originalMaterial;
    delete o.__originalSaved;
    return o;
  }

  
}


export interface ApplyThemeOptions {

}


export class StylingObject extends THREE.Object3D {
  __originalSaved?: boolean;
  __originalMaterial?: THREE.Material | THREE.Material[];
  __originalGeometry?: THREE.Geometry | THREE.BufferGeometry;
  __originalVisible?: boolean;
  __originalOpacity?: number;
  __originalPosition?: THREE.Vector3;
  __originalRotation?: THREE.Euler;
}

export interface AddIconOptions {
  strokeColor?: string;
  backgroundColor? : string;
  text?: string;
}
