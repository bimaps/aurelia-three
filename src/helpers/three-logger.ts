import { ThreeCustomElement } from './../components/three';
import * as THREE from 'three';

export class ThreeLogger {

  public log: boolean = false;

  constructor(private three: ThreeCustomElement) {

  }

  public logPoints(points: THREE.Vector3 | THREE.Vector3[] | null, name: string, color: string, timeout: number = 0) {
    if (!this.log) {
      return;
    }
    const original = this.three.getScene('tools').getObjectByName(name);
    if (original) {
      this.three.getScene('tools').remove(original);
    }
    if (points === null) {
      return;
    }
    const group = new THREE.Group();
    const allPoints = Array.isArray(points) ? points : [points];
    for (let point of allPoints) {
      const geometry = new THREE.SphereBufferGeometry(0.2);
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: color, depthTest: false}));
      mesh.renderOrder = 10;
      mesh.position.set(point.x, point.y, point.z);
      group.add(mesh);
    }
    group.name = name;
    this.three.getScene('tools').add(group);
    if (timeout) {
      setTimeout(() => {
        this.logPoints(null, name, '');
      }, timeout)
    }
  }

  public logAxis(axis: THREE.Vector3 | null, name: string, color: string, timeout: number = 0) {
    if (!this.log) {
      return;
    }
    const original = this.three.getScene('tools').getObjectByName(name);
    if (original) {
      this.three.getScene('tools').remove(original);
    }
    if (axis === null) {
      return;
    }
    const p1 = axis.clone().multiplyScalar(20);
    const p2 = p1.clone().negate();
    const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color, depthTest: false}));
    mesh.name = name;
    mesh.renderOrder = 10;
    this.three.getScene('tools').add(mesh);
    if (timeout) {
      setTimeout(() => {
        this.logAxis(null, name, '');
      }, timeout)
    }
  }

  public logPlane(plane: THREE.Plane | null, name, color, timeout = 0) {
    if (!this.log) {
      return;
    }
    const original = this.three.getScene('tools').getObjectByName(name);
    if (original) {
      this.three.getScene('tools').remove(original);
    }
    if (plane === null) {
      return;
    }
    const planeHelper = new THREE.PlaneHelper(plane, 15);
    (planeHelper.material as THREE.MeshBasicMaterial).color = new THREE.Color(color);
    planeHelper.name = name;
    planeHelper.renderOrder = 10;
    this.three.getScene('tools').add(planeHelper);
    if (timeout) {
      setTimeout(() => {
        this.logPlane(null, name, '');
      }, timeout)
    }
  }

}
