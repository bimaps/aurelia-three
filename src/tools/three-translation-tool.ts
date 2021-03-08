import { ThreeSelectionTool, THREESelectedObject } from './three-selection-tool';
import { ThreeTool } from './three-tool';
import { StringTMap } from 'aurelia-resources';
import { PlanesIntersects, CursorPlanesIntersects } from '../components/three';
import { Logger, getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Container } from 'aurelia-framework';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
export class ThreeTranslationTool extends ThreeTool {

  public name = 'translate';  

  public translating: boolean = false;
  public axisConstraint: 'X' | 'Y' | 'Z' | 'XY' | 'XZ' | 'YZ' | null = null;
  public translateVector: THREE.Vector3 | null = null;

  private translationStart: PlanesIntersects | null = null;
  private objectsOriginalPositions: StringTMap<THREE.Vector3> = {};

  private overlayTool: THREE.Group;

  private subscriptions: Array<Subscription> = [];
  private log: Logger = getLogger('three-admin-translation');

  private select: ThreeSelectionTool;

  public activeTranslationTool() {
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
    this.displayTranslateOverlayTool();
    let ea = Container.instance.get(EventAggregator);
    this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', (data: THREE.Intersection[]) => {
      if (!this.active) return
      if (this.translating) return;
      for (let object of data.map(i => i.object)) {
        if (object.userData.axis) {
          return this.setConstraint(object.userData.axis);
        }
      }
      return this.setConstraint(null);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', (data: CursorPlanesIntersects) => {
      if (!this.active) return
      this.handlePlanesIntersects(data);
    }));
    this.subscriptions.push(ea.subscribe('three-camera:moved', () => {
      if (this.active) return
      this.adjustOverlayToolZoom();
    }));
  }

  public onDeactivate() {
    this.axisConstraint = null;
    this.hideTranslateOverlayTool();
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
  }

  public toggleTranslationTool() {
    if (this.active) {
      this.service.activate(this.select);
    } else {
      this.setConstraint(null);
    }
  }

  private setConstraint(constraint: 'X' | 'Y' | 'Z' | 'XY' | 'XZ' | 'YZ' | null) {
    if (!this.active) this.service.activate(this);
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
      this.objectsOriginalPositions = {};
      for (let obj of this.select.objects) {
        this.objectsOriginalPositions[obj.uuid] = obj.position.clone();
        if (obj.__selectGhost) {
          let ghost = obj.__selectGhost;
          this.objectsOriginalPositions[ghost.uuid] = ghost.position.clone();
        }
      }
      this.translationStart = data.intersects;
      this.translating = true;
      this.three.navigation.controls.enablePan = false;
      this.three.navigation.controls.enableRotate = false;
    } else if (data.type === 'move' && this.translationStart && this.translating) {
      let tx: number = 0;
      let ty: number = 0;
      let tz: number = 0;

      let prop: 'xy' | 'xz' | 'yz';
      if (this.axisConstraint === 'X' || this.axisConstraint === 'Z' || this.axisConstraint === 'XZ') {
        prop = 'xz';
      } else if (this.axisConstraint === 'Y' || this.axisConstraint === 'YZ') {
        prop = 'yz';
      } else if (this.axisConstraint === 'XY') {
        prop = 'xy';
      }

      if (data.intersects[prop] !== null && this.translationStart[prop] !== null) {
        tx = data.intersects[prop].x - this.translationStart[prop].x;
        ty = data.intersects[prop].y - this.translationStart[prop].y;
        tz = data.intersects[prop].z - this.translationStart[prop].z;
      }

      let fullTranslateVector = new THREE.Vector3(tx, ty, tz);
      let constraintsTranslateVector: THREE.Vector3;
      if (this.axisConstraint === 'X') {
        constraintsTranslateVector = fullTranslateVector.clone().setY(0).setZ(0);
      } else if (this.axisConstraint === 'Y') {
        constraintsTranslateVector = fullTranslateVector.clone().setX(0).setZ(0);
      } else if (this.axisConstraint === 'Z') {
        constraintsTranslateVector = fullTranslateVector.clone().setX(0).setY(0);
      } else if (this.axisConstraint === 'XY') {
        constraintsTranslateVector = fullTranslateVector.clone().setZ(0);
      } else if (this.axisConstraint === 'XZ') {
        constraintsTranslateVector = fullTranslateVector.clone().setY(0);
      } else if (this.axisConstraint === 'YZ') {
        constraintsTranslateVector = fullTranslateVector.clone().setX(0);
      }
      this.translateVector = constraintsTranslateVector;
      for (let obj of this.select.objects) {
        let newPosition = this.objectsOriginalPositions[obj.uuid].clone().add(constraintsTranslateVector);
        obj.position.set(newPosition.x, newPosition.y, newPosition.z);
        this.updateGhostPosition(obj, constraintsTranslateVector);
      }
      this.adjustOverlayToolPosition();
    } else if (data.type === 'up') {
      this.translationStart = null;
      this.translateVector = null;
      this.translating = false;
      this.three.navigation.controls.enablePan = true;
      this.three.navigation.controls.enableRotate = true;
    }
  }

  private updateGhostPosition(object: THREESelectedObject, vector: THREE.Vector3) {
    if (object.__selectGhost) {
      let ghost = object.__selectGhost;
      let newPosition = this.objectsOriginalPositions[ghost.uuid].clone().add(vector);
      ghost.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  }

  private displayTranslateOverlayTool() {
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

  private hideTranslateOverlayTool() {
    if (!this.overlayTool || !this.overlayTool.userData.displayed) return;
    this.three.getScene('tools').remove(this.overlayTool);
    this.overlayTool.userData.displayed = false;
  }

  private createOverlayTool() {
    let group = new THREE.Group();
    let xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 0, 0)
    );
    let yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 10, 0)
    );
    let zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 10)
    );
    let xLine = new THREE.Line(xLineGeometry, new THREE.LineBasicMaterial({color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    let yLine = new THREE.Line(yLineGeometry, new THREE.LineBasicMaterial({color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    let zLine = new THREE.Line(zLineGeometry, new THREE.LineBasicMaterial({color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide}));

    let xConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
    let xCone = new THREE.Mesh(xConeGeometry, new THREE.MeshBasicMaterial({color: 'red', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    xCone.rotateOnAxis(new THREE.Vector3(0, 0, 1), -90 / 180 * Math.PI);
    xCone.translateY(10);

    let yConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
    let yCone = new THREE.Mesh(yConeGeometry, new THREE.MeshBasicMaterial({color: 'green', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    yCone.translateY(10);

    let zConeGeometry = new THREE.ConeGeometry(0.4, 1.2);
    let zCone = new THREE.Mesh(zConeGeometry, new THREE.MeshBasicMaterial({color: 'blue', opacity: 0.5, transparent: true, side: THREE.FrontSide}));
    zCone.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 / 180 * Math.PI);
    zCone.translateY(10);    

    let xzPlaneGeometry = new THREE.PlaneGeometry(5, 5);
    let xzPlaneMaterial = new THREE.MeshBasicMaterial({color: '#f0f', opacity: 0.5, transparent: true, side: THREE.DoubleSide});
    let xzPlane = new THREE.Mesh(xzPlaneGeometry, xzPlaneMaterial);
    xzPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);
    xzPlane.translateX(2.5).translateY(-2.5);

    let xyPlaneGeometry = new THREE.PlaneGeometry(5, 5);
    let xyPlaneMaterial = new THREE.MeshBasicMaterial({color: '#ff0', opacity: 0.5, transparent: true, side: THREE.DoubleSide});
    let xyPlane = new THREE.Mesh(xyPlaneGeometry, xyPlaneMaterial);
    xyPlane.translateX(2.5).translateY(2.5);

    let yzPlaneGeometry = new THREE.PlaneGeometry(5, 5);
    let yzPlaneMaterial = new THREE.MeshBasicMaterial({color: '#0ff', opacity: 0.5, transparent: true, side: THREE.DoubleSide});
    let yzPlane = new THREE.Mesh(yzPlaneGeometry, yzPlaneMaterial);
    yzPlane.rotateOnAxis(new THREE.Vector3(0, 1, 0), -90 / 180 * Math.PI);
    yzPlane.translateX(2.5).translateY(2.5);

    xLine.userData = {axis: 'X'};
    yLine.userData = {axis: 'Y'};
    zLine.userData = {axis: 'Z'};
    xCone.userData = {axis: 'X'};
    yCone.userData = {axis: 'Y'};
    zCone.userData = {axis: 'Z'};
    xzPlane.userData = {axis: 'XZ'};
    xyPlane.userData = {axis: 'XY'};
    yzPlane.userData = {axis: 'YZ'};

    group.add(xLine);
    group.add(yLine);
    group.add(zLine);
    group.add(xCone);
    group.add(yCone);
    group.add(zCone);
    group.add(xzPlane);
    group.add(xyPlane);
    group.add(yzPlane);

    // let p = this.select.center;
    // group.position.set(p.x, p.y, p.z);
    group.name = '__translate-tools__';
    let groupContainer = new THREE.Group;
    groupContainer.name = '__translate-tools-container__';
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
    let p = this.select.center;
    this.overlayTool.position.set(p.x, p.y, p.z);
  }

  private adjustOverlayToolZoom() {
    if (!this.overlayTool) return;
    let camera = this.three.getCamera();
    if (camera instanceof THREE.OrthographicCamera) {
      let cameraZoom = camera.zoom;
      let tool = this.overlayTool.getObjectByName('__translate-tools__');
      tool.scale.setScalar(10 / cameraZoom);
    }
  }

  private adjustActiveTool() {
    if (!this.overlayTool) return;
    let tool = this.overlayTool.getObjectByName('__translate-tools__');
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
