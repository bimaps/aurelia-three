import { ThreeTool } from './three-tool';
import { ThreeUtils } from '../helpers/three-utils';
import { computedFrom } from 'aurelia-binding';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Container } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { StringTMap } from 'aurelia-resources';
const log = getLogger('three-selection-tool');

export interface SelectionMaterial {
  material: THREE.Material | 'original';
  overlay?: THREE.MeshBasicMaterial;
  wireframe?: THREE.MeshBasicMaterial;
}

export interface SelectionStyle {
  excluded: SelectionMaterial;
  unselected: SelectionMaterial;
  hover: SelectionMaterial;
  selected: SelectionMaterial;
  ghost: SelectionMaterial;
}

let hidden: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#fff', opacity: 0, transparent: true, alphaTest: 1})
};
let original: SelectionMaterial = {
  material: 'original'
};
let originalLightOverlay: SelectionMaterial = {
  material: 'original',
  overlay: new THREE.MeshBasicMaterial({color: '#33f', opacity: 0.5, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false})
};
let originalOverlay: SelectionMaterial = {
  material: 'original',
  overlay: new THREE.MeshBasicMaterial({color: '#33f', opacity: 0.5, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#333', opacity: 0.8, transparent: true, wireframe: true, depthTest: false})
};
let veryLight: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#ddd', opacity: 0.1, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#333', opacity: 0.2, transparent: true, wireframe: true, depthTest: false})
};
let light: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#666', opacity: 0.3, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#333', opacity: 0.3, transparent: true, wireframe: true, depthTest: false})
};
let lightBlue: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#33f', opacity: 0.3, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#000', opacity: 0.4, transparent: true, wireframe: true, depthTest: false})
};
let mediumBlue: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#33f', opacity: 0.3, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#000', opacity: 0.8, transparent: true, wireframe: true, depthTest: false})
};
let blackWireframe: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#ddd', opacity: 0, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#333', opacity: 0.9, transparent: true, wireframe: true, depthTest: false})
};
let lightBlueWithRedWireframe: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#33f', opacity: 0.3, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false})
}
let redWireframe: SelectionMaterial = {
  material: new THREE.MeshBasicMaterial({color: '#ddd', opacity: 0, transparent: true}),
  wireframe: new THREE.MeshBasicMaterial({color: '#f00', opacity: 1, transparent: true, wireframe: true, depthTest: false})
};

let styles: StringTMap<SelectionStyle> = {};
styles.default = {
  excluded: veryLight,
  unselected: original,
  hover: originalLightOverlay,
  selected: originalOverlay,
  ghost: redWireframe
};
styles.light = {
  excluded: hidden,
  unselected: light,
  hover: lightBlue,
  selected: mediumBlue,
  ghost: redWireframe
};
styles.wireframe = {
  excluded: hidden,
  unselected: blackWireframe,
  hover: lightBlueWithRedWireframe,
  selected: redWireframe,
  ghost: redWireframe
};


export interface THREESelectedObject extends THREE.Object3D {
  __selectGhost?: THREESelectionGhost;
}

export interface THREESelectionGhost extends THREE.LineSegments {
  __isGhost: boolean;
}

export type ThreeSelectionTypes = 'select' | 'add' | 'remove';

export class ThreeSelectionTool extends ThreeTool {

  public name = 'select';

  // select: set the selected objects to "all" objects intersecting the cursor
  // add: add the objects intersecting the cursor to the current selection list
  // remove: remove the objects intersecting the cursor to the current selection list
  // first: set the selected objects to the first object intersecting the cursor
  public type: ThreeSelectionTypes = 'add'; 
  public rootObject: THREE.Object3D;
  public selectableObjects: THREE.Object3D[];
  public objects: Array<THREESelectedObject> = [];

  private subscriptions: Array<Subscription> = [];

  private style: SelectionStyle = styles.default;

  private keydowns: {[type: number]: boolean} = {};

  public onActivate() {
    if (!this.three) {
      throw new Error('Cannot activate selection tool without a three property');
    }
    let ea = Container.instance.get(EventAggregator);
    this.subscriptions.push(ea.subscribe('three-cursor:leave', () => {
      this.handleCursor('hover', []);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:hover', (data: (THREE.Intersection & {event: MouseEvent})[]) => {
      this.handleCursor('hover', data);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:click', (data: (THREE.Intersection & {event: MouseEvent})[]) => {
      this.handleCursor('click', data);
    }));
    this.rootObject = this.three.getScene();
    this.setRootStyles();
    document.addEventListener('keydown', this);
    document.addEventListener('keyup', this);
  }

