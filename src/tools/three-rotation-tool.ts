import { ThreeSelectionTool, THREESelectedObject } from './three-selection-tool';
import { ThreeTool } from './three-tool';
import { StringTMap } from 'aurelia-resources';
import { PlanesIntersects, CursorPlanesIntersects } from '../components/three';
import { Logger, getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Container, TaskQueue } from 'aurelia-framework';
import { ThreeUtils } from '../helpers/three-utils';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
export class ThreeRotationTool extends ThreeTool {

  public name = 'rotate';

  public rotating: boolean = false;
  public axisConstraint: 'X' | 'Y' | 'Z';
  public rotationAngle: number | null;

  private rotationCentroid: THREE.Vector3;
  private rotationStart: PlanesIntersects | null = null;
  private objectsOriginalMatrixes: StringTMap<THREE.Matrix4> = {};
  private objectsOriginalPositions: StringTMap<THREE.Vector3> = {};
  private objectsOriginalRotations: StringTMap<THREE.Euler> = {};

  private overlayTool: THREE.Group;

  private subscriptions: Array<Subscription> = [];
  private log: Logger = getLogger('three-admin-rotation');

  private select: ThreeSelectionTool;

  public rotate90Ground() {
    this.rotate(90, 'Y', 'degree');
  }

  public rotate(angle: number, plane: 'X' | 'Y' | 'Z', unit: 'degree' | 'radian' = 'radian') {
    let axis: THREE.Vector3;
    if (plane === 'X') axis = new THREE.Vector3(1, 0, 0);
    if (plane === 'Y') axis = new THREE.Vector3(0, 1, 0);
    if (plane === 'Z') axis = new THREE.Vector3(0, 0, 1);
    angle = unit === 'radian' ? angle : angle / 180 * Math.PI;
    let boxCentroid = this.select.center.clone();
    for (let obj of this.select.objects) {
      this.rotateObjectAroundPoint(obj, boxCentroid, axis, angle);
    }
  }

  private rotateObjectAroundPoint(object: THREE.Object3D, point: THREE.Vector3, axis: THREE.Vector3, angle: number) {
    // first we translate the object towards the point
    let translation = object.position.clone().sub(point).projectOnPlane(axis);
    let p = object.position.clone();
    object.position.set(p.x - translation.x, p.y - translation.y, p.z - translation.z);
    object.rotateOnWorldAxis(axis, angle);
    let p2 = object.position.clone();
    let translation2 = translation.clone().applyAxisAngle(axis, angle);
    object.position.set(p2.x + translation2.x, p2.y + translation2.y, p2.z + translation2.z);
  }

  public activeRotationTool() {
    this.setConstraint(null);
  }

  public canRegister() {
    let selectTool = this.service.getRegisteredTool('select');
    return selectTool instanceof ThreeSelectionTool;
  }

