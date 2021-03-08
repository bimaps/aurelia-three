import { PointCloudOctree } from '@pnext/three-loader';
import {inject, bindable} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
import * as THREE from 'three';
import { DOM } from 'aurelia-pal';

@inject(Element)
export class ThreeObjectList {    

  private log: Logger;
  @bindable public objects: Array<THREE.Object3D> = [];
  @bindable public q: string = '';
  @bindable public limit: number = 10;
  private showAll: boolean = false;
  
  constructor(private element: Element) {
    this.log = getLogger('comp:three-object-list');
  }

  toggleObject(object: THREE.Object3D, event) {
    if (event.stopPropagation) event.stopPropagation();
    const o: any = object;
    if (Array.isArray(object.children) && object.children.length) {
      o.__list_opened = !o.__list_opened;
    } else {
      o.__list_opened = false;
    }
  }

  toggleVisible(object: THREE.Object3D, event) {
    if (event.stopPropagation) event.stopPropagation();
    object.visible = !object.visible;
  }

  selectObject(object: THREE.Object3D, event) {
    if (event.stopPropagation) event.stopPropagation();
    let eventDetail = object;
    this.element.dispatchEvent(DOM.createCustomEvent('select-object', {detail: eventDetail, bubbles: true}));
  }

  isCamera(object: THREE.Object3D):boolean {
    return object instanceof THREE.Camera;
  }

  isLight(object: THREE.Object3D):boolean {
    return object instanceof THREE.Light;
  }

  isGroup(object: THREE.Object3D):boolean {
    return object instanceof THREE.Group;
  }

  isMesh(object: THREE.Object3D):boolean {
    return object instanceof THREE.Mesh;
  }

  isGeometry(object: THREE.Object3D):boolean {
    return object instanceof THREE.Geometry;
  }

  isPointClouds(object: THREE.Object3D): boolean {
    return object instanceof PointCloudOctree;
  }

  isObject(object: THREE.Object3D):boolean {
    return !this.isCamera(object) &&
              !this.isLight(object) &&
              !this.isGroup(object) &&
              !this.isMesh(object) &&
              !this.isPointClouds(object) &&
              !this.isGeometry(object);
  }
}

export class FilterObjectListValueConverter {
  toView(list: Array<THREE.Object3D>, q: string, limit: number = 10, showAll: boolean = false): Array<THREE.Object3D> {
    if (!q && (list.length < limit || showAll)) return list;

    let newList: Array<THREE.Object3D> = [];
    let terms = q ? q.toLowerCase().split(' ') : [];
    itemLoop: for (let item of list) {
      if (!q) {newList.push(item); continue itemLoop;}
      for (let term of terms) {
        if (item.name && item.name.toLowerCase().indexOf(term) !== -1) {newList.push(item); continue itemLoop;}
        if (item.uuid.toLowerCase().indexOf(term) !== -1) {newList.push(item); continue itemLoop;}
        if (item.type.toLowerCase().indexOf(term) !== -1) {newList.push(item); continue itemLoop;}
        for (let key in item.userData || {}) {
          let value = item.userData[key];
          if (typeof value === 'string' && value.toLowerCase().indexOf(term) !== -1) {newList.push(item); continue itemLoop;}
        }
      }
    }

    if (!q && !showAll && newList.length > limit) {
      newList = newList.slice(0, limit);
    }

    return newList;
  }
}
