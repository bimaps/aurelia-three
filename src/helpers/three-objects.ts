import { ThreeCustomElement } from './../components/three';
import { StringAnyMap } from 'aurelia-resources';
import { Container, computedFrom } from 'aurelia-framework';
import { Logger, getLogger } from 'aurelia-logging';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import * as THREE from 'three';
(window as any).THREE = THREE;
// require('three/examples/js/loaders/ColladaLoader');
// require('three/examples/js/loaders/GLTFLoader');
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';

export interface ParseLoadedDataOptions {
  render?: boolean;
  applyStyles?: boolean;
  calculateOffsetCenter?: 'never' | 'if-no-offset' | 'always';
  userData?: StringAnyMap;
}

export interface ParseLoadResult {
  empty: boolean;
  bbox: THREE.Box3 | null;
  object: THREE.Object3D | null;
}

export interface AddObjectOptions {
  userData?: StringAnyMap;
}

export class ThreeObjects {

  private jsonLoader: THREE.ObjectLoader;
  private mtlLoader: any;
  private objLoader: any;
  private colladaLoader: ColladaLoader;
  private gltfLoader: GLTFLoader;
  private log: Logger = getLogger('three-objects');
  private scene: THREE.Scene;
  private overlayScene: THREE.Scene;
  private toolsScene: THREE.Scene;
  private subscriptions: Array<Subscription> = [];
  private offset: THREE.Vector3 | null = null;
  private bbox: THREE.Box3 | null = null;

  private three: ThreeCustomElement;

  private showEdges: boolean = false;
  public edgeMaterial = new THREE.LineBasicMaterial( { color: '#ccc', depthTest: true } );

  constructor(three: ThreeCustomElement) {
    this.three = three;
    this.scene = this.three.getScene();
    this.overlayScene = this.three.getScene('overlay');
    this.toolsScene = this.three.getScene('tools');
  }

  public setShowEdges(show: boolean) {
    this.showEdges = show;
    if (this.showEdges) {
      this.addAllEdges();
    } else {
      this.removeAllEdges();
    }
  }

  subscribe(event: string, callback: any) {
    this.subscriptions.push((Container.instance.get(EventAggregator) as EventAggregator).subscribe(event, callback));
  }

  clearScene(clearToolsScene: boolean = false) {
    
    let keepObjects: Array<THREE.Object3D> = [];
    for (let object of this.scene.children) {
      if (object instanceof THREE.Light) keepObjects.push(object);
      if (object instanceof THREE.Camera) keepObjects.push(object);
      if (object instanceof THREE.AxesHelper) keepObjects.push(object);
    }
    while (this.scene.children.length > 0) {
      this.scene.children.pop();
    }
    for (let obj of keepObjects) {
      this.scene.add(obj);
    }
    while (this.overlayScene.children.length > 0) {
      this.overlayScene.children.pop();
    }
    if (clearToolsScene) {
      while (this.toolsScene.children.length > 0) {
        this.toolsScene.children.pop();
      }
    }
    this.offset = null;
    this.bbox = null;

    this.three.publish('scene.request-rendering', {three: this.three});
    this.three.publish('scene.cleared', {three: this.three});
  }

  loadJSON(json: any, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    if (!this.jsonLoader) this.jsonLoader = new THREE.ObjectLoader();
    return new Promise((resolve, reject) => {
      this.jsonLoader.parse(json, (object) => {
        resolve(this.parseLoadedData(object, options));
      });
    });
  }