  public onDeactivate() {
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
    document.removeEventListener('keydown', this);
    document.removeEventListener('keyup', this);
  }

  public handleEvent(event: KeyboardEvent) {
    if (event.keyCode === 16) {
      this.keydowns[event.keyCode] = event.type === 'keydown';
    }
  }

  public setStyle(style: string) {
    if (styles[style]) {
      this.style = styles[style];
      if (this.active) {
        this.rootObject.children.forEach((obj) => {
          this.applySelectionStyle(obj, this.style, 'auto', true);
        });
      }
    }
  }

  public setRootStyles() {
    if (!this.three || !this.three.getScene()) {
      return;
    }
    this.clearSelectionStyle();
    this.three.getScene().children.forEach((obj) => {
      this.applySelectionStyle(obj, this.style, 'excluded');
    });
    this.rootObject.children.forEach((obj) => {
      this.applySelectionStyle(obj, this.style, 'unselected');
    });
  }

  public clearSelectionStyle() {
    if (!this.three || this.three.getScene()) {
      return;
    }
    this.three.getScene().traverse((obj) => {
      const o: any = obj;
      if (o.__selectToolOriginalMaterial) o.material = o.__selectToolOriginalMaterial;
      o.__selectToolOriginalMaterial = undefined;
      let wireframe = obj.getObjectByName(`${obj.uuid}-wireframe`);
      if (wireframe) obj.remove(wireframe);
      let overlay = obj.getObjectByName(`${obj.uuid}-overlay`);
      if (overlay) obj.remove(overlay);
    });
  }

  public applySelectionStyle(object: THREE.Object3D, style: SelectionStyle, type: 'excluded' | 'unselected' | 'hover' | 'selected' | 'ghost' | 'auto', force: boolean = false) {
    object.traverse((obj) => {
      if (obj instanceof THREE.Camera) return;
      if (obj instanceof THREE.Light) return;
      if (obj.userData.__isWireframe) return;
      if (obj.userData.__isOverlay) return;
      const o: any = obj;
      let objType = type;
      if (o.__currentSelectStyleType === objType && !force) return; // do not style again because style type is identical and did not require to force restyling
      if (objType === 'auto') objType = o.__currentSelectStyleType || 'unselected';
      if (o.material && !o.__selectToolOriginalMaterial) {
        o.__selectToolOriginalMaterial = o.material;
      }
      let sMaterial = style[objType].material === 'original' ? o.__selectToolOriginalMaterial : style[objType].material;
      let sWireframe = style[objType].wireframe;
      let sOverlay = style[objType].overlay;
      if (o.material) {
        o.material = sMaterial;
        let wireframe = obj.getObjectByName(`${obj.uuid}-wireframe`);
        if (sWireframe && o.geometry) {
          if (!wireframe) {
            wireframe = new THREE.Mesh(o.geometry, sWireframe);
            wireframe.name = `${obj.uuid}-wireframe`;
            wireframe.userData.__isWireframe = true;
            wireframe.userData.__isOverlay = true;
            obj.add(wireframe);
          } else if (wireframe instanceof THREE.Mesh) {
            wireframe.material = sWireframe;
          }
        } else if (wireframe) {
          obj.remove(wireframe);
        }
        let overlay = obj.getObjectByName(`${obj.uuid}-overlay`);
        if (sOverlay && o.geometry) {
          if (!overlay) {
            overlay = new THREE.Mesh(o.geometry, sOverlay);
            overlay.name = `${obj.uuid}-overlay`;
            overlay.userData.__isOverlay = true;
            obj.add(overlay);
          } else if (overlay instanceof THREE.Mesh) {
            overlay.material = sOverlay;
          }
        } else if (overlay) {
          obj.remove(overlay);
        }
      }
      o.__currentSelectStyleType = objType;
    });
  }

  @computedFrom('rootObject', 'three')
  get isRoot(): boolean {
    if (!this.three) return false;
    if (!this.rootObject) return false;
    return this.rootObject === this.three.getScene();
  }

  public all(type?: ThreeSelectionTypes) {
    this.service.activate(this);
    this.setSelectedObjects(this.rootObject.children.filter((item) => {
      if (item instanceof THREE.Camera) return false;
      if (item instanceof THREE.Light) return false;
      return true;
    }));
    if (type) {
      this.type = type;
    }
  }
  
