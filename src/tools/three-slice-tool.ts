import { ThreeToolsService } from './three-tools-service';
import { ThreeLogger } from './../helpers/three-logger';
import { ThreeUtils } from './../helpers/three-utils';
import { SlicePathComposer } from '../helpers/slice-path-composer';
import { ThreeTool } from './three-tool';
import { Container } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { getLogger } from 'aurelia-logging';
import { PlanesIntersects, CursorPlanesIntersects } from '../components/three';
import * as THREE from 'three';

const log = getLogger('three-slice-tool');
let logThree: ThreeLogger;
// in order to successfuly manage the clipping plane
// we will need to handle ourselves:
// - the plane position (center of rotation)
// - its normal axis (from this position)
// and then compute the world plane with normal + constant from these values

export class ThreeSliceTool extends ThreeTool {

  // public properties for configuration
  public closureMaterial: THREE.Material = new THREE.MeshBasicMaterial({color: '#79007A', side: THREE.DoubleSide});
  public offsetClosureFromPlane = 0.01;
  public multiplier = 10000;
  public refNormal: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  public xProp = 'x';
  public yProp = 'y';

  public showSliceTranslation = true;
  public showSliceYRotation = true;
  public showSliceZRotation = false;
  public showPlaneHelper = true;

  public name = 'slice';

  private subscriptions: Array<Subscription> = [];
  private overlayTool: THREE.Group;
  private overlayPlane: THREE.PlaneHelper;
  private planeHelper: THREE.Line;
  private toolPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private toolOrientation: THREE.Vector3 = new THREE.Vector3(1, 0, 0);

