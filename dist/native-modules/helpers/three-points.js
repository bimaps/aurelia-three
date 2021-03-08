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
var ThreePoints = (function () {
    function ThreePoints(three) {
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
    ThreePoints.prototype.subscribe = function (event, callback) {
        this.subscriptions.push(Container.instance.get(EventAggregator).subscribe(event, callback));
    };
    ThreePoints.prototype.clearScene = function () {
        var objectsToRemove = this.pointsScene.children;
        for (var _i = 0, objectsToRemove_1 = objectsToRemove; _i < objectsToRemove_1.length; _i++) {
            var object = objectsToRemove_1[_i];
            this.pointsScene.remove(object);
        }
    };
    ThreePoints.prototype.load = function (baseUrl, filename, name) {
        var _this = this;
        if (filename === void 0) { filename = 'cloud.js'; }
        return this.potree
            .loadPointCloud(filename, function (relativeUrl) {
            var fullUrl = "" + baseUrl + relativeUrl;
            return fullUrl;
        })
            .then(function (pco) {
            _this.log.debug('PCO', pco);
            if (name)
                pco.name = name;
            _this.pointClouds.push(pco);
            _this.pointsScene.add(pco);
            pco.material.size = 1.0;
            return pco;
        });
    };
    ThreePoints.prototype.showPcoBbox = function (pco) {
        var bbox = pco.boundingBox;
        var width = bbox.max.x - bbox.min.x;
        var height = bbox.max.y - bbox.min.y;
        var depth = bbox.max.z - bbox.min.z;
        var x = (bbox.max.x + bbox.min.x) / 2;
        var y = (bbox.max.y + bbox.min.y) / 2;
        var z = (bbox.max.z + bbox.min.z) / 2;
        var geometry = new THREE.BoxGeometry(width, height, depth);
        var material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
        var box = new THREE.Mesh(geometry, material);
        box.position.set(x, y, z);
        box.name = 'PCO Bbox Helper';
        this.overlayScene.add(box);
    };
    Object.defineProperty(ThreePoints.prototype, "rootPoints", {
        get: function () {
            return this.pointsScene.children.filter(function (i) { return i instanceof PointCloudOctree; });
        },
        enumerable: false,
        configurable: true
    });
    ThreePoints.prototype.zoomOnPco = function (pco) {
        var position = pco.position.clone();
        var height = pco.boundingBox.max.y - pco.boundingBox.min.y;
        position.y += height * 0.1;
        var camera = this.three.getCamera();
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(pco.position);
        if (camera instanceof THREE.OrthographicCamera) {
            camera.near = 0;
            camera.far = height * 1.5;
            camera.zoom = 1;
            camera.updateProjectionMatrix();
        }
    };
    __decorate([
        computedFrom('pointsScene', 'pointsScene.children', 'pointsScene.children.length'),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ThreePoints.prototype, "rootPoints", null);
    return ThreePoints;
}());
export { ThreePoints };

//# sourceMappingURL=three-points.js.map