  public onActivate() {
    let selectTool = this.service.getRegisteredTool('select');
    if (selectTool instanceof ThreeSelectionTool) {
      this.select = selectTool;
    } else {
      this.select = new ThreeSelectionTool(this.service);
      throw new Error('Translation tool requires the tool service to have the selection tool registered with `select` name');
    }
    if (!this.select.objects.length) return;
    this.rotationCentroid = this.select.center.clone();
    this.displayRotateOverlayTool();
    let ea = Container.instance.get(EventAggregator);
    this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', (data: THREE.Intersection[]) => {
      if (!this.active) return;
      if (this.rotating) return;
      for (let object of data.map(i => i.object)) {
        if (object.userData.axis) {
          return this.setConstraint(object.userData.axis);
        }
      }
      return this.setConstraint(null);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', (data: CursorPlanesIntersects) => {
      if (!this.active) return;
      this.handlePlanesIntersects(data);
    }));
    this.subscriptions.push(ea.subscribe('three-camera:moved', () => {
      if (!this.active) return;
      this.adjustOverlayToolZoom();
    }));
  }

  public onDeactivate() {
    this.hideRotateOverlayTool();
    this.axisConstraint = null;
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
  }

  public toggleRotationTool() {
    if (this.active) {
      this.service.activate(this.select);
    } else {
      this.setConstraint(null);
    }
  }

  private setConstraint(constraint: 'X' | 'Y' | 'Z' | null) {
    this.service.activate(this);
    if (constraint) {
      this.axisConstraint = constraint;
    } else {
      this.axisConstraint = null;
    }
    this.adjustActiveTool();
  }

  public handlePlanesIntersects(data: CursorPlanesIntersects) {
    if (!this.active) return;
    if (!this.axisConstraint) return;
    
    if (data.type === 'down') {
      // we prepare a potential translation
      // must be confirm after microtask resolve with a selected object clicked
      this.objectsOriginalMatrixes = {};
      for (let obj of this.select.objects) {
        this.objectsOriginalMatrixes[obj.uuid] = obj.matrix.clone();
        this.objectsOriginalPositions[obj.uuid] = obj.position.clone();
        this.objectsOriginalRotations[obj.uuid] = obj.rotation.clone();
        if (obj.__selectGhost) {
          let ghost = obj.__selectGhost;
          this.objectsOriginalMatrixes[ghost.uuid] = ghost.matrix.clone();
          this.objectsOriginalPositions[ghost.uuid] = ghost.position.clone();
          this.objectsOriginalRotations[ghost.uuid] = ghost.rotation.clone();
        }
      }
      this.rotationStart = data.intersects;
      // let bbox = ThreeUtils.bboxFromObjects(this.select.objects);
      // if (!bbox) return;
      // this.rotationCentroid = ThreeUtils.centroidFromBbox(bbox).clone();
      this.rotating = true;
      this.three.navigation.controls.enablePan = false;
      this.three.navigation.controls.enableRotate = false;
    } else if (data.type === 'move' && this.rotationStart && this.rotationCentroid && this.rotating) {

      let originalPoint: THREE.Vector3;
      let currentPoint: THREE.Vector3;
      let axis: THREE.Vector3;

      if (this.axisConstraint === 'X') {
        originalPoint = this.rotationStart['xz'] || this.rotationStart['xy'];
        currentPoint = data.intersects['xz'] || data.intersects['xy'];
        originalPoint.x = 0;
        currentPoint.x = 0;
        axis = new THREE.Vector3(1, 0, 0);
      }
      if (this.axisConstraint === 'Y') {
        originalPoint = this.rotationStart['yz'] || this.rotationStart['xy'];
        currentPoint = data.intersects['yz'] || data.intersects['xy'];
        originalPoint.y = 0;
        currentPoint.y = 0;
        axis = new THREE.Vector3(0, 1, 0);
      }
      if (this.axisConstraint === 'Z') {
        originalPoint = this.rotationStart['xz'] || this.rotationStart['xz'];
        currentPoint = data.intersects['xz'] || data.intersects['xz'];
        originalPoint.z = 0;
        currentPoint.z = 0;
        axis = new THREE.Vector3(0, 0, 1);
      }

      let direction1 = new THREE.Vector3().subVectors(originalPoint, this.rotationCentroid);
      let direction2 = new THREE.Vector3().subVectors(currentPoint, this.rotationCentroid);

      this.rotationAngle = direction2.angleTo(direction1);

      for (let obj of this.select.objects) {
        //obj.matrix = this.objectsOriginalMatrixes[obj.uuid];
        let p = this.objectsOriginalPositions[obj.uuid];
        let r = this.objectsOriginalRotations[obj.uuid];
        obj.position.set(p.x, p.y, p.z);
        obj.rotation.set(r.x, r.y, r.z, r.order);
        this.rotateObjectAroundPoint(obj, this.rotationCentroid, axis, this.rotationAngle);
      }
    } else if (data.type === 'up') {
      this.rotationStart = null;
      this.rotationCentroid = null;
      this.rotationAngle = null;
      this.rotating = false;
      this.three.navigation.controls.enablePan = true;
      this.three.navigation.controls.enableRotate = true;
    }
  }

  private updateGhostRotation(object: THREESelectedObject, vector: THREE.Vector3) {
    if (object.__selectGhost) {
      let ghost = object.__selectGhost;
      let newPosition = this.objectsOriginalPositions[ghost.uuid].clone().add(vector);
      ghost.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  }

  private displayRotateOverlayTool() {
    if (!this.overlayTool) {
      this.createOverlayTool();
    }
    if (this.overlayTool.userData.displayed) return;
    this.three.getScene('tools').add(this.overlayTool);
    this.overlayTool.userData.displayed = true;
    this.adjustOverlayToolPosition();
    this.adjustOverlayToolZoom();
    this.adjustActiveTool();
  }

  private hideRotateOverlayTool() {
    if (!this.overlayTool || !this.overlayTool.userData.displayed) return;
    this.three.getScene('tools').remove(this.overlayTool);
    this.overlayTool.userData.displayed = false;
  }

  private createOverlayTool() {
    let group = new THREE.Group();

    let xCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
    let xCurveGeometry = new THREE.BufferGeometry().setFromPoints(xCurve.getPoints(50));
    let xLine = new THREE.Line(xCurveGeometry, new THREE.LineBasicMaterial({color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    xLine.rotateOnAxis(new THREE.Vector3(0, 1, 0), -90 / 180 * Math.PI);

    let yCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
    let yCurveGeometry = new THREE.BufferGeometry().setFromPoints(yCurve.getPoints(50));
    let yLine = new THREE.Line(yCurveGeometry, new THREE.LineBasicMaterial({color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    yLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);

    let zCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
    let zCurveGeometry = new THREE.BufferGeometry().setFromPoints(zCurve.getPoints(50));
    let zLine = new THREE.Line(zCurveGeometry, new THREE.LineBasicMaterial({color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    
    xLine.userData = {axis: 'X'};
    yLine.userData = {axis: 'Y'};
    zLine.userData = {axis: 'Z'};

    group.add(xLine);
    group.add(yLine);
    group.add(zLine);

    group.name = '__rotate-tools__';
    let groupContainer = new THREE.Group;
    groupContainer.name = '__rotate-tools-container__';
    groupContainer.add(group);
    groupContainer.traverse((obj) => {
      obj.renderOrder = 10;
      if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line) && (obj.material instanceof THREE.MeshBasicMaterial || obj.material instanceof THREE.LineBasicMaterial)) {
        obj.material.depthTest = false;
      }
    });
    this.overlayTool = groupContainer;
    this.adjustOverlayToolZoom();
  }

  private adjustOverlayToolPosition() {
    if (!this.rotationCentroid) return;
    if (!this.overlayTool) return;
    let p = this.rotationCentroid;
    this.overlayTool.position.set(p.x, p.y, p.z);
  }

  private adjustOverlayToolZoom() {
    if (!this.overlayTool) return;
    let camera = this.three.getCamera();
    if (camera instanceof THREE.OrthographicCamera) {
      let cameraZoom = camera.zoom;
      let tool = this.overlayTool.getObjectByName('__rotate-tools__');
      tool.scale.setScalar(10 / cameraZoom);
    }
  }

  private adjustActiveTool() {
    if (!this.overlayTool) return;
    let tool = this.overlayTool.getObjectByName('__rotate-tools__');
    tool.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        let material = obj.material as THREE.Material;
        if (!this.axisConstraint) material.opacity = 0.5;
        else {
          if (obj.userData.axis === this.axisConstraint) material.opacity = 1;
          else material.opacity = 0.1;
        }
      }
    })
  }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj: THREE.Object3D, point: THREE.Vector3, axis: THREE.Vector3, theta: number, pointIsWorld: boolean){
  pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

  if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
