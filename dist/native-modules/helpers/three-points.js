var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Container, computedFrom } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
window.THREE = THREE;
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { EventAggregator } from 'aurelia-event-aggregator';
export class ThreePoints {
    constructor(three) {
        this.log = getLogger('three-points');
        this.pointsBudgets = 2000000;
        this.pointClouds = [];
        this.subscriptions = [];
        this.three = three;
        this.scene = this.three.getScene();
        this.pointsScene = this.three.getScene('points');
        this.overlayScene = this.three.getScene('overlay');
        this.potree = new Potree();
        this.potree.pointBudget = this.pointsBudgets;
    }
    subscribe(event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    }
    clearScene() {
        let objectsToRemove = this.pointsScene.children;
        for (let object of objectsToRemove) {
            this.pointsScene.remove(object);
        }
    }
    load(baseUrl, filename = 'cloud.js', name) {
        return this.potree
            .loadPointCloud(filename, (relativeUrl) => {
            const fullUrl = `${baseUrl}${relativeUrl}`;
            return fullUrl;
        })
            .then(pco => {
            this.log.debug('PCO', pco);
            if (name)
                pco.name = name;
            this.pointClouds.push(pco);
            this.pointsScene.add(pco);
            pco.material.size = 1.0;
            return pco;
        });
    }
    showPcoBbox(pco) {
        let bbox = pco.boundingBox;
        let width = bbox.max.x - bbox.min.x;
        let height = bbox.max.y - bbox.min.y;
        let depth = bbox.max.z - bbox.min.z;
        let x = (bbox.max.x + bbox.min.x) / 2;
        let y = (bbox.max.y + bbox.min.y) / 2;
        let z = (bbox.max.z + bbox.min.z) / 2;
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
        let box = new THREE.Mesh(geometry, material);
        box.position.set(x, y, z);
        box.name = 'PCO Bbox Helper';
        this.overlayScene.add(box);
    }
    get rootPoints() {
        return this.pointsScene.children.filter(i => i instanceof PointCloudOctree);
    }
    zoomOnPco(pco) {
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
__decorate([
    computedFrom('pointsScene', 'pointsScene.children', 'pointsScene.children.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreePoints.prototype, "rootPoints", null);

//# sourceMappingURL=three-points.js.map
