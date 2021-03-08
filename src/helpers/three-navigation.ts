import { ThreeCustomElement } from '../components/three';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { Container, computedFrom } from 'aurelia-framework';
import * as OrbitControls from 'three-orbitcontrols';
import { Logger, getLogger } from 'aurelia-logging';

export type NavigationOrientation = '3d' | 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';

export interface ThreeControls /*extends OrbitControls*/ {
  autoRotate: boolean;
  autoRotateSpeed: number;
  dampingFactor: number;
  enableDamping: boolean;
  enableKeys: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  enableZoom: boolean;
  enabled: boolean;
  keyPanSpeed: number;
  maxAzimuthAngle: number;
  maxDistance: number;
  maxPolarAngle: number;
  maxZoom: number;
  minAzimuthAngle: number;
  minDistance: number;
  minPolarAngle: number;
  minZoom: number;
  panSpeed: number;
  rotateSpeed: number;
  screenSpacePanning: boolean;
  zoom0: number;
  zoomSpeed: number;
  target: THREE.Vector3;
  mouseButtons: {
    LEFT: number,
    MIDDLE: number,
    ORBIT: number,
    PAN: number,
    RIGHT: number
  };

  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
}

export class ThreeNavigation {
  private three: ThreeCustomElement;
  public controls: ThreeControls;

  private log: Logger = getLogger('three-navigation');

  constructor(three: ThreeCustomElement) {
    this.three = three;
  }

  public initControls() {
    let camera: THREE.Camera = this.three.getCamera();
    if (!camera) return;
    this.controls = new OrbitControls(camera, this.three.getRenderer().domElement);
    this.controls.minZoom = 0.0001;
    this.controls.mouseButtons.PAN = 0;
    this.controls.mouseButtons.ORBIT = 2;
    this.controls.addEventListener('change', () => {
      if (camera instanceof THREE.OrthographicCamera) {
        this.three.cameraZoom = camera.zoom;
      }
      this.three.requestRendering();
      this.three.publish('camera:moved');
    });
  }

  private zoomOnBboxObject: THREE.Object3D;
  private tweenCamera: any;
  public cameraIsAnimating: boolean = false;