  loadFile(file: File, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    let filetype: 'mtl' | 'obj' | 'json' | 'dae' | 'gltf';
    if (file.name.substr(-4) === '.mtl') filetype = 'mtl';
    if (file.name.substr(-4) === '.obj') filetype = 'obj';
    if (file.name.substr(-5) === '.json') filetype = 'json';
    if (file.name.substr(-4) === '.dae') filetype = 'dae';
    if (file.name.substr(-5) === '.gltf') filetype = 'gltf';
    if (!filetype) throw new Error('Invalid file type');
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          let url = e.target.result;
          if (filetype === 'mtl') this.loadMTL(url, true).then(resolve).catch(reject);
          if (filetype === 'obj') this.loadOBJ(url, options).then(resolve).catch(reject);
          if (filetype === 'json') this.loadJSONFile(url, options).then(resolve).catch(reject);
          if (filetype === 'dae') this.loadDae(url, options).then(resolve).catch(reject);
          if (filetype === 'gltf') this.loadGltf(url, options).then(resolve).catch(reject);
        }
      }
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  loadJSONFile(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    if (!this.jsonLoader) this.jsonLoader = new THREE.ObjectLoader();
    return new Promise((resolve, reject) => {
      this.jsonLoader.load(filename, (object) => {
        resolve(this.parseLoadedData(object, options));
      }, null, reject);
    });
  }

  loadMTL(filename: string, preLoad: boolean = true, addToObjLoader: boolean = true): Promise<any> {

    if (!this.mtlLoader) this.mtlLoader = new MTLLoader();
    if (!this.objLoader) this.objLoader = new OBJLoader();
    return new Promise((resolve, reject) => {
      this.mtlLoader.load(filename, (materials) => {
        if (preLoad) materials.preload()
        if (addToObjLoader) this.objLoader.setMaterials(materials);
        resolve(materials);
      }, null, reject);
    });
  }
  
  loadOBJ(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    if (!this.objLoader) this.objLoader = new OBJLoader();
    return new Promise((resolve, reject) => {
      this.objLoader.load(filename, (object) => {
        resolve(this.parseLoadedData(object, options));
      }, null, reject);
    });
  }

  loadDae(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    if (!this.colladaLoader) this.colladaLoader = new ColladaLoader();
    //this.colladaLoader.options["verboseMessages"] = true; // for a list of available options, see ColladaLoader2.prototype._init
    return new Promise((resolve, reject) => {
      this.colladaLoader.load(filename, (object) => {
        resolve(this.parseLoadedData(object.scene, options));
      }, null, reject);
    });
  }

  loadGltf(filename: string, options?: ParseLoadedDataOptions): Promise<ParseLoadResult> {
    if (!this.gltfLoader) this.gltfLoader = new GLTFLoader();
    //this.colladaLoader.options["verboseMessages"] = true; // for a list of available options, see ColladaLoader2.prototype._init
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(filename, (object) => {
        resolve(this.parseLoadedData(object.scene, options));
      }, null, reject);
    });
  }

  parseLoadedData(object: THREE.Object3D, options: ParseLoadedDataOptions = {}): ParseLoadResult {
    if (options.render === undefined) options.render = true;
    if (options.applyStyles === undefined) options.applyStyles = true;
    if (options.calculateOffsetCenter === undefined) options.calculateOffsetCenter = 'if-no-offset';
    let bbox: THREE.Box3;
    (window as any).obj = object;

    if (object.type === 'Object3D') {
      this.log.info('Load an Object3D into the Scene');
      if (this.offset) {
        object.translateOnAxis(this.offset, 1);
      }

      this.addObject(object, options);

      if (!this.offset) this.offset = new THREE.Vector3(0, 0, 0); // to avoid further offset calculation before a clearScene()

      let box = new THREE.BoxHelper(object);
      box.geometry.computeBoundingBox();
      bbox = box.geometry.boundingBox;
    }

    if (object.type === 'Scene' || object.type === 'Group') {
      this.log.info('Load a Scene or a Group into the Scene', object.type);
      
      if (!object.children || object.children.length === 0) {
        this.log.info('Scene:Cancel the loading, scene has no child');
        return {empty: true, bbox: null, object: null};
      }

      let box: THREE.Box3;
      object.traverse((node) => {
        if (!box) {
          box = new THREE.Box3();
          box.setFromObject(node);
        } else {
          box.expandByObject(node);
        }
      });

      if (options.calculateOffsetCenter === 'always' || (options.calculateOffsetCenter === 'if-no-offset' && !this.offset)) {
        // determine the offset of importing
        if (!this.offset) this.offset = new THREE.Vector3;
        box.getCenter(this.offset);
        this.offset.negate();
      }

      // add and translate each object according to the calculated offset
      while (object.children.length > 0) {
        let child = object.children.pop();
        if (child.type === 'Object3D' && this.offset) {
          (child as THREE.Object3D).translateOnAxis(this.offset, 1);
        } else if (child.type === 'Mesh' && this.offset) {
          (child as THREE.Mesh).translateOnAxis(this.offset, 1);
        }
        this.addObject(child, options);
      }

      if (this.offset) {
        box.min.x += this.offset.x;
        box.min.y += this.offset.y;
        box.min.z += this.offset.z;
        box.max.x += this.offset.x;
        box.max.y += this.offset.y;
        box.max.z += this.offset.z;
      }

      this.log.info('Scene:Bbox of the scene', box);
      bbox = box;
    }

    // calculate new scene bbox
    // if (this.bbox) {
    //   this.bbox = null;
    // }
    let newbbox = null;
    this.scene.traverse((node) => {  
      if (node.type === 'Scene') return;
      if (node.type === 'Group') return;
      if (node.type === 'Line') return;
      if (!newbbox) {
        newbbox = new THREE.Box3();
        newbbox.setFromObject(node);
      } else {
        newbbox.expandByObject(node);
      }   
    });
    this.bbox = newbbox;

    // request scene styling
    if (options.applyStyles) this.three.publish('scene.request-styling', {three: this.three});
    // and rendering
    if (options.render) this.three.publish('scene.request-rendering', {three: this.three});

    this.three.publish('objects.parsed', {three: this.three, bbox: bbox});
    return {empty: false, object: object, bbox: bbox};
  }

  addObject(object: THREE.Object3D, options?: AddObjectOptions) {
    if (options && options.userData) {
      if (!object.userData) object.userData = {};
      for (let key in options.userData) {
        object.userData[key] = options.userData[key];
      }
      if (object.children) {
        object.traverse((o) => {
          if (!o.userData) o.userData = {};
          for (let key in options.userData) {
            o.userData[key] = options.userData[key];
          }
        });
      }
    }

    this.three.publish('objects.add', {object: object, options: options});

    // add object to global scene
    (object as any).__throughAddObject = true;
    this.scene.add(object);
    delete (object as any).__throughAddObject;

    if (this.showEdges && !object.userData.__isOverlay) {
      this.addEdgestoObject(object);
      if (object.children) {
        object.traverse((o) => {
          if (!object.userData.__isOverlay) {
            this.addEdgestoObject(o);
          }
        });
      }
    }
  }

  public removeObject(object) {
    (object as any).__throughRemoveObject = true;
    this.scene.remove(object);
    delete (object as any).__throughRemoveObject;
    this.removeEdgesObject(object);
    if (object.children) {
      object.traverse((o) => {
        this.removeEdgesObject(o);
      });
    }
  }

  public counter = 0;

  public addEdgestoObject(object) {
    if (object instanceof THREE.Mesh) {
      if ((object as any).__edgeObject) {
        return;
      }
      if ((object as any).__ignoreEdges) {
        return;
      }
      const name = `${object.uuid}-edge`;
      this.counter++;
      const edges = new THREE.EdgesGeometry(object.geometry);
      const line = new THREE.LineSegments( edges, this.edgeMaterial );
      line.userData.__isEdge = true;
      line.userData.__isOverlay = true;
      line.name = name;
      line.renderOrder = 9;
      (object as any).__edgeObject = line;
      setTimeout(() => {
        object.add(line);
      }, this.counter);
    }
  }

  public removeEdgesObject(object) {
    if (object instanceof THREE.Mesh) {
      const line = (object as any).__edgeObject as THREE.LineSegments;
      if (!line) {
        return;
      }
      object.remove(line);
      line.geometry.dispose(); 
    }
  }

  public addAllEdges() {
    this.three.getScene().traverse((obj) => {
      this.addEdgestoObject(obj);
    });
  }

  public removeAllEdges() {
    const objectsToRemove: THREE.LineSegments[] = [];

    this.three.getScene().traverse((obj) => {
      if (obj.userData.__isEdge) {
        objectsToRemove.push(obj as THREE.LineSegments);
      }
    });

    for (let obj of objectsToRemove) {
      this.three.getScene().remove(obj);
      obj.geometry.dispose();
    }
  }

  get sceneWidth() {
    return Math.abs(this.bbox.max.x - this.bbox.min.x);
  }

  get sceneHeight() {
    return Math.abs(this.bbox.max.y - this.bbox.min.y);
  }

  get sceneDepth() {
    return Math.abs(this.bbox.max.z - this.bbox.min.z);
  }

  public getBbox(): THREE.Box3 {
    return this.bbox;
  }

  @computedFrom('scene.children', 'scene.children.length')
  get rootObjects(): Array<THREE.Object3D> {
    let objects: Array<THREE.Object3D> = [];
    for (let obj of this.scene.children) {
      if (obj instanceof THREE.Light) continue;
      if (obj instanceof THREE.Camera) continue;
      if (obj instanceof THREE.AxesHelper) continue;
      if (obj instanceof THREE.BoxHelper) continue;
      if (obj instanceof THREE.Box3Helper) continue;
      if (obj instanceof THREE.GridHelper) continue;
      if (obj instanceof THREE.ArrowHelper) continue;
      if (obj instanceof THREE.PlaneHelper) continue;
      if (obj instanceof THREE.CameraHelper) continue;
      objects.push(obj);
    }
    return objects;
  }

  @computedFrom('scene.children', 'scene.children.length')
  get lights(): Array<THREE.Light> {
    let lights: Array<THREE.Light> = [];
    for (let obj of this.scene.children) {
      if (obj instanceof THREE.Light) lights.push(obj);
    }
    return lights;
  }
}
