"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMeasureTool = void 0;
var three_logger_1 = require("./../helpers/three-logger");
var three_utils_1 = require("./../helpers/three-utils");
var three_tool_1 = require("./three-tool");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_logging_1 = require("aurelia-logging");
var THREE = require("three");
var three_1 = require("three");
var three_text2d_1 = require("three-text2d");
var numeral = require("numeral");
var log = aurelia_logging_1.getLogger('three-measure-tool');
var logThree;
var ThreeMeasureTool = (function (_super) {
    __extends(ThreeMeasureTool, _super);
    function ThreeMeasureTool(service) {
        var _this = _super.call(this, service) || this;
        _this.name = 'measure';
        _this.measures = [];
        _this.type = 'distance';
        _this.volumeStep = 'surface';
        _this.snapping = 'summit';
        _this.snappingThreshold = 2;
        _this.computedSnappingThreshold = 0.5;
        _this.subscriptions = [];
        _this.currentMeasureCoordinates = [];
        _this.isMeasuring = false;
        logThree = new three_logger_1.ThreeLogger(service.three);
        logThree.log = false;
        return _this;
    }
    ThreeMeasureTool.prototype.onActivate = function () {
        var _this = this;
        var ea = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:raw-processing', function (data) {
            if (!_this.active) {
                return;
            }
            if (data.type === 'move') {
                _this.handleCursor(data);
            }
            else if (data.type === 'down' && _this.currentPoint) {
                _this.addCoordinate(_this.currentPoint.position.clone());
            }
        }));
        this.subscriptions.push(ea.subscribe('three-camera:moved', function () {
            if (!_this.active)
                return;
            _this.adjustOverlayToolZoom();
        }));
        this.displayMeasureOverlayTool();
    };
    ThreeMeasureTool.prototype.onDeactivate = function () {
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
        this.hideCurrentClosestPoint();
        this.hideCurrentMeasureCoordinates();
        this.hideMeasureOverlayTool();
    };
    ThreeMeasureTool.prototype.toggleMeasureTool = function (toggleWith) {
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
    };
    ThreeMeasureTool.prototype.setType = function (type) {
        if (!this.active)
            this.service.activate(this);
        this.clearMeasuring();
        this.type = type;
        if (this.type === 'volume') {
            this.volumeStep = 'surface';
        }
    };
    ThreeMeasureTool.prototype.volumeNextStep = function () {
        if (this.type === 'volume' && this.volumeStep === 'surface') {
            this.volumeStep = 'height';
        }
    };
    ThreeMeasureTool.prototype.handleCursor = function (data) {
        if (!this.active)
            return;
        this.findClosestSummit(data.type, data.mouse, data.camera);
    };
    ThreeMeasureTool.prototype.findClosestSummit = function (type, mouse, camera) {
        var distance = undefined;
        var closestPoint = undefined;
        var pixelH = (1 / this.three.getRenderer().domElement.clientWidth) * 10;
        var pixelV = (1 / this.three.getRenderer().domElement.clientHeight) * 10;
        var raycaster = new THREE.Raycaster();
        var raypoints = [
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
        for (var _i = 0, raypoints_1 = raypoints; _i < raypoints_1.length; _i++) {
            var raypoint = raypoints_1[_i];
            raycaster.setFromCamera(raypoint, camera);
            var clippingDistance = 0;
            var plane = null;
            var direction = void 0;
            var intersections = raycaster.intersectObjects(this.three.getScene().children, true);
            if (typeof this.filterObjects === 'function') {
                intersections = this.filterObjects(type, intersections);
            }
            if (intersections.length === 0) {
                continue;
            }
            for (var _a = 0, intersections_1 = intersections; _a < intersections_1.length; _a++) {
                var intersection = intersections_1[_a];
                var object = intersection.object;
                var coordinates = [];
                if (object instanceof THREE.Mesh && intersection.face) {
                    var geometry = object.geometry;
                    var face = intersection.face;
                    if (this.snapping === 'summit') {
                        if (geometry instanceof THREE.Geometry) {
                            coordinates.push(geometry.vertices[face.a]);
                            coordinates.push(geometry.vertices[face.b]);
                            coordinates.push(geometry.vertices[face.c]);
                        }
                        else if (geometry instanceof THREE.BufferGeometry) {
                            coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a));
                            coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b));
                            coordinates.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                        }
                    }
                    else if (this.snapping === 'edge') {
                        if (geometry instanceof THREE.Geometry) {
                            var lineA = new three_1.Line3(geometry.vertices[face.a], geometry.vertices[face.b]);
                            var lineB = new three_1.Line3(geometry.vertices[face.a], geometry.vertices[face.c]);
                            var lineC = new three_1.Line3(geometry.vertices[face.b], geometry.vertices[face.c]);
                            var vA = new THREE.Vector3();
                            var vB = new THREE.Vector3();
                            var vC = new THREE.Vector3();
                            lineA.closestPointToPoint(intersection.point, true, vA);
                            lineB.closestPointToPoint(intersection.point, true, vB);
                            lineC.closestPointToPoint(intersection.point, true, vC);
                            coordinates.push(vA);
                            coordinates.push(vB);
                            coordinates.push(vC);
                        }
                        else if (geometry instanceof THREE.BufferGeometry) {
                            var lineA = new three_1.Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b));
                            var lineB = new three_1.Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.a), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                            var lineC = new three_1.Line3(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.b), new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, face.c));
                            var vA = new THREE.Vector3();
                            var vB = new THREE.Vector3();
                            var vC = new THREE.Vector3();
                            lineA.closestPointToPoint(intersection.point, true, vA);
                            lineB.closestPointToPoint(intersection.point, true, vB);
                            lineC.closestPointToPoint(intersection.point, true, vC);
                            coordinates.push(vA);
                            coordinates.push(vB);
                            coordinates.push(vC);
                        }
                    }
                }
                for (var _b = 0, coordinates_1 = coordinates; _b < coordinates_1.length; _b++) {
                    var coordinate = coordinates_1[_b];
                    var currentDistance = coordinate.distanceTo(intersection.point);
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
    };
    ThreeMeasureTool.prototype.displayCurrentClosestPoint = function (point) {
        if (!this.currentPoint) {
            var currentPointGeometry = new THREE.SphereBufferGeometry(0.1);
            var currentPointMaterial = new THREE.MeshBasicMaterial({ color: 'red', opacity: 0.5, transparent: true });
            this.currentPoint = new THREE.Mesh(currentPointGeometry, currentPointMaterial);
            this.currentPoint.name = '__measure_current-point__';
            this.currentPoint.material.depthTest = false;
            this.currentPoint.renderOrder = 11;
            this.adjustOverlayToolZoom();
        }
        this.three.getScene('overlay').remove(this.currentPoint);
        this.currentPoint.position.set(point.x, point.y, point.z);
        this.three.getScene('overlay').add(this.currentPoint);
    };
    ThreeMeasureTool.prototype.hideCurrentClosestPoint = function () {
        if (this.currentPoint) {
            this.three.getScene('overlay').remove(this.currentPoint);
            delete this.currentPoint;
        }
    };
    ThreeMeasureTool.prototype.displayCurrentMeasureCoordinates = function () {
        this.hideCurrentMeasureCoordinates();
        this.currentMeasureCoordinates = [];
        if (!this.currentMeasure) {
            return;
        }
        for (var _i = 0, _a = this.currentMeasure.coords; _i < _a.length; _i++) {
            var coord = _a[_i];
            var geometry = new THREE.SphereBufferGeometry(0.1);
            var material = new THREE.MeshBasicMaterial({ color: 'green', opacity: 0.5, transparent: true });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(coord.x, coord.y, coord.z);
            mesh.name = '__measure_current-measure-coordinate__';
            mesh.material.depthTest = false;
            mesh.renderOrder = 11;
            this.currentMeasureCoordinates.push(mesh);
            this.three.getScene('overlay').add(mesh);
        }
        if ((this.type === 'surface' || this.type === 'volume') && this.currentMeasure.coords.length > 2) {
            var surfaceShape = new THREE.Shape();
            var points = this.currentMeasure.coords.map(function (c) { return new THREE.Vector2(c.x, c.z); });
            surfaceShape.setFromPoints(points);
            var shapeGeometry = new THREE.ShapeGeometry(surfaceShape);
            var shapeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, depthTest: false, opacity: 0.2, transparent: true });
            var surfaceMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
            surfaceMesh.name = '__measure_current-measure-surface__';
            surfaceMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            surfaceMesh.renderOrder = 10;
            surfaceMesh.position.setY(Math.max.apply(Math, this.currentMeasure.coords.map(function (c) { return c.y; })));
            this.currentMeasureCoordinates.push(surfaceMesh);
            this.three.getScene('overlay').add(surfaceMesh);
        }
        this.adjustOverlayToolZoom();
    };
    ThreeMeasureTool.prototype.hideCurrentMeasureCoordinates = function () {
        for (var _i = 0, _a = this.currentMeasureCoordinates; _i < _a.length; _i++) {
            var mesh = _a[_i];
            this.three.getScene('overlay').remove(mesh);
        }
    };
    ThreeMeasureTool.prototype.displayMeasures = function () {
        for (var _i = 0, _a = this.measures; _i < _a.length; _i++) {
            var measure = _a[_i];
            if (!measure.display) {
                this.generateMeasureObject(measure);
            }
            if (measure.display) {
                for (var _b = 0, _c = measure.display.points; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    mesh.visible = true;
                }
                for (var _d = 0, _e = measure.display.lines; _d < _e.length; _d++) {
                    var line = _e[_d];
                    line.visible = true;
                }
                for (var _f = 0, _g = measure.display.labels; _f < _g.length; _f++) {
                    var label = _g[_f];
                    label.visible = true;
                }
            }
        }
        this.adjustOverlayToolZoom();
    };
    ThreeMeasureTool.prototype.hideMeasures = function () {
        for (var _i = 0, _a = this.measures; _i < _a.length; _i++) {
            var measure = _a[_i];
            if (measure.display) {
                for (var _b = 0, _c = measure.display.points; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    mesh.visible = false;
                }
                for (var _d = 0, _e = measure.display.lines; _d < _e.length; _d++) {
                    var line = _e[_d];
                    line.visible = false;
                }
                for (var _f = 0, _g = measure.display.labels; _f < _g.length; _f++) {
                    var label = _g[_f];
                    label.visible = false;
                }
            }
        }
    };
    ThreeMeasureTool.prototype.generateMeasureObject = function (measure) {
        if (!measure.display) {
            measure.display = {
                points: [],
                lines: [],
                labels: []
            };
        }
        if (measure.type === 'distance') {
            var geometry = new THREE.SphereBufferGeometry(0.1);
            var material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
            var point1 = new THREE.Mesh(geometry, material);
            var point2 = point1.clone();
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
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(measure.coords[0], measure.coords[1]);
            var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 'black', opacity: 1, side: THREE.DoubleSide }));
            line.name = '__measure_current-measure-line__';
            line.material.depthTest = false;
            line.renderOrder = 10;
            measure.display.lines.push(line);
            this.three.getScene('overlay').add(line);
            var value = numeral(measure.value).format('0.00');
            var sprite = new three_text2d_1.SpriteText2D(value.toString(), {
                align: three_text2d_1.textAlign.center,
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
            var spritePosition = measure.coords[0].clone().add(dir);
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.name = name;
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'horizontal') {
            var geometry = new THREE.SphereBufferGeometry(0.1);
            var material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
            var point1 = new THREE.Mesh(geometry, material);
            var point2 = point1.clone();
            point1.name = '__measure_current-measure-point__';
            point2.name = '__measure_current-measure-point__';
            point1.material.depthTest = false;
            point1.renderOrder = 10;
            point2.material.depthTest = false;
            point2.renderOrder = 10;
            var projectedCoord = measure.coords[1].clone().setY(measure.coords[0].y);
            point1.position.set(measure.coords[0].x, measure.coords[0].y, measure.coords[0].z);
            point2.position.set(projectedCoord.x, projectedCoord.y, projectedCoord.z);
            measure.display.points.push(point1, point2);
            this.three.getScene('overlay').add(point1, point2);
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(measure.coords[0], projectedCoord);
            var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 'black', opacity: 1, side: THREE.DoubleSide }));
            line.name = '__measure_current-measure-line__';
            line.material.depthTest = false;
            line.renderOrder = 10;
            measure.display.lines.push(line);
            this.three.getScene('overlay').add(line);
            var projectedLineGeometry = new THREE.Geometry();
            projectedLineGeometry.vertices.push(measure.coords[1], projectedCoord);
            var projectedLine = new THREE.Line(projectedLineGeometry, new THREE.LineBasicMaterial({ color: '#fff', opacity: 1, side: THREE.DoubleSide }));
            projectedLine.name = '__measure_current-measure-line__';
            projectedLine.material.depthTest = false;
            projectedLine.renderOrder = 10;
            measure.display.lines.push(projectedLine);
            this.three.getScene('overlay').add(projectedLine);
            var value = Math.round(measure.value * 100) / 100;
            var sprite = new three_text2d_1.SpriteText2D(value.toString(), {
                align: three_text2d_1.textAlign.center,
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
            var spritePosition = measure.coords[0].clone().add(dir);
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.name = name;
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'surface') {
            var geometry = new THREE.SphereBufferGeometry(0.1);
            var material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true, depthTest: false });
            var originalPoint = new THREE.Mesh(geometry, material);
            originalPoint.name = '__measure_current-measure-point__';
            originalPoint.renderOrder = 10;
            for (var _i = 0, _a = measure.coords; _i < _a.length; _i++) {
                var coord = _a[_i];
                var point = originalPoint.clone();
                point.position.set(coord.x, coord.y, coord.z);
                measure.display.points.push(point);
                this.three.getScene('overlay').add(point);
            }
            var surfaceShape = new THREE.Shape();
            surfaceShape.setFromPoints(measure.coords.map(function (c) { return new THREE.Vector2(c.x, c.z); }));
            var shapeGeometry = new THREE.ShapeGeometry(surfaceShape);
            var shapeMaterial = new THREE.MeshBasicMaterial({ color: '#CCDDFF', side: THREE.DoubleSide, depthTest: false, opacity: 0.3, transparent: true });
            var surfaceMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
            surfaceMesh.name = '__measure_current-measure-point__';
            surfaceMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            surfaceMesh.renderOrder = 10;
            surfaceMesh.position.setY(Math.max.apply(Math, this.currentMeasure.coords.map(function (c) { return c.y; })));
            measure.display.points.push(surfaceMesh);
            this.three.getScene('overlay').add(surfaceMesh);
            var value = Math.round(measure.value * 100) / 100;
            var sprite = new three_text2d_1.SpriteText2D(value.toString(), {
                align: three_text2d_1.textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            var centroid = three_utils_1.ThreeUtils.centroidFromObject(surfaceMesh);
            var spritePosition = centroid;
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.name = name;
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
        else if (measure.type === 'volume') {
            var geometry = new THREE.SphereBufferGeometry(0.1);
            var material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true, depthTest: false });
            var originalPoint = new THREE.Mesh(geometry, material);
            originalPoint.name = '__measure_current-measure-point__';
            originalPoint.renderOrder = 10;
            for (var _b = 0, _c = measure.coords; _b < _c.length; _b++) {
                var coord = _c[_b];
                var point = originalPoint.clone();
                point.position.set(coord.x, coord.y, coord.z);
                measure.display.points.push(point);
                this.three.getScene('overlay').add(point);
            }
            var surfaceShape = new THREE.Shape();
            surfaceShape.setFromPoints(measure.coords.map(function (c) { return new THREE.Vector2(c.x, c.z); }));
            var depth = measure.coords[0].y - measure.volumeLastCoord.y;
            console.log('depth', depth);
            var invert = depth < 0;
            var extrudeSettings = {
                steps: 2,
                depth: Math.abs(depth),
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 1
            };
            var volumeGeometry = new THREE.ExtrudeGeometry(surfaceShape, extrudeSettings);
            var volumeMaterial = new THREE.MeshBasicMaterial({ color: '#CCDDFF', side: THREE.DoubleSide, depthTest: false, opacity: 0.3, transparent: true });
            var volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);
            volumeMesh.name = '__measure_current-measure-point__';
            volumeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            volumeMesh.renderOrder = 10;
            volumeMesh.position.setY(Math.max.apply(Math, this.currentMeasure.coords.map(function (c) { return c.y; })));
            if (invert) {
                volumeMesh.position.setY(volumeMesh.position.y - depth);
            }
            measure.display.points.push(volumeMesh);
            this.three.getScene('overlay').add(volumeMesh);
            var value = Math.round(measure.value * 100) / 100;
            var sprite = new three_text2d_1.SpriteText2D(value.toString(), {
                align: three_text2d_1.textAlign.center,
                font: '20px Arial',
                fillStyle: '#000000',
                backgroundColor: '#ffffff',
                verticalPadding: 2,
                horizontalPadding: 2,
                antialias: false
            });
            var centroid = three_utils_1.ThreeUtils.centroidFromObject(volumeMesh);
            var spritePosition = centroid;
            sprite.position.set(spritePosition.x, spritePosition.y, spritePosition.z);
            sprite.name = name;
            sprite.userData._type = '__measure_current-measure-label__';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            measure.display.labels.push(sprite);
            this.three.getScene('overlay').add(sprite);
        }
    };
    ThreeMeasureTool.prototype.addCoordinate = function (coord) {
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
            var projectedCoord = this.currentMeasure.coords[1].clone().setY(this.currentMeasure.coords[0].y);
            this.currentMeasure.value = this.currentMeasure.coords[0].distanceTo(projectedCoord);
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
        }
        else if (this.currentMeasure.type === 'surface' || this.currentMeasure.type === 'volume') {
            if (this.currentMeasure.coords.length > 2) {
                var contour = this.currentMeasure.coords.map(function (c) {
                    return {
                        x: c.x,
                        y: c.z
                    };
                });
                var area = three_1.ShapeUtils.area(contour);
                this.currentMeasure.value = Math.abs(area);
            }
        }
        if (this.currentMeasure.type === 'volume' && this.volumeStep === 'height') {
            var height = Math.abs(this.currentMeasure.coords[0].y - this.currentMeasure.volumeLastCoord.y);
            this.currentMeasure.value *= height;
            this.measures.push(this.currentMeasure);
            this.displayMeasures();
            this.clearMeasuring();
            this.volumeStep = 'surface';
        }
        this.displayCurrentMeasureCoordinates();
    };
    ThreeMeasureTool.prototype.endMeasuring = function () {
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
    };
    ThreeMeasureTool.prototype.clearMeasuring = function () {
        this.isMeasuring = false;
        this.currentMeasure = undefined;
        this.displayCurrentMeasureCoordinates();
    };
    ThreeMeasureTool.prototype.clearMeasures = function () {
        for (var _i = 0, _a = this.measures; _i < _a.length; _i++) {
            var measure = _a[_i];
            if (measure.display) {
                for (var _b = 0, _c = measure.display.points; _b < _c.length; _b++) {
                    var object = _c[_b];
                    this.three.getScene('overlay').remove(object);
                }
                for (var _d = 0, _e = measure.display.lines; _d < _e.length; _d++) {
                    var object = _e[_d];
                    this.three.getScene('overlay').remove(object);
                }
                for (var _f = 0, _g = measure.display.labels; _f < _g.length; _f++) {
                    var object = _g[_f];
                    this.three.getScene('overlay').remove(object);
                }
            }
        }
        this.measures = [];
    };
    ThreeMeasureTool.prototype.removeMeasure = function (measure) {
        var index = this.measures.indexOf(measure);
        if (index !== -1) {
            this.measures.splice(index, 1);
        }
    };
    ThreeMeasureTool.prototype.displayMeasureOverlayTool = function () {
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
    };
    ThreeMeasureTool.prototype.hideMeasureOverlayTool = function () {
        if (!this.overlayTool || !this.overlayTool.userData.displayed)
            return;
        this.three.getScene('tools').remove(this.overlayTool);
        this.overlayTool.userData.displayed = false;
    };
    ThreeMeasureTool.prototype.createOverlayTool = function () {
        var group = new THREE.Group();
        group.name = '__measure-tools__';
        var groupContainer = new THREE.Group;
        groupContainer.name = '__measure-tools-container__';
        groupContainer.add(group);
        groupContainer.traverse(function (obj) {
            obj.renderOrder = 10;
            if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line) && (obj.material instanceof THREE.MeshBasicMaterial || obj.material instanceof THREE.LineBasicMaterial)) {
                obj.material.depthTest = false;
            }
        });
        this.overlayTool = groupContainer;
        this.adjustOverlayToolZoom();
    };
    ThreeMeasureTool.prototype.adjustOverlayToolPosition = function () {
        if (!this.overlayTool)
            return;
    };
    ThreeMeasureTool.prototype.adjustOverlayToolZoom = function () {
        var camera = this.three.getCamera();
        if (camera instanceof THREE.OrthographicCamera) {
            var cameraZoom = camera.zoom;
            this.computedSnappingThreshold = this.snappingThreshold * 50 / cameraZoom;
            if (this.currentPoint) {
                this.currentPoint.scale.setScalar(50 / cameraZoom);
            }
            for (var _i = 0, _a = this.currentMeasureCoordinates; _i < _a.length; _i++) {
                var mesh = _a[_i];
                if (mesh.geometry instanceof THREE.ShapeGeometry || mesh.geometry instanceof THREE.ExtrudeGeometry) {
                    continue;
                }
                mesh.scale.setScalar(50 / cameraZoom);
            }
            for (var _b = 0, _c = this.measures; _b < _c.length; _b++) {
                var measure = _c[_b];
                if (measure.display) {
                    for (var _d = 0, _e = measure.display.points; _d < _e.length; _d++) {
                        var obj = _e[_d];
                        if (obj.geometry instanceof THREE.ShapeGeometry || obj.geometry instanceof THREE.ExtrudeGeometry) {
                            continue;
                        }
                        obj.scale.setScalar(50 / cameraZoom);
                    }
                    for (var _f = 0, _g = measure.display.labels; _f < _g.length; _f++) {
                        var obj = _g[_f];
                        obj.scale.setScalar(0.8 / cameraZoom);
                    }
                }
            }
        }
    };
    ThreeMeasureTool.prototype.adjustActiveTool = function () {
        if (!this.overlayTool)
            return;
        var tool = this.overlayTool.getObjectByName('__measure-tools__');
    };
    ThreeMeasureTool.prototype.generateEdges = function () {
        var _this = this;
        this.three.getScene().traverse(function (obj) {
            if (obj instanceof THREE.Mesh) {
                var edges = new THREE.EdgesGeometry(obj.geometry);
                var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#ccc' }));
                line.name = '__measure-tools-edges__';
                line.userData.originalObject = obj;
                line.renderOrder = 9;
                _this.three.getScene('overlay').add(line);
            }
        });
    };
    ThreeMeasureTool.prototype.removeEdges = function () {
        var objToRemove = [];
        this.three.getScene('overlay').traverse(function (obj) {
            if (obj.name === '__measure-tools-edges__') {
                objToRemove.push(obj);
            }
        });
        for (var _i = 0, objToRemove_1 = objToRemove; _i < objToRemove_1.length; _i++) {
            var obj = objToRemove_1[_i];
            this.three.getScene('overlay').remove(obj);
        }
    };
    return ThreeMeasureTool;
}(three_tool_1.ThreeTool));
exports.ThreeMeasureTool = ThreeMeasureTool;

//# sourceMappingURL=three-measure-tool.js.map