  public zoomOnBbox(bbox: THREE.Box3, orientation: NavigationOrientation, animate: boolean = false, render: boolean = true) {
    let showBbox = false;
    let showBboxDuration: number = 10000;

    if (showBbox) {
      if (this.zoomOnBboxObject) this.three.getScene().remove(this.zoomOnBboxObject);
      let width = bbox.max.x - bbox.min.x;
      let height = bbox.max.y - bbox.min.y;
      let depth = bbox.max.z - bbox.min.z;
      let x = (bbox.max.x + bbox.min.x) / 2;
      let y = (bbox.max.y + bbox.min.y) / 2;
      let z = (bbox.max.z + bbox.min.z) / 2;
      let geometry = new THREE.BoxGeometry( width, height, depth );
      let material = new THREE.MeshBasicMaterial( {color: 0x888888, wireframe: true} );
      this.zoomOnBboxObject = new THREE.Mesh( geometry, material );
      this.zoomOnBboxObject.position.set(x, y, z);
      this.zoomOnBboxObject.userData._isHelper = true;
      this.three.objects.addObject( this.zoomOnBboxObject );
      if (showBboxDuration) {
        setTimeout(() => {
          if (this.zoomOnBboxObject) this.three.getScene().remove(this.zoomOnBboxObject);
        }, 10000);
      }
    }

    let newCameraPosition: THREE.Vector3 = new THREE.Vector3();
    let newCameraRotation: THREE.Vector3 = new THREE.Vector3();
    let newCameraZoom: number;

    // we need the size and the center
    let bboxCenterPosition: THREE.Vector3 = new THREE.Vector3();
    bbox.getCenter(bboxCenterPosition);

    let bboxWidth = bbox.max.x - bbox.min.x;
    let bboxHeight = bbox.max.y - bbox.min.y;
    let bboxDepth = bbox.max.z - bbox.min.z;

    let z1: number;
    let z2: number;
    let z3: number;
    let z4: number;
    let z5: number

    switch (orientation) {
    case 'top':
      newCameraPosition.x = bboxCenterPosition.x;
      newCameraPosition.y = bboxCenterPosition.y + bboxHeight * 1.1;
      newCameraPosition.z = bboxCenterPosition.z;
      newCameraRotation.x = Math.PI / 2 * -1;
      newCameraRotation.y = 0;
      newCameraRotation.z = 0;

      z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
      z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
      newCameraZoom = Math.min(z1, z2) * 0.9;

      break;
    case 'bottom':
      newCameraPosition.x = bboxCenterPosition.x;
      newCameraPosition.y = bboxCenterPosition.y + bboxHeight * -1.1;
      newCameraPosition.z = bboxCenterPosition.z;
      newCameraRotation.x = Math.PI / 2 * 1;
      newCameraRotation.y = 0;
      newCameraRotation.z = 0;

      z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
      z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
      newCameraZoom = Math.min(z1, z2) * 0.9;

      break;
      case 'right':
        newCameraPosition.x = bboxCenterPosition.x + bboxHeight * 1.1;
        newCameraPosition.y = bboxCenterPosition.y;
        newCameraPosition.z = bboxCenterPosition.z;
        newCameraRotation.x = 0;
        newCameraRotation.y = Math.PI / 2 * -1;
        newCameraRotation.z = 0;
  
        z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
        z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
        newCameraZoom = Math.min(z1, z2) * 0.9;
  
        break;
      case 'left':
          newCameraPosition.x = bboxCenterPosition.x + bboxHeight * -1.1;
          newCameraPosition.y = bboxCenterPosition.y;
          newCameraPosition.z = bboxCenterPosition.z;
          newCameraRotation.x = 0;
          newCameraRotation.y = Math.PI / 2 * 1;
          newCameraRotation.z = 0;
    
          z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
          z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
          newCameraZoom = Math.min(z1, z2) * 0.9;
    
          break;
      case 'front':
        newCameraPosition.x = bboxCenterPosition.x
        newCameraPosition.y = bboxCenterPosition.y;
        newCameraPosition.z = bboxCenterPosition.z + bboxHeight * 1.1;
        newCameraRotation.x = 0;
        newCameraRotation.y = 0;
        newCameraRotation.z = 0;
  
        z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
        z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
        newCameraZoom = Math.min(z1, z2) * 0.9;
  
        break;
      case 'back':
        newCameraPosition.x = bboxCenterPosition.x
        newCameraPosition.y = bboxCenterPosition.y;
        newCameraPosition.z = bboxCenterPosition.z + bboxHeight * -1.1;
        newCameraRotation.x = 0;
        newCameraRotation.y = Math.PI;
        newCameraRotation.z = 0;
  
        z1 = this.three.getSceneElement().offsetWidth / bboxWidth;
        z2 = this.three.getSceneElement().offsetHeight / bboxDepth;
        newCameraZoom = Math.min(z1, z2) * 0.9;
  
        break;
    case '3d':
      let offset = 20; // used to be 1000, should depend on max scene bbox or something related to the bbox we want to zoom to
      newCameraPosition.x = bboxCenterPosition.x + offset;
      newCameraPosition.y = bboxCenterPosition.y + offset;
      newCameraPosition.z = bboxCenterPosition.z + offset;
      newCameraRotation.x = Math.PI / 4 * -1;
      newCameraRotation.y = Math.PI / 4;
      newCameraRotation.z = Math.PI / 4;
      
      z1 = this.three.getSceneElement().offsetWidth / bboxWidth * 0.75;
      z2 = this.three.getSceneElement().offsetHeight / bboxWidth * 0.75;

      z3 = this.three.getSceneElement().offsetHeight / bboxHeight * 0.75;

      z4 = this.three.getSceneElement().offsetWidth / bboxDepth * 0.75;
      z5 = this.three.getSceneElement().offsetHeight / bboxDepth * 0.75;
      newCameraZoom = Math.min(z1, z2, z3, z4, z5) * 0.9;

      break;
    default:
    }

    let camera = this.three.getCamera();

    if (!animate) {
      camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z);
      camera.lookAt(bboxCenterPosition);
      this.controls.target = bboxCenterPosition;
      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = newCameraZoom;
        camera.updateProjectionMatrix();
      }
      camera.updateMatrixWorld();
      if (render) this.three.requestRendering();
      return;
    }

    this.controls.enabled = false;
    let currentLookAt = new THREE.Vector3(0, 0, -1);
    currentLookAt.applyQuaternion(camera.quaternion);

    // animate camera
    let currentOrientation: any = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      rotationX: camera.rotation.x,
      rotationY: camera.rotation.y,
      rotationZ: camera.rotation.z,
      lookAtX: this.controls.target.x,
      lookAtY: this.controls.target.y,
      lookAtZ: this.controls.target.z,
      targetX: this.controls.target.x,
      targetY: this.controls.target.y,
      targetZ: this.controls.target.z
    };

    if (camera instanceof THREE.OrthographicCamera) {
      currentOrientation.zoom = camera.zoom;
    }

    let newOrientation: any = {
      x: newCameraPosition.x,
      y: newCameraPosition.y,
      z: newCameraPosition.z,
      rotationX: newCameraRotation.x,
      rotationY: newCameraRotation.y,
      rotationZ: newCameraRotation.z,
      lookAtX: bboxCenterPosition.x,
      lookAtY: bboxCenterPosition.y,
      lookAtZ: bboxCenterPosition.z,
      zoom: newCameraZoom,
      targetX: bboxCenterPosition.x,
      targetY: bboxCenterPosition.y,
      targetZ: bboxCenterPosition.z
    };

    if (this.tweenCamera !== undefined) {
      this.tweenCamera.stop();
    }

    this.tweenCamera = new (TWEEN as any).Tween(currentOrientation)
      .to(newOrientation, 1000).onUpdate(() => {
        camera.position.set(currentOrientation.x, currentOrientation.y, currentOrientation.z);


        camera.rotation.x = currentOrientation.rotationX;
        camera.rotation.y = currentOrientation.rotationY;
        camera.rotation.z = currentOrientation.rotationZ;
        camera.lookAt(new THREE.Vector3(currentOrientation.lookAtX, currentOrientation.lookAtY, currentOrientation.lookAtZ));
        if (orientation === 'top') {
          camera.rotation.z = currentOrientation.rotationZ;
        }

        this.controls.target = new THREE.Vector3(currentOrientation.targetX, currentOrientation.targetY, currentOrientation.targetZ);
        if (camera instanceof THREE.OrthographicCamera) {
          camera.zoom = currentOrientation.zoom;
          camera.updateProjectionMatrix();
        }
        camera.updateMatrixWorld();
        //this.requestRendering();
      }).onStart(() => {
        this.cameraIsAnimating = true;
      }).onStop(() => {
        this.cameraIsAnimating = false;
      }).onComplete(() => {
        this.cameraIsAnimating = false;
        this.controls.enabled = true;
        if (camera instanceof THREE.OrthographicCamera) {
          camera.updateProjectionMatrix();
        }
        camera.updateMatrixWorld();
      });

    this.cameraIsAnimating = true;
    this.tweenCamera.start();

    this.three.requestRendering();
  }

  public zoom(target: 'scene' | 'currentBbox' | THREE.Object3D | THREE.Box3 | Array<THREE.Object3D>, factor: number | 'auto', orientation: NavigationOrientation = '3d', animate: boolean = false, render: boolean = true) {
    if (target === 'scene') {
      // zoom on scene
      let bbox = null;
      this.three.getScene().traverse((object) => {
        if (!object.visible) return;
        if (object.type === 'Scene') return;
        if (object.type === 'AmbientLight') return;
        if (object.type === 'SpotLight') return;
        if (object.type === 'OrthographicCamera') return;
        if (object instanceof THREE.SpotLightHelper) return;
        if (object instanceof THREE.AxesHelper) return;
        if (object.userData._isHelper) return;        
        if (!bbox) {
          bbox = new THREE.Box3();
          bbox.setFromObject(object);
        } else {
          bbox.expandByObject(object);
        }        
      });
      if (bbox) {
        if (factor === 'auto') {
          bbox = this.three.autoExtendBbox(bbox);
        } else {
          bbox = this.three.scaleBbox(bbox, factor);
        }
        this.zoomOnBbox(bbox, orientation, animate, render);
      }
    } else if (target === 'currentBbox') {
      // zoom on currentBbox
      let bbox;
      if (factor === 'auto') {
        bbox = this.three.autoExtendBbox(this.three.objects.getBbox());
      } else {
        bbox = this.three.scaleBbox(this.three.objects.getBbox(), factor);
      }
      this.zoomOnBbox(bbox, orientation, animate, render);
    } else if (typeof target === 'string') {
      // zoom on items flagged with target
      let scene = new THREE.Scene();
      let hasObjects = false;

      let bbox: THREE.Box3;
      this.three.getScene().traverse((object) => {
        if (object[`_${target}`]) {
          if (!bbox) {
            bbox = new THREE.Box3();
            bbox.setFromObject(object);
          } else {
            bbox.expandByObject(object);
          }
        }
      });
      if (bbox) {
        if (factor === 'auto') {
          bbox = this.three.autoExtendBbox(bbox);
        } else {
          bbox = this.three.scaleBbox(bbox, factor);
        }
        this.zoomOnBbox(bbox, orientation, animate, render);
      }
    } else if (typeof target === 'object' && target instanceof THREE.Object3D) {
      // zoom on object
      let bbox = new THREE.Box3().setFromObject(target);
      if (factor === 'auto') {
        bbox = this.three.autoExtendBbox(bbox);
      } else {
        bbox = this.three.scaleBbox(bbox, factor);
      }
      this.zoomOnBbox(bbox, orientation, animate, render);
    } else if (typeof target === 'object' && target instanceof THREE.Box3) {
      // zoom on bbox
      let bbox = target;
      if (factor === 'auto') {
        bbox = this.three.autoExtendBbox(bbox);
      } else {
        bbox = this.three.scaleBbox(bbox, factor);
      }
      this.zoomOnBbox(bbox, orientation, animate, render);
    } else if (Array.isArray(target) && target.length) {

      let bbox: THREE.Box3;
      for (let object of target) {
        let objectBbox = new THREE.Box3().setFromObject(object);
        if (this.three.isBbox000(objectBbox)) continue;
        if (!bbox) {
          bbox = new THREE.Box3();
          bbox.setFromObject(object);
        } else {
          bbox.expandByObject(object);
        }
      }
      if (factor === 'auto') {
        bbox = this.three.autoExtendBbox(bbox);
      } else {
        bbox = this.three.scaleBbox(bbox, factor);
      }
      this.zoomOnBbox(bbox, orientation, animate, render);
    }
  }

  zoomOnObject(object: THREE.Object3D, factor: number | 'auto' = 1, orientation:NavigationOrientation = 'top', animate = false, render = true) {
    this.zoom(object, factor, orientation, animate, render);
  }

  zoomOnScene(factor, orientation: NavigationOrientation = '3d', animate = false, render = true) {
    return this.zoom('scene', factor, orientation, animate, render);
  }

  @computedFrom('three')
  get camera(): THREE.Camera {
    return this.three.getCamera();
  }

  observationOn: boolean = false;
  observationViewer: HTMLElement;
  observationRenderer: THREE.WebGLRenderer;
  observationSubscription: Subscription;
  observationCamera: THREE.Camera;
  observationCameraFrustrumFactor: number = 2;
  observationCameraZoom: number = 3;
  public startObservation() {
    this.observationViewer = document.createElement('div');
    this.observationViewer.style.position = 'absolute';
    this.observationViewer.style.zIndex = '10';
    this.observationViewer.style.right = '10px';
    this.observationViewer.style.top = '10px';
    this.observationViewer.style.width = '300px';
    this.observationViewer.style.height = '300px';
    this.observationViewer.style.boxShadow = 'var(--aurelia-ux--design-elevation3dp)';
    this.three.getSceneElement().parentElement.append(this.observationViewer);
    this.observationRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false  });
    this.observationRenderer.setClearColor('#fff');
    this.observationRenderer.setSize( this.observationViewer.offsetWidth, this.observationViewer.offsetHeight );
    this.observationViewer.appendChild( this.observationRenderer.domElement );
    let w = this.observationViewer.offsetWidth;
    let h = this.observationViewer.offsetHeight;

    this.observationCamera = new THREE.OrthographicCamera(w / (this.observationCameraFrustrumFactor * -1), w / this.observationCameraFrustrumFactor, h / this.observationCameraFrustrumFactor, h / (this.observationCameraFrustrumFactor * -1), -1000000, 1000000);
    this.observationCamera.name = 'Observation Camera';
    this.observationCamera.position.x = -10;
    this.observationCamera.position.y = 0;
    this.observationCamera.position.z = 0;
    (this.observationCamera as THREE.OrthographicCamera).zoom = this.observationCameraZoom;
    this.observationCamera.lookAt(new THREE.Vector3(0, 0, 0));
    (this.observationCamera as THREE.OrthographicCamera).updateProjectionMatrix();
    this.observationCamera.updateMatrixWorld();

    this.observationSubscription = (Container.instance.get(EventAggregator) as EventAggregator).subscribe('three-post-render', () => {
      (this.observationCamera as THREE.OrthographicCamera).updateProjectionMatrix();
      this.camera.updateMatrixWorld();
      if (!this.observationRenderer) return;
      this.observationRenderer.autoClear = true;
      this.observationRenderer.render(this.three.getScene(), this.observationCamera);
      this.observationRenderer.autoClear = false;
      this.observationRenderer.render(this.three.getScene('points'), this.observationCamera);
      this.observationRenderer.render(this.three.getScene('overlay'), this.observationCamera);
      this.observationRenderer.render(this.three.getScene('tools'), this.observationCamera);
    });

    this.showCameraHelper();
    this.observationOn = true;
  }

  public endObservation() {
    this.removeCameraHelper();
    this.observationViewer.remove();
    delete this.observationRenderer;
    delete this.observationCamera;
    delete this.observationViewer;
    this.observationSubscription.dispose();
    this.observationOn = false;
  }

  public toggleObservation() {
    if (!this.observationOn) {
      this.startObservation();
    } else {
      this.endObservation();
    }
  }

  public showCameraHelper() {
    this.log.debug('showCameraHelper');
    let scene = this.three.getScene('overlay');
    if (scene.getObjectByName('camera_helper')) return;
    let helper = new THREE.CameraHelper(this.camera);
    setInterval(() => {
      helper.update();
    }, 500);
    helper.name = 'camera_helper';
    scene.add(helper);
  }

  public removeCameraHelper() {
    let scene = this.three.getScene('overlay');
    if (scene.getObjectByName('camera_helper')) {
      scene.remove(scene.getObjectByName('camera_helper'));
    }
  }



}
