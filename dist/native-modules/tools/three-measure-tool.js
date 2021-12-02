import { ThreeLogger } from './../helpers/three-logger';
import { ThreeUtils } from './../helpers/three-utils';
import { ThreeTool } from './three-tool';
import { Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
import { Line3, ShapeUtils } from 'three';
import { SpriteText2D, textAlign } from 'three-text2d';
import * as numeral from 'numeral';
const log = getLogger('three-measure-tool');
let logThree;
export class ThreeMeasureTool extends ThreeTool {
    constructor(service) {
        super(service);
        this.name = 'measure';
        this.measures = [];
        this.type = 'distance';
        this.volumeStep = 'surface';
        this.snapping = 'summit';
        this.snappingThreshold = 2;
        this.computedSnappingThreshold = 0.5;
        this.subscriptions = [];
        this.currentMeasureCoordinates = [];
        this.isMeasuring = false;
        logThree = new ThreeLogger(service.three);
        logThree.log = false;
    }
    onActivate() {
        let ea = Container.instance.get(EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:raw-processing', (data) => {
            if (!this.active) {
                return;
            }
            if (data.type === 'move') {
                this.handleCursor(data);
            }
            else if (data.type === 'down' && this.currentPoint) {
                this.addCoordinate(this.currentPoint.position.clone());
            }
        }));
        this.subscriptions.push(ea.subscribe('three-camera:moved', () => {
            if (!this.active)
                return;
            this.adjustOverlayToolZoom();
        }));
        this.displayMeasureOverlayTool();
    }
    onDeactivate() {
        for (let sub of this.subscriptions) {
            sub.dispose();
        }
        this.hideCurrentClosestPoint();
        this.hideCurrentMeasureCoordinates();
        this.hideMeasureOverlayTool();
    }
    toggleMeasureTool(toggleWith) {
        if (this.active) {
            if (toggleWith) {
                this.service.activate(toggleWith);
            }
            else {
                this.service.deactivateAll();
            }
        }
        else {
            this.service.activate(this);
        }
    }
    setType(type) {
        if (!this.active)
            this.service.activate(this);
        this.clearMeasuring();
        this.type = type;
        if (this.type === 'volume') {
            this.volumeStep = 'surface';
        }
    }
    volumeNextStep() {
        if (this.type === 'volume' && this.volumeStep === 'surface') {
            this.volumeStep = 'height';
        }
    }
    handleCursor(data) {
        if (!this.active)
            return;
        this.findClosestSummit(data.type, data.mouse, data.camera);
    }
    findClosestSummit(type, mouse, camera) {
        let distance = undefined;
        let closestPoint = undefined;
        const pixelH = (1 / this.three.getRenderer().domElement.clientWidth) * 10;
        const pixelV = (1 / this.three.getRenderer().domElement.clientHeight) * 10;
        const raycaster = new THREE.Raycaster();
        const raypoints = [
            mouse,
            mouse.clone().add(new THREE.Vector2(pixelH, pixelV)),
            mouse.clone().add(new THREE.Vector2(0, pixelV)),
            mouse.clone().add(new THREE.Vector2(-pixelH, pixelV)),
            mouse.clone().add(new THREE.Vector2(-pixelH, 0)),
            mouse.clone().add(new THREE.Vector2(-pixelH, -pixelV)),
            mouse.clone().add(new THREE.Vector2(0, -pixelV)),
            mouse.clone().add(new THREE.Vector2(pixelH, -pixelV)),
            mouse.clone().add(new THREE.Vector2(pixelH, 0))
        ];
        for (let raypoint of raypoints) {
            raycaster.setFromCamera(raypoint, camera);
            let clippingDistance = 0;
            let plane = null;
            let direction;
            let intersections = raycaster.intersectObjects(this.three.getScene().children, true);
            if (typeof this.filterObjects === 'function') {
                intersections = this.filterObjects(type, intersections);
            }
            if (intersections.length === 0) {
                continue;
            }
            for (let intersection of intersections) {
                const object = intersection.object;
                const coordinates = [];
                if (object instanceof THREE.Mesh && intersection.face) {
                    const geometry = object.geometry;
                    const face = intersection.face;
                    if (this.snapping === 'summit') {
                        coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a));
                        coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b));
                        coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                    }
                    else if (this.snapping === 'edge') {
                        const lineA = new Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b));
                        const lineB = new Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                        const lineC = new Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                        const vA = new THREE.Vector3();
                        const vB = new THREE.Vector3();
                        const vC = new THREE.Vector3();
                        lineA.closestPointToPoint(intersection.point, true, vA);
                        lineB.closestPointToPoint(intersection.point, true, vB);
                        lineC.closestPointToPoint(intersection.point, true, vC);
                        coordinates.push(vA);
                        coordinates.push(vB);
                        coordinates.push(vC);
                    }
                }
                for (let coordinate of coordinates) {
                    const currentDistance = coordinate.distanceTo(intersection.point);
                    if (clippingDistance && plane) {
                        if (direction === 'BACK' && intersection.distance > clippingDistance) {
                            continue;
                        }
                        else if (direction === 'FRONT' && intersection.distance < clippingDistance) {
                            continue;
                        }
                    }
                    if (currentDistance > this.computedSnappingThreshold) {
                        continue;
                    }
                    if (currentDistance < distance || distance === undefined) {
                        closestPoint = coordinate;
                        distance = currentDistance;
                        break;
                    }
                }
            }
        }
        if (closestPoint) {
            this.displayCurrentClosestPoint(closestPoint);
        }
        else {
            this.hideCurrentClosestPoint();
        }
    }
    displayCurrentClosestPoint(point) {
        if (!this.currentPoint) {
            const currentPointGeometry = new THREE.SphereBufferGeometry(0.1);
            const currentPointMaterial = new THREE.MeshBasicMaterial({ color: 'red', opacity: 0.5, transparent: true });
            this.currentPoint = new THREE.Mesh(currentPointGeometry, currentPointMaterial);
            this.currentPoint.name = '__measure_current-point__';
            this.currentPoint.material.depthTest = false;
            this.currentPoint.renderOrder = 11;
            this.adjustOverlayToolZoom();
        }
        this.three.getScene('overlay').remove(this.currentPoint);
        this.currentPoint.position.set(point.x, point.y, point.z);
        this.three.getScene('overlay').add(this.currentPoint);
    }
    hideCurrentClosestPoint() {
        if (this.currentPoint) {
            this.three.getScene('overlay').remove(this.currentPoint);
            delete this.currentPoint;
        }
    }
    displayCurrentMeasureCoordinates() {
        this.hideCurrentMeasureCoordinates();
        this.currentMeasureCoordinates = [];
        if (!this.currentMeasure) {
            return;
        }
        for (let coord of this.currentMeasure.coords) {
            const geometry = new THREE.SphereBufferGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 'green', opacity: 0.5, transparent: true });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(coord.x, coord.y, coord.z);
            mesh.name = '__measure_current-measure-coordinate__';
            mesh.material.depthTest = false;
            mesh.renderOrder = 11;
            this.currentMeasureCoordinates.push(mesh);
            this.three.getScene('overlay').add(mesh);
        }
        if ((this.type === 'surface' || this.type === 'volume') && this.currentMeasure.coords.length > 2) {
            const surfaceShape = new THREE.Shape();
            const points = this.currentMeasure.coords.map(c => new THREE.Vector2(c.x, c.z));
            surfaceShape.setFromPoints(points);
            const shapeGeometry = new THREE.ShapeGeometry(surfaceShape);
            const shapeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, depthTest: false, opacity: 0.2, transparent: true });
            const surfaceMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
            surfaceMesh.name = '__measure_current-measure-surface__';
            surfaceMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            surfaceMesh.renderOrder = 10;
            surfaceMesh.position.setY(Math.max(...this.currentMeasure.coords.map(c => c.y)));
            this.currentMeasureCoordinates.push(surfaceMesh);
            this.three.getScene('overlay').add(surfaceMesh);
        }
        this.adjustOverlayToolZoom();
    }
    hideCurrentMeasureCoordinates() {
        for (let mesh of this.currentMeasureCoordinates) {
            this.three.getScene('overlay').remove(mesh);
        }
    }
    displayMeasures() {
        for (let measure of this.measures) {
            if (!measure.display) {
                this.generateMeasureObject(measure);
            }
            if (measure.display) {
                for (let mesh of measure.display.points) {
                    mesh.visible = true;
                }
                for (let line of measure.display.lines) {
                    line.visible = true;
                }
                for (let label of measure.display.labels) {
                    label.visible = true;
                }
            }
        }
        this.adjustOverlayToolZoom();
    }
    hideMeasures() {
        for (let measure of this.measures) {
            if (measure.display) {
                for (let mesh of measure.display.points) {
                    mesh.visible = false;
                }
                for (let line of measure.display.lines) {
                    line.visible = false;
                }
                for (let label of measure.display.labels) {
                    label.visible = false;
                }
            }
        }
    }
    generateMeasureObject(measure) {
        if (!measure.display) {
            measure.display = {
                points: [],
                lines: [],
                labels: []
            };
        }
        if (measure.type === 'distance') {
            const geometry = new THREE.SphereBufferGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
            const point1 = new THREE.Mesh(geometry, material);
            const point2 = point1.clone();
            point1.name = '__measure_current-measure-point__';
            point2.name = '__measure_current-measure-point__';
            point1.material.depthTest = false;
            point1.renderOrder = 10;
            point2.material.depthTest = false;
            point2.renderOrder = 10;
            point1.position.set(measure.coords[0].x, measure.coords[0].y, measure.coords[0].z);
            point2.position.set(measure.coords[1].x, measure.coords[1].y, measure.coords[1].z);
            measure.display.points.push(point1, point2);
            this.three.getScene('overlay').add(point1, point2);
            const points = [];
            points.push(measure.coords[0]);
            points.push(measure.coords[1]);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            let line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 'black', opacity: 1, side: THREE.DoubleSide }));
            line.name = '__measure_current-measure-line__';
            line.material.depthTest = false;
            line.renderOrder = 10;
            measure.display.lines.push(line);
            this.three.getScene('overlay').add(line);
            const value = numeral(measure.value).format('0.00');
            const sprite = new SpriteText2D(value.toString(), {
                align: textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            var dir = measure.coords[0].clone().sub(measure.coords[1]);
            var len = dir.length();
            dir = dir.normalize().multiplyScalar(len * -0.5);
            const spritePosition = measure.coords[0].clone().add(dir);
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'horizontal') {
            const geometry = new THREE.SphereBufferGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
            const point1 = new THREE.Mesh(geometry, material);
            const point2 = point1.clone();
            point1.name = '__measure_current-measure-point__';
            point2.name = '__measure_current-measure-point__';
            point1.material.depthTest = false;
            point1.renderOrder = 10;
            point2.material.depthTest = false;
            point2.renderOrder = 10;
            const projectedCoord = measure.coords[1].clone().setY(measure.coords[0].y);
            point1.position.set(measure.coords[0].x, measure.coords[0].y, measure.coords[0].z);
            point2.position.set(projectedCoord.x, projectedCoord.y, projectedCoord.z);
            measure.display.points.push(point1, point2);
            this.three.getScene('overlay').add(point1, point2);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([measure.coords[0], projectedCoord]);
            let line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 'black', opacity: 1, side: THREE.DoubleSide }));
            line.name = '__measure_current-measure-line__';
            line.material.depthTest = false;
            line.renderOrder = 10;
            measure.display.lines.push(line);
            this.three.getScene('overlay').add(line);
            const projectedLineGeometry = new THREE.BufferGeometry().setFromPoints([measure.coords[1], projectedCoord]);
            let projectedLine = new THREE.Line(projectedLineGeometry, new THREE.LineBasicMaterial({ color: '#fff', opacity: 1, side: THREE.DoubleSide }));
            projectedLine.name = '__measure_current-measure-line__';
            projectedLine.material.depthTest = false;
            projectedLine.renderOrder = 10;
            measure.display.lines.push(projectedLine);
            this.three.getScene('overlay').add(projectedLine);
            const value = Math.round(measure.value * 100) / 100;
            const sprite = new SpriteText2D(value.toString(), {
                align: textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            var dir = measure.coords[0].clone().sub(measure.coords[1]);
            var len = dir.length();
            dir = dir.normalize().multiplyScalar(len * -0.5);
            const spritePosition = measure.coords[0].clone().add(dir);
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'surface') {
            const geometry = new THREE.SphereBufferGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true, depthTest: false });
            const originalPoint = new THREE.Mesh(geometry, material);
            originalPoint.name = '__measure_current-measure-point__';
            originalPoint.renderOrder = 10;
            for (const coord of measure.coords) {
                const point = originalPoint.clone();
                point.position.set(coord.x, coord.y, coord.z);
                measure.display.points.push(point);
                this.three.getScene('overlay').add(point);
            }
            const surfaceShape = new THREE.Shape();
            surfaceShape.setFromPoints(measure.coords.map(c => new THREE.Vector2(c.x, c.z)));
            const shapeGeometry = new THREE.ShapeGeometry(surfaceShape);
            const shapeMaterial = new THREE.MeshBasicMaterial({ color: '#CCDDFF', side: THREE.DoubleSide, depthTest: false, opacity: 0.3, transparent: true });
            const surfaceMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
            surfaceMesh.name = '__measure_current-measure-point__';
            surfaceMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            surfaceMesh.renderOrder = 10;
            surfaceMesh.position.setY(Math.max(...this.currentMeasure.coords.map(c => c.y)));
            measure.display.points.push(surfaceMesh);
            this.three.getScene('overlay').add(surfaceMesh);
            const value = Math.round(measure.value * 100) / 100;
            const sprite = new SpriteText2D(value.toString(), {
                align: textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            const centroid = ThreeUtils.centroidFromObject(surfaceMesh);
            const spritePosition = centroid;
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'volume') {
            const geometry = new THREE.SphereBufferGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true, depthTest: false });
            const originalPoint = new THREE.Mesh(geometry, material);
            originalPoint.name = '__measure_current-measure-point__';
            originalPoint.renderOrder = 10;
            for (const coord of measure.coords) {
                const point = originalPoint.clone();
                point.position.set(coord.x, coord.y, coord.z);
                measure.display.points.push(point);
                this.three.getScene('overlay').add(point);
            }
            const surfaceShape = new THREE.Shape();
            surfaceShape.setFromPoints(measure.coords.map(c => new THREE.Vector2(c.x, c.z)));
            const depth = measure.coords[0].y - measure.volumeLastCoord.y;
            console.log('depth', depth);
            const invert = depth < 0;
            const extrudeSettings = {
                steps: 2,
                depth: Math.abs(depth),
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 1
            };
            const volumeGeometry = new THREE.ExtrudeGeometry(surfaceShape, extrudeSettings);
            const volumeMaterial = new THREE.MeshBasicMaterial({ color: '#CCDDFF', side: THREE.DoubleSide, depthTest: false, opacity: 0.3, transparent: true });
            const volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);
            volumeMesh.name = '__measure_current-measure-point__';
            volumeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            volumeMesh.renderOrder = 10;
            volumeMesh.position.setY(Math.max(...this.currentMeasure.coords.map(c => c.y)));
            if (invert) {
                volumeMesh.position.setY(volumeMesh.position.y - depth);
            }
            measure.display.points.push(volumeMesh);
            this.three.getScene('overlay').add(volumeMesh);
            const value = Math.round(measure.value * 100) / 100;
            const sprite = new SpriteText2D(value.toString(), {
                align: textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            const centroid = ThreeUtils.centroidFromObject(volumeMesh);
            const spritePosition = centroid;
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
    }
    addCoordinate(coord) {
        this.isMeasuring = true;
        if (!this.currentMeasure) {
            this.currentMeasure = {
                type: this.type,
                coords: [coord],
                value: 0
            };
        }
        else if (this.type !== 'volume' || this.volumeStep !== 'height') {
            this.currentMeasure.coords.push(coord);
        }
        else if (this.type === 'volume' && this.volumeStep === 'height') {
            this.currentMeasure.volumeLastCoord = coord;
        }
        if (this.currentMeasure.type === 'distance' && this.currentMeasure.coords.length === 2) {
            this.currentMeasure.value = this.currentMeasure.coords[0].distanceTo(this.currentMeasure.coords[1]);
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
        }
        else if (this.currentMeasure.type === 'horizontal' && this.currentMeasure.coords.length === 2) {
            const projectedCoord = this.currentMeasure.coords[1].clone().setY(this.currentMeasure.coords[0].y);
            this.currentMeasure.value = this.currentMeasure.coords[0].distanceTo(projectedCoord);
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
        }
        else if (this.currentMeasure.type === 'surface' || this.currentMeasure.type === 'volume') {
            if (this.currentMeasure.coords.length > 2) {
                const contour = this.currentMeasure.coords.map(c => {
                    return {
                        x: c.x,
                        y: c.z
                    };
                });
                const area = ShapeUtils.area(contour);
                this.currentMeasure.value = Math.abs(area);
            }
        }
        if (this.currentMeasure.type === 'volume' && this.volumeStep === 'height') {
            const height = Math.abs(this.currentMeasure.coords[0].y - this.currentMeasure.volumeLastCoord.y);
            this.currentMeasure.value *= height;
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
            this.volumeStep = 'surface';
        }
        this.displayCurrentMeasureCoordinates();
    }
    endMeasuring() {
        if (this.currentMeasure.type === 'surface' && (this.currentMeasure.coords.length < 3 || !this.currentMeasure.value)) {
            this.clearMeasuring();
        }
        else if (this.currentMeasure.type === 'surface') {
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
        }
        else {
            throw new Error('Volume measurement not yet implemented');
        }
        this.displayCurrentMeasureCoordinates();
    }
    clearMeasuring() {
        this.isMeasuring = false;
        this.currentMeasure = undefined;
        this.displayCurrentMeasureCoordinates();
    }
    clearMeasures() {
        for (let measure of this.measures) {
            if (measure.display) {
                for (let object of measure.display.points) {
                    this.three.getScene('overlay').remove(object);
                }
                for (let object of measure.display.lines) {
                    this.three.getScene('overlay').remove(object);
                }
                for (let object of measure.display.labels) {
                    this.three.getScene('overlay').remove(object);
                }
            }
        }
        this.measures = [];
    }
    removeMeasure(measure) {
        const index = this.measures.indexOf(measure);
        if (index !== -1) {
            this.measures.splice(index, 1);
        }
    }
    displayMeasureOverlayTool() {
        if (!this.overlayTool) {
            this.createOverlayTool();
        }
        if (this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').add(this.overlayTool);
        this.overlayTool.userData.displayed = true;
        this.adjustOverlayToolPosition();
        this.adjustOverlayToolZoom();
        this.adjustActiveTool();
    }
    hideMeasureOverlayTool() {
        if (!this.overlayTool || !this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayTool);
        this.overlayTool.userData.displayed = false;
    }
    createOverlayTool() {
        let group = new THREE.Group();
        group.name = '__measure-tools__';
        let groupContainer = new THREE.Group;
        groupContainer.name = '__measure-tools-container__';
        groupContainer.add(group);
        groupContainer.traverse((obj) => {
            obj.renderOrder = 10;
            if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line) && (obj.material instanceof THREE.MeshBasicMaterial || obj.material instanceof THREE.LineBasicMaterial)) {
                obj.material.depthTest = false;
            }
        });
        this.overlayTool = groupContainer;
        this.adjustOverlayToolZoom();
    }
    adjustOverlayToolPosition() {
        if (!this.overlayTool)
            return;
    }
    adjustOverlayToolZoom() {
        let camera = this.three.getCamera();
        if (camera instanceof THREE.OrthographicCamera) {
            let cameraZoom = camera.zoom;
            this.computedSnappingThreshold = this.snappingThreshold * 50 / cameraZoom;
            if (this.currentPoint) {
                this.currentPoint.scale.setScalar(50 / cameraZoom);
            }
            for (let mesh of this.currentMeasureCoordinates) {
                if (mesh.geometry instanceof THREE.ShapeGeometry || mesh.geometry instanceof THREE.ExtrudeGeometry) {
                    continue;
                }
                mesh.scale.setScalar(50 / cameraZoom);
            }
            for (let measure of this.measures) {
                if (measure.display) {
                    for (let obj of measure.display.points) {
                        if (obj.geometry instanceof THREE.ShapeGeometry || obj.geometry instanceof THREE.ExtrudeGeometry) {
                            continue;
                        }
                        obj.scale.setScalar(50 / cameraZoom);
                    }
                    for (let obj of measure.display.labels) {
                        obj.scale.setScalar(0.8 / cameraZoom);
                    }
                }
            }
        }
    }
    adjustActiveTool() {
        if (!this.overlayTool)
            return;
        let tool = this.overlayTool.getObjectByName('__measure-tools__');
    }
    generateEdges() {
        this.three.getScene().traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                const edges = new THREE.EdgesGeometry(obj.geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#ccc' }));
                line.name = '__measure-tools-edges__';
                line.userData.originalObject = obj;
                line.renderOrder = 9;
                this.three.getScene('overlay').add(line);
            }
        });
    }
    removeEdges() {
        const objToRemove = [];
        this.three.getScene('overlay').traverse((obj) => {
            if (obj.name === '__measure-tools-edges__') {
                objToRemove.push(obj);
            }
        });
        for (let obj of objToRemove) {
            this.three.getScene('overlay').remove(obj);
        }
    }
}

//# sourceMappingURL=three-measure-tool.js.map