  private plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(1, 0, 0));
  private constraint: 'normal' | 'z' | 'y' | null = null;
  private movePlaneRef = new THREE.Vector3(1, 0, 0);

  constructor(service: ThreeToolsService) {
    super(service);
    logThree = new ThreeLogger(service.three);
    logThree.log = false;
    this.three = service.three;
  }
  
  public onActivate() {
    if (!this.isSlicing) {
      this.setPlane('X');
    }
    this.setPlaneFromTool();
    this.toggleSlicing(true);
    let ea = Container.instance.get(EventAggregator);
    this.subscriptions.push(ea.subscribe('three-cursor:hover-tools', (data: THREE.Intersection[]) => {
      if (data[0] && data[0].object.name === 'slice-plane-helper') {
        log.debug('hover plane helper');
        (this.planeHelper.material as THREE.LineBasicMaterial).opacity = 1;
      } else {
        (this.planeHelper.material as THREE.LineBasicMaterial).opacity = 0.5;
      }
      if (!this.active) return;
      if (this.movingPlane) return;
      for (let object of data.map(i => i.object)) {
        if (object.userData.constraint) {
          return this.setConstraint(object.userData.constraint);
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
      this.adjustOverlayToolPosition();
      this.adjustOverlayToolZoom();
    }));
    this.displaySliceOverlayPlane();
    this.displaySliceOverlayTool();
    this.generateClosures();
  }

  public onDeactivate() {
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
    this.hideSliceOverlayPlane();
    this.hideSliceOverlayTool();
  }

  public toggleSliceTool() {
    if (this.active) {
      this.service.deactivateAll();
    } else {
      this.service.activate(this);
    }
  }

  public isSlicing: boolean = false;
  public toggleSlicing(value?: boolean) {
    const renderer = this.three.getRenderer() as THREE.WebGLRenderer;
    if (renderer instanceof THREE.WebGLRenderer) {
      this.isSlicing = value !== undefined ? value : !this.isSlicing;
      if (this.isSlicing) {
        renderer.clippingPlanes = [this.plane];
      } else {
        renderer.clippingPlanes = [];
        this.hideClosures();
      }
    } else {
      this.isSlicing = false;
      this.hideClosures();
    }
  }

  private setConstraint(constraint: 'normal' | 'z' | 'y' | null) {
    if (!this.active) this.service.activate(this);
    if (constraint) {
      this.constraint = constraint;
    } else {
      this.constraint = null;
    }
    this.adjustActiveTool();
  }

  public setPlane(plane: 'X' | 'Y' | 'Z' | THREE.Plane) {
    log.debug('setPlane', plane);
    this.hideClosures();
    
    
    // this.toolPosition.set(0, 0, 0);
    let normal: THREE.Vector3;
    if (plane === 'X') normal = new THREE.Vector3(1, 0, 0);
    if (plane === 'Y') normal = new THREE.Vector3(0, 1, 0);
    if (plane === 'Z') normal = new THREE.Vector3(0, 0, 1);
    
    if (plane instanceof THREE.Plane) {
      normal = plane.normal;
      const position = plane.normal.clone().setLength(plane.constant);
      log.debug('normal', normal);
      log.debug('position', position);
      this.toolPosition.set(position.x, position.y, position.z);
    } else {
      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.three.getCamera().quaternion);
      const normalProjected = normal.clone().projectOnVector(cameraDirection).normalize();
      
      if (normalProjected.angleTo(cameraDirection) > 0.1) {
        normal.negate();
      }
      const position = ThreeUtils.centroidFromBbox(this.three.objects.getBbox());
      const projectedPosition = position.projectOnVector(normal);
      this.toolPosition.set(projectedPosition.x, projectedPosition.y, projectedPosition.z);
    }

    this.toolOrientation.set(normal.x, normal.y, normal.z);
    
    this.setPlaneFromTool();
    this.adjustOverlayToolPosition();
    this.adjustOverlayToolZoom();
    this.generateClosures();
  }

  public revertPlane() {
    this.hideClosures();
    const normal = this.toolOrientation.clone().negate();
    this.toolOrientation.set(normal.x, normal.y, normal.z);
    this.setPlaneFromTool();
    this.adjustOverlayToolPosition();
    this.adjustOverlayToolZoom();
    this.generateClosures();
  }

  public clearSlicing() {

  }

  private setPlaneFromTool() {
    if (this.toolOrientation.length() !== 1) {
      this.toolOrientation.normalize();
    }
    const project = this.toolPosition.clone().projectOnVector(this.toolOrientation);
    let constant = 0;
    if (project.length() !== 0) {
      const angle = project.angleTo(this.toolOrientation);
      constant = (angle > 0.1) ? project.length() : project.length() * -1;
    }
    this.plane.normal.set(this.toolOrientation.x, this.toolOrientation.y, this.toolOrientation.z);
    this.plane.constant = constant;
  }

  private movingPlane: boolean = false;
  private movingStart: PlanesIntersects | null = null;
  private originalPosition: THREE.Vector3 | null = null;
  private originalOrientation: THREE.Vector3 | null = null;
  private originalQuaternion: THREE.Quaternion | null = null;
  private originalMouse: THREE.Vector2 | null = null;
  private yPlane: THREE.Plane | null = null;
  private zPlane: THREE.Plane | null = null;
  private originalPlanePoint: THREE.Vector3 | null = null;
  private originalYPoint: THREE.Vector3 | null = null;
  private originalZPoint: THREE.Vector3 | null = null;

  public handlePlanesIntersects(data: CursorPlanesIntersects) {
    if (!this.active) return;
    if (!this.constraint) return;
    
    if (data.type === 'down') {
      this.three.navigation.controls.enablePan = false;
      this.three.navigation.controls.enableRotate = false;
      this.movingPlane = true;
      this.movingStart = data.intersects;
      this.originalPosition = this.toolPosition.clone()
      this.originalOrientation = this.toolOrientation.clone();
      this.originalQuaternion = new THREE.Quaternion().setFromUnitVectors(this.movePlaneRef, this.toolOrientation);
      this.originalMouse = data.mouse.clone();

      const yPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
      const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
      
      const matrix = new THREE.Matrix4().makeRotationFromQuaternion(this.originalQuaternion);
      yPlane.normal.applyMatrix4(matrix);
      zPlane.normal.applyMatrix4(matrix);
      this.yPlane = yPlane;
      this.zPlane = zPlane;

      logThree.logPlane(this.yPlane, 'y-plane', 'red', 3000);
      logThree.logPlane(this.zPlane, 'z-plane', 'green', 3000);

      const ray: THREE.Raycaster = new THREE.Raycaster();
      ray.setFromCamera(this.originalMouse, this.three.getCamera());
      this.originalPlanePoint = ray.ray.intersectPlane(new THREE.Plane(this.three.getCamera().getWorldDirection(new THREE.Vector3())), new THREE.Vector3());
      this.originalYPoint = ray.ray.intersectPlane(yPlane, new THREE.Vector3());
      this.originalZPoint = ray.ray.intersectPlane(zPlane, new THREE.Vector3());

      logThree.logPoints(this.originalYPoint, 'original-y', 'red');
      logThree.logPoints(this.originalZPoint, 'original-z', 'green');
      
      this.hideClosures();
    } else if (data.type === 'move' && this.movingStart && this.movingPlane) {
      const ray: THREE.Raycaster = new THREE.Raycaster();
      ray.setFromCamera(data.mouse, this.three.getCamera());
      if (this.constraint === 'normal') {
        const currentPoint = ray.ray.intersectPlane(new THREE.Plane(this.three.getCamera().getWorldDirection(new THREE.Vector3())), new THREE.Vector3());
        const translation = currentPoint && this.originalPlanePoint 
          ? new THREE.Vector3().subVectors(currentPoint, this.originalPlanePoint).projectOnVector(this.toolOrientation) : new THREE.Vector3(0, 0, 0);
        if (translation.length()) {
          const newPosition = this.originalPosition.clone().add(translation);
          this.toolPosition.set(newPosition.x, newPosition.y, newPosition.z);
          this.setPlaneFromTool();
          this.adjustOverlayToolPosition();
        }
      }
      if (this.constraint === 'z') { // green
        const currentZPoint = ray.ray.intersectPlane(this.zPlane, new THREE.Vector3());
        logThree.logPoints(currentZPoint, 'current-z', 'green');
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(this.originalZPoint.clone().sub(this.originalPosition).normalize(), currentZPoint.clone().sub(this.originalPosition).normalize());
        const matrix = new THREE.Matrix4();
        matrix.makeRotationFromQuaternion(quat);
        this.toolOrientation = this.originalOrientation.clone().applyMatrix4(matrix);
        this.setPlaneFromTool();
        this.adjustOverlayToolPosition();
      }
      if (this.constraint === 'y') { // red
        const currentYPoint = ray.ray.intersectPlane(this.yPlane, new THREE.Vector3());
        logThree.logPoints(currentYPoint, 'current-z', 'green');
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(this.originalYPoint.clone().sub(this.originalPosition).normalize(), currentYPoint.clone().sub(this.originalPosition).normalize());
        const matrix = new THREE.Matrix4();
        matrix.makeRotationFromQuaternion(quat);
        this.toolOrientation = this.originalOrientation.clone().applyMatrix4(matrix);
        this.setPlaneFromTool();
        this.adjustOverlayToolPosition();
      }

    } else if (data.type === 'up') {
      this.movingPlane = null;
      this.movingStart = null;
      this.originalPosition = null;
      this.originalOrientation = null;
      this.originalQuaternion = null;
      this.originalMouse = null;
      this.yPlane = null;
      this.zPlane = null;
      this.originalPlanePoint = null;
      this.originalYPoint = null;
      this.originalZPoint = null;

      logThree.logPlane(null, 'y-plane', 'red');
      logThree.logPlane(null, 'z-plane', 'green');

      this.three.navigation.controls.enablePan = true;
      this.three.navigation.controls.enableRotate = true;
      this.generateClosures();
    }
  }

  private hideClosures() {
    const objToRemove: THREE.Object3D[] = [];
    this.three.getScene().traverse((obj) => {
      if (obj.userData.__isSliceClosure) {
        objToRemove.push(obj);
      }
    });
    for (let obj of objToRemove) {
      this.three.getScene().remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
  }

  private generateClosures() {
    this.three.getScene().traverse((obj) => {
      if (obj instanceof THREE.Mesh && !obj.userData.__isOverlay) {
        const closures = this.generateObjectClosure(obj, this.plane);
        for (let closure of closures) {
          obj.add(closure);
          // this.three.getScene('overlay').add(closure);
        }
      }
    })
  }

  private round(v: THREE.Vector3): THREE.Vector3 {
    v.x = Math.round(v.x * this.multiplier) / this.multiplier;
    v.y = Math.round(v.y * this.multiplier) / this.multiplier;
    v.z = Math.round(v.z * this.multiplier) / this.multiplier;
    return v;
  }

  public generateObjectClosure(object: THREE.Mesh, plane: THREE.Plane): THREE.Mesh[] {
    const slicePathComposer = new SlicePathComposer();
    let geometry: THREE.BufferGeometry = object.geometry instanceof THREE.BufferGeometry
                        ? object.geometry
                        : new THREE.BufferGeometry().fromGeometry(object.geometry);
    if (geometry.index !== null) {
      geometry = geometry.toNonIndexed();
    }

    const faces: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [];
    const length = geometry.attributes.position.array.length;
    const array = geometry.attributes.position.array;
    
    for (let index = 0; index < length; index += 9) {
      let v1: THREE.Vector3 = this.round(new THREE.Vector3(array[index], array[index + 1], array[index + 2]));
      let v2: THREE.Vector3 = this.round(new THREE.Vector3(array[index + 3], array[index + 4], array[index + 5]));
      let v3: THREE.Vector3 = this.round(new THREE.Vector3(array[index + 6], array[index + 7], array[index + 8]));
      v1 = object.localToWorld(v1);
      v2 = object.localToWorld(v2);
      v3 = object.localToWorld(v3);
      faces.push([v1, v2, v3]);
    }
    for (let face of faces) {
      const l1 = new THREE.Line3(face[0], face[1]);
      const l2 = new THREE.Line3(face[1], face[2]);
      const l3 = new THREE.Line3(face[2], face[0]);

      const intersect1 = plane.intersectLine(l1, new THREE.Vector3);
      const intersect2 = plane.intersectLine(l2, new THREE.Vector3);
      const intersect3 = plane.intersectLine(l3, new THREE.Vector3);

      const pathPoints: Array<{
        point: THREE.Vector3,
        p1: THREE.Vector3,
        p2: THREE.Vector3
      }> = [];

      if (intersect1) {
        pathPoints.push({
          point: intersect1,
          p1: l1.start,
          p2: l1.end
        });
      }
      if (intersect2) {
        pathPoints.push({
          point: intersect2,
          p1: l2.start,
          p2: l2.end
        });
      }
      if (intersect3) {
        pathPoints.push({
          point: intersect3,
          p1: l3.start,
          p2: l3.end
        });
      }

      if (pathPoints.length === 3) {
        let distance0 = plane.distanceToPoint(face[0]);
        let distance1 = plane.distanceToPoint(face[1]);
        let distance2 = plane.distanceToPoint(face[2]);
        if (distance0 !== 0 && distance1 === 0 && distance2 === 0) {
          slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[2].point, pathPoints[2].p1, pathPoints[2].p2);
        } else if (distance1 !== 0 && distance0 === 0 && distance2 === 0) {
          slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
        } else if (distance2 !== 0 && distance1 === 0 && distance0 === 0) {
          slicePathComposer.addDoublePoints(pathPoints[2].point, pathPoints[2].p1, pathPoints[2].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
        }
      }

      if (pathPoints.length === 2) {
        slicePathComposer.addDoublePoints(pathPoints[0].point, pathPoints[0].p1, pathPoints[0].p2, pathPoints[1].point, pathPoints[1].p1, pathPoints[1].p2);
      }
    }

    const meshs: Array<THREE.Mesh> = [];
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(plane.normal, this.refNormal);
    const matrix = new THREE.Matrix4();
    matrix.makeRotationFromQuaternion(quaternion);
    const matrix2 = new THREE.Matrix4();
    quaternion.inverse();
    matrix2.makeRotationFromQuaternion(quaternion);
    for (let path of slicePathComposer.paths) {
      logThree.logPoints(path, `path`, 'black', 5000);
      const pathPoints = path.map((point, index) => {
        const newPoint = this.round(point.clone().applyMatrix4(matrix));
        logThree.logPoints(newPoint, `path-point-${index}`, 'pink');
        return new THREE.Vector2(newPoint[this.xProp], newPoint[this.yProp]);
      });
      const shape = new THREE.Shape(pathPoints);
      const shapeGeometry = new THREE.ShapeBufferGeometry(shape);
      shapeGeometry.applyMatrix(matrix2);
      const shapeMesh = new THREE.Mesh(shapeGeometry, this.closureMaterial);
      shapeMesh.userData.__isSliceClosure = true;
      shapeMesh.userData.__isOverlay = true;
      shapeMesh.userData.__originalObject = object;
      shapeMesh.translateOnAxis(plane.normal, plane.constant * -1);
      shapeMesh.translateOnAxis(plane.normal, this.offsetClosureFromPlane);

      meshs.push(shapeMesh);
    }
    return meshs;
  }

  private displaySliceOverlayPlane() {
    if (!this.overlayPlane) {
      this.createOverlayPlane();
    }
    if (this.overlayPlane.userData.displayed) return;
    // this.three.getScene('tools').add(this.overlayPlane);
    this.overlayPlane.userData.displayed = true;
  }

  private hideSliceOverlayPlane() {
    if (!this.overlayPlane || !this.overlayPlane.userData.displayed) return;
    this.three.getScene('tools').remove(this.overlayPlane);
    this.overlayPlane.userData.displayed = false;
  }

  private createOverlayPlane() {
    const planeHelper = new THREE.PlaneHelper(this.plane, 50);
    if (!this.showPlaneHelper || true) {
      planeHelper.visible = false;
    }
    this.overlayPlane = planeHelper;
  }

  private displaySliceOverlayTool() {
    if (!this.overlayPlane) {
      this.createOverlayPlane();
    }
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

  private hideSliceOverlayTool() {
    if (!this.overlayTool || !this.overlayTool.userData.displayed) return;
    this.three.getScene('tools').remove(this.overlayTool);
    this.overlayTool.userData.displayed = false;
  }

  private createOverlayTool() {
    let group = new THREE.Group();

    let normalLineGeometry = new THREE.Geometry();
    normalLineGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 0, 0)
    );
    let normalLine = new THREE.Line(normalLineGeometry, new THREE.LineBasicMaterial({color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide}));
    normalLine.translateX(-10);
    let normalConeGeometry = new THREE.ConeGeometry(0.6, 1.2);
    let normalCone = new THREE.Mesh(normalConeGeometry, new THREE.MeshBasicMaterial({color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide}));
    normalCone.rotateOnAxis(new THREE.Vector3(0, 0, 1), -90 / 180 * Math.PI);
    normalCone.translateY(-0.6);

    let zCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
    let zCurveGeometry = new THREE.BufferGeometry().setFromPoints(zCurve.getPoints(50));
    let zLine = new THREE.Line(zCurveGeometry, new THREE.LineBasicMaterial({color: 'green', opacity: 0.8, transparent: true, side: THREE.FrontSide}));

    let yCurve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
    let yCurveGeometry = new THREE.BufferGeometry().setFromPoints(yCurve.getPoints(50));
    let yLine = new THREE.Line(yCurveGeometry, new THREE.LineBasicMaterial({color: 'red', opacity: 0.8, transparent: true, side: THREE.FrontSide}));
    yLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 / 180 * Math.PI);

    zLine.userData = {constraint: 'z'};
    yLine.userData = {constraint: 'y'};
    normalLine.userData = {constraint: 'normal'};
    normalCone.userData = {constraint: 'normal'};

    const planeGeometry = new THREE.Geometry();
    planeGeometry.vertices.push(new THREE.Vector3(0, -20, -20))
    planeGeometry.vertices.push(new THREE.Vector3(0, -20, 20))
    planeGeometry.vertices.push(new THREE.Vector3(0, 20, 20))
    planeGeometry.vertices.push(new THREE.Vector3(0, 20, -20))
    planeGeometry.vertices.push(new THREE.Vector3(0, -20, -20))
    const planeMesh = new THREE.Line(planeGeometry, new THREE.LineBasicMaterial({color: 'black', opacity: 0.1, transparent: true, side: THREE.DoubleSide}));
    planeMesh.name = 'slice-plane-helper';
    this.planeHelper = planeMesh;
    if (this.showSliceYRotation) {
      group.add(yLine);
    }
    if (this.showSliceZRotation) {
      group.add(zLine);
    }
    if (this.showSliceTranslation) {
      group.add(normalLine);
      group.add(normalCone);
    }
    if (this.showPlaneHelper) {
      group.add(planeMesh);
    }

    group.name = '__slice-tools__';
    let groupContainer = new THREE.Group;
    groupContainer.name = '__slice-tools-container__';
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
    if (!this.overlayTool) return;
    if (!this.overlayPlane) return;
    this.overlayTool.position.set(this.toolPosition.x, this.toolPosition.y, this.toolPosition.z);
    this.overlayTool.rotation.set(this.toolOrientation.x, this.toolOrientation.y, this.toolOrientation. z);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), this.toolOrientation);
    this.overlayTool.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }

  private adjustOverlayToolZoom() {
    if (!this.overlayTool) return;
    let camera = this.three.getCamera();
    if (camera instanceof THREE.OrthographicCamera) {
      let cameraZoom = camera.zoom;
      let tool = this.overlayTool.getObjectByName('__slice-tools__');
      tool.scale.setScalar(10 / cameraZoom);
      this.overlayPlane.size = 100 * 10 / cameraZoom;
    }
  }

  private adjustActiveTool() {
    if (!this.overlayTool) return;
    let tool = this.overlayTool.getObjectByName('__slice-tools__');
    tool.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        let material = obj.material as THREE.Material;
        if (!this.constraint) material.opacity = 0.8;
        else {
          if (obj.userData.constraint === this.constraint || (this.active && obj === this.planeHelper)) material.opacity = 1;
          else material.opacity = 0.1;
        }
      }
    })
  }

  // TODO: this two methods are designed to
  // return the position / direction similar to BCF values
  // and they should also become setters for those values
  public slicePosition(): THREE.Vector3 {
    return this.toolPosition;
  }

  public sliceOrientation(): THREE.Vector3 {
    return this.toolOrientation;
  }

}
