import { ThreeCustomElement } from './../components/three';
import { Container, computedFrom } from 'aurelia-framework';
import { Logger, getLogger } from 'aurelia-logging';
import * as THREE from 'three';
(window as any).THREE = THREE;
import { PointCloudOctree, Potree, PointCloudOctreeGeometry } from '@pnext/three-loader';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';

export class ThreePoints {

  private log: Logger = getLogger('three-points');
  public potree: Potree;
  private pointsBudgets: number = 2000000;
  public pointClouds: PointCloudOctree[] = [];
  private scene: THREE.Scene;
  private pointsScene: THREE.Scene;
  private overlayScene: THREE.Scene;
  private subscriptions: Array<Subscription> = [];
  
  //private offset: THREE.Vector3 | null = null;
  //private bbox: THREE.Box3 | null = null;

  private three: ThreeCustomElement;

  constructor(three: ThreeCustomElement) {
    this.three = three;
    this.scene = this.three.getScene();
    this.pointsScene = this.three.getScene('points');
    this.overlayScene = this.three.getScene('overlay');
    this.potree = new Potree();
    this.potree.pointBudget = this.pointsBudgets;
  }

  subscribe(event: string, callback: any) {
    this.subscriptions.push((Container.instance.get(EventAggregator) as EventAggregator).subscribe(event, callback));
  }

  clearScene() {
    let objectsToRemove = this.pointsScene.children;
    for (let object of objectsToRemove) {
      this.pointsScene.remove(object);
    }
  }

  load(baseUrl: string,  filename: string = 'cloud.js', name?: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(
        // The name of the point cloud which is to be loaded.
        filename,
        // Given the relative URL of a file, should return a full URL (e.g. signed).
        (relativeUrl) => {
          const fullUrl = `${baseUrl}${relativeUrl}`;
          return fullUrl;
        },
      )
      .then(pco => {
        // this.showPcoBbox(pco);
        this.log.debug('PCO', pco);
        if (name) pco.name = name;
        this.pointClouds.push(pco);
        this.pointsScene.add(pco); // Add the loaded point cloud to your ThreeJS scene.
        // The point cloud comes with a material which can be customized directly.
        // Here we just set the size of the points.
        pco.material.size = 1.0;
        return pco;
      });
  }

  showPcoBbox(pco: PointCloudOctree) {
    let bbox = pco.boundingBox;
    let width = bbox.max.x - bbox.min.x;
    let height = bbox.max.y - bbox.min.y;
    let depth = bbox.max.z - bbox.min.z;
    let x = (bbox.max.x + bbox.min.x) / 2;
    let y = (bbox.max.y + bbox.min.y) / 2;
    let z = (bbox.max.z + bbox.min.z) / 2;
    let geometry = new THREE.BoxGeometry( width, height, depth );
    let material = new THREE.MeshBasicMaterial( {color: 0x888888, wireframe: true} );
    let box = new THREE.Mesh( geometry, material );
    box.position.set(x, y, z);
    box.name = 'PCO Bbox Helper';
    this.overlayScene.add(box);
  }

  @computedFrom('pointsScene', 'pointsScene.children', 'pointsScene.children.length')
  get rootPoints(): Array<PointCloudOctree> {
    return this.pointsScene.children.filter(i => i instanceof PointCloudOctree) as PointCloudOctree[];
  }

  zoomOnPco(pco: PointCloudOctree) {
    let position = pco.position.clone();
    let height = pco.boundingBox.max.y - pco.boundingBox.min.y;
    position.y += height * 0.1;
    let camera = this.three.getCamera();
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(pco.position);
    if (camera instanceof THREE.OrthographicCamera) {
      camera.near = 0;
      camera.far = height * 1.5;
      camera.zoom = 1;
      camera.updateProjectionMatrix();
    }
  }


  
}