  public none(type?: ThreeSelectionTypes) {
    if (!this.three) return false;
    this.setSelectedObjects([]);
    this.rootObject = this.three.getScene();
    this.setRootStyles();
    if (type) {
      this.type = type;
    }
  }

  @computedFrom('objects', 'objects.length')
  get selectionHasChildren(): boolean {
    if (!this.objects) return false;
    if (this.objects.length === 0) return false;
    return this.getFirstObjectWithChildren() !== null;
  }

  getFirstObjectWithChildren() {
    if (!this.objects) return null;
    if (this.objects.length === 0) return null;
    for (let object of this.objects) {
      for (let child of object.children || []) {
        if (child instanceof THREE.Camera) continue;
        if (child instanceof THREE.Light) continue;
        // const c: any = child;
        if (child.userData.__isOverlay) continue;
        if (child.userData.__isWireframe) continue;
        if (child.userData.__isGhost) continue;
        return object;
      }
    }
    return null;
  }

  public selectChildren() {
    let object = this.getFirstObjectWithChildren();
    this.rootObject = object;
    this.all();
    this.objects = [];
    this.setRootStyles();
  }

  public toggleType(type: 'add' | 'remove') {
    if (this.active && this.type === type) {
      this.service.deactivateAll();
    } else {
      this.setType(type);
    }
  }

  public setType(type: ThreeSelectionTypes = 'add') {
    log.debug('setType', type);
    this.service.activate(this);
    this.type = type;
  }

  public filterObjects?: (type: 'hover' | 'click', intersections: THREE.Intersection[]) => THREE.Intersection[];

  public handleCursor(type: 'hover' | 'click', intersections: THREE.Intersection[]) {
    if (!this.active) return;

    if (typeof this.filterObjects === 'function') {
      intersections = this.filterObjects(type, intersections);
    }

    if (type === 'hover') {
      // create a list of uuid for all intersected object and their parents
      let uuids: Array<string> = intersections.reduce((res, i) => {
        let o = i.object;
        do {
          res.push(o.uuid);
          o = o.parent;
        } while (o);
        return res;
      }, []);

      this.rootObject.children.forEach((obj) => {
        if (obj instanceof THREE.Camera) return;
        if (obj instanceof THREE.Light) return;
        const o: any = obj;
        if (uuids.indexOf(obj.uuid) !== -1) {
          // selectable object
          o.__currentSelectStyleType = 'hover';
        } else if (this.objects.indexOf(obj) !== -1) {
          // selected object
          o.__currentSelectStyleType = 'selected';
        } else {
          o.__currentSelectStyleType = 'unselected';
        }
        if (o.__currentSelectStyleType) {
          this.applySelectionStyle(obj, this.style, 'auto');
        }
      });
    }
    if (type === 'click') {
      // let objects = intersections.map(i => i.object);
      // because materials can be double sided, they can interact two times with a raycaster
      // therefore, here the objects list must be filtered to ensure we only have one occurence of object

      // create a list of uuid for all intersected object and their parents
      let uuids: Array<string> = intersections.reduce((res, i) => {
        let o = i.object;
        do {
          res.push(o.uuid);
          o = o.parent;
        } while (o);
        return res;
      }, []);

      let objectsAffectedByClick: THREE.Object3D[] = [];
      this.rootObject.children.forEach((obj) => {
        if (obj instanceof THREE.Camera) return;
        if (obj instanceof THREE.Light) return;
        if (uuids.indexOf(obj.uuid) !== -1) {
          // selectable object
          objectsAffectedByClick.push(obj);
        }
      });

      // let objects: Array<THREE.Object3D> = intersections.reduce((res: Array<THREE.Object3D>, item): Array<THREE.Object3D> => {
      //   let obj = item.object;
      //   if (res.indexOf(obj) === -1) res.push(obj);
      //   return res;
      // }, []);

      let selectType: ThreeSelectionTypes = this.type;
      if (this.keydowns[16] && selectType === 'select') {
        selectType = 'add';
      }

      if (selectType === 'select') {
        if (objectsAffectedByClick.length === 0) return;
        this.setSelectedObjects(objectsAffectedByClick)
      } else if (selectType === 'add') {
        this.addObjectsToSelection(objectsAffectedByClick);
      } else if (selectType === 'remove') {
        this.removeObjectsFromSelection(objectsAffectedByClick);
      }
    }
  }

