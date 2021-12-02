import * as THREE from 'three';
import { StringTMap } from 'aurelia-resources';

export class ThreeGeometry {
  private static registered: StringTMap<() => THREE.BufferGeometry> = {};
  private static inited: boolean = false;
  private static init() {
    if (ThreeGeometry.inited) {
      return;
    }
    ThreeGeometry.register('cone', () => {
      return new THREE.ConeGeometry(20, 80, 32);
    });
    ThreeGeometry.register('cube', () => {
      let translation = new THREE.Matrix4().makeTranslation(10, 10, 10);
      return new THREE.BoxGeometry( 20, 20, 20 ).applyMatrix4(translation);
    });
    ThreeGeometry.register('sphere', () => {
      return  new THREE.SphereGeometry( 20, 32, 32 );
    });
    ThreeGeometry.register('cylinder', () => {
      return  new THREE.CylinderGeometry( 20, 20, 20, 32 );
    });
    ThreeGeometry.inited = true;
  }

  public static register(name: string, callback: () => THREE.BufferGeometry) {
    ThreeGeometry.registered[name] = callback;
  }

  public static get(name: string, context: any = null, ...params: any[]): THREE.BufferGeometry {
    ThreeGeometry.init();
    if (!ThreeGeometry.registered[name]) return null;
    return ThreeGeometry.registered[name].call(context, ...params);
  }

}