  private setSelectedObjects(objects: Array<THREE.Object3D>) {
    log.debug('setSelectedObjects', objects);
    for (let obj of this.objects) {
      // I dont' know why, but the next line is not usefull.
      // this.applySelectionStyle(obj, this.style, 'unselected');
    }
    for (let obj of objects) {
      this.applySelectionStyle(obj, this.style, 'selected');
      // this.createWireframe(obj);
    }
    this.objects = (objects as Array<THREESelectedObject>);
    let ea = Container.instance.get(EventAggregator);
    ea.publish('three-selection:changed', {
      type: 'set',
      objects: this.objects
    });
  }

  public addObjectsToSelection(objects: Array<THREE.Object3D>) {
    let objectsToAdd: Array<THREE.Object3D> = objects.filter(i => this.objects.indexOf(i) === -1);
    this.objects.push(...objectsToAdd);
    for (let obj of objectsToAdd) {
      this.applySelectionStyle(obj, this.style, 'selected', true);
      // this.createWireframe(obj);
    }
    let ea = Container.instance.get(EventAggregator);
    ea.publish('three-selection:changed', {
      type: 'add',
      objects: this.objects,
      added: objectsToAdd
    });
  }

  public removeObjectsFromSelection(objects: Array<THREE.Object3D>) {
    this.objects = this.objects.filter(i => objects.indexOf(i) === -1);
    for (let obj of objects) {
      this.applySelectionStyle(obj, this.style, 'unselected', true);
      // this.removeWireframe(obj);
    }
    let ea = Container.instance.get(EventAggregator);
    ea.publish('three-selection:changed', {
      type: 'add',
      objects: this.objects,
      added: objects
    });
  }

  // private createWireframe(object: THREE.Object3D) {
  //   object.traverse((obj) => {
  //     if (obj instanceof THREE.Mesh) {
  //       if ((obj as any).__selectGhost) return;
  //       let geometry = obj.geometry.clone();
  //       geometry.applyMatrix(obj.matrixWorld);
  //       let wireframe = new THREE.WireframeGeometry(geometry);
  //       let line = new THREE.LineSegments(wireframe, selectionMaterial);
  //       (line as any).__isGhost = true;
  //       (line as any).userData.preventClick = true;
  //       (line as any).userData.preventHover = true;
  //       this.three.getScene('overlay').add( line );
  //       (obj as any).__selectGhost = line;
  //       (window as any).line = line;
  //     }
  //   });
  // }

  // private removeWireframe(object: THREE.Object3D) {
  //   object.traverse((obj) => {
  //     if ((obj as any).__selectGhost) {
  //       this.three.getScene('overlay').remove( (obj as any).__selectGhost );
  //       delete (obj as any).__selectGhost;
  //     }
  //   });
  // }

  @computedFrom('objects', 'objects.length')
  get hasSelection(): boolean {
    if (!this.objects) return false;
    return this.objects.length !== 0;
  }

  get box(): THREE.Box3 {
    return ThreeUtils.bboxFromObjects(this.objects);
  }

  get center(): THREE.Vector3 {
    return ThreeUtils.centroidFromObjects(this.objects);
  }

  public clearSelectionStyles() {
    if (!this.three || !this.three.getScene()) {
      return;
    }
    const objToRemove: Array<THREE.Object3D> = [];
    this.three.getScene().traverse((object) => {
      delete (object as any).__selectToolOriginalMaterial;
      if (object.userData.__isWireframe) {
        objToRemove.push(object);
      }
    });
    for (let object of objToRemove) {
      this.three.getScene().remove(object);
    }
  }

  public applySelectionStyles() {
    if (!this.three || !this.three.getScene()) {
      return;
    }
    this.three.getScene().traverse((object) => {
      const selectedUuids = this.objects.map(o => o.uuid);
      if (selectedUuids.includes(object.uuid)) {
        this.applySelectionStyle(object, this.style, 'selected', true);
      } else if ((object as any).__currentSelectStyleType) {
        this.applySelectionStyle(object, this.style, (object as any).__currentSelectStyleType, true);
      }
    });
  }

  // public applySelectionStyles2() {
  //   if (!this.three || !this.three.getScene()) {
  //     return;
  //   }
  //   this.three.getScene().traverse((object) => {
  //     const selectedUuids = this.objects.map(o => o.uuid);
  //     if (selectedUuids.includes(object.uuid)) {
  //       this.applySelectionStyle(object, this.style, 'selected', true);
  //     } else if ((object as any).__currentSelectStyleType) {
  //       this.applySelectionStyle(object, this.style, (object as any).__currentSelectStyleType, true);
  //     }
  //   });
  // }

}
