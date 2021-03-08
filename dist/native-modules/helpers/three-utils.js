import * as THREE from 'three';
import geojsonArea from '@mapbox/geojson-area';
var FRONT = 'front';
var BACK = 'back';
var STRADDLE = 'straddle';
var ON = 'on';
var ThreeUtils = (function () {
    function ThreeUtils() {
    }
    ThreeUtils.bboxFromObject = function (object) {
        var bbox = new THREE.BoxHelper(object);
        bbox.geometry.computeBoundingBox();
        return bbox.geometry.boundingBox;
    };
    ThreeUtils.bboxFromObjects = function (objects) {
        if (!objects || !objects.length)
            return null;
        var bbox;
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var obj = objects_1[_i];
            if (!bbox) {
                bbox = new THREE.Box3();
                bbox.setFromObject(obj);
            }
            else {
                bbox.expandByObject(obj);
            }
        }
        return bbox;
    };
    ThreeUtils.isBbox000 = function (bbox) {
        return bbox.min.x === 0 && bbox.min.y === 0 && bbox.min.z === 0 && bbox.max.x === 0 && bbox.max.y === 0 && bbox.max.z === 0;
    };
    ThreeUtils.centroidFromBbox = function (bbox) {
        var centroid = new THREE.Vector3(0.5 * (bbox.max.x + bbox.min.x), 0.5 * (bbox.max.y + bbox.min.y), 0.5 * (bbox.max.z + bbox.min.z));
        return centroid;
    };
    ThreeUtils.centroidFromObject = function (object) {
        var bbox = ThreeUtils.bboxFromObject(object);
        return ThreeUtils.centroidFromBbox(bbox);
    };
    ThreeUtils.centroidFromObjects = function (objects) {
        if (objects.length === 0)
            return null;
        var bbox = ThreeUtils.bboxFromObjects(objects);
        return ThreeUtils.centroidFromBbox(bbox);
    };
    ThreeUtils.edgesFromObject = function (object) {
        var edges = [];
        var edgesGeom = new THREE.EdgesGeometry(object.geometry);
        var vertices = [];
        var arr = edgesGeom.attributes.position.array;
        for (var k = 0; k < arr.length; k += 3) {
            vertices.push(new THREE.Vector3(arr[k], arr[k + 1], arr[k + 2]));
        }
        ;
        for (var k = 0; k < vertices.length; k += 2) {
            var start = vertices[k];
            var end = vertices[k + 1];
            edges.push(new THREE.Line3(start, end));
        }
        return edges;
    };
    ThreeUtils.polylabel = function (object, y) {
        var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), y * -1);
        var polygons = ThreeUtils.objectToPolygon(object, plane);
        for (var key in polygons) {
            polygons[key] = polygons[key].map(function (c) {
                return [c[0], c[2]];
            });
        }
        polygons = ThreeUtils.combineHoles(polygons);
        var polygon = null;
        if (polygons.length) {
            polygon = polygons[0];
        }
        else {
            return ThreeUtils.centroidFromBbox(ThreeUtils.bboxFromObject(object));
        }
        var centroid = this.polylabel(polygon, 1.0);
        return new THREE.Vector3(centroid[0], y, centroid[1]);
    };
    ThreeUtils.textureText = function (text, font, paddingX, paddingY) {
        if (font === void 0) { font = '500px Arial'; }
        if (paddingX === void 0) { paddingX = 150; }
        if (paddingY === void 0) { paddingY = 80; }
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = font;
        var textSize = context.measureText(text);
        canvas.width = textSize.width + (paddingX * 2);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#000';
        context.lineWidth = 100;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = font;
        context.fillStyle = '#000';
        context.fillText(text, paddingX, canvas.height - (paddingY * 1.5), textSize.width);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height, 1);
        var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
        material.transparent = true;
        material.needsUpdate = true;
        var plane = new THREE.Mesh(geometry, material);
        plane.scale.set(10, 10, 10);
        return plane;
    };
    ThreeUtils.PlaneHelper = function (plane, size) {
        if (size === void 0) { size = 10000; }
        var geom = new THREE.PlaneGeometry(size, size, 10, 10);
        var material = new THREE.MeshBasicMaterial({
            color: '#BBBBBB',
            side: THREE.DoubleSide,
            wireframe: false,
            opacity: 0.5,
            transparent: true
        });
        var obj = new THREE.Mesh(geom, material);
        obj.lookAt(plane.normal);
        var axis = new THREE.Vector3(0, 0, 1);
        obj.translateOnAxis(axis, plane.constant * -1);
        return obj;
    };
    ;
    ThreeUtils.geometryFromBuffer = function (bufferGeometry) {
        return new THREE.Geometry().fromBufferGeometry(bufferGeometry);
    };
    ThreeUtils.sliceGeometry = function (geometry, plane, DIRECTION) {
        if (DIRECTION === void 0) { DIRECTION = 'front'; }
        var sliced = new THREE.Geometry();
        var points;
        var position;
        geometry.faces.forEach(function (face, faceIndex) {
            points = ThreeUtils.facePoints(geometry, face, faceIndex);
            position = ThreeUtils.facePosition(plane, points);
            if (position == DIRECTION || position == ON) {
                ThreeUtils.addFace(sliced, points);
            }
            else if (position == STRADDLE) {
                ThreeUtils.sliceFace(plane, sliced, points, DIRECTION);
            }
        });
        return sliced;
    };
    ThreeUtils.sliceFace = function (plane, geom, points, DIRECTION) {
        var i;
        var len = points.length;
        var p1;
        var p2;
        var intersection;
        var position1;
        var position2;
        var slicePoints = [];
        for (i = 0; i < len; i++) {
            p1 = points[i];
            p2 = i + 1 < len ? points[i + 1] : points[0];
            intersection = ThreeUtils.intersectPlane(p1, p2, plane);
            position1 = ThreeUtils.vertexPosition(plane, p1.vertex);
            position2 = ThreeUtils.vertexPosition(plane, p2.vertex);
            if (position1 == DIRECTION && slicePoints.indexOf(p1) === -1) {
                slicePoints.push(p1);
            }
            if (intersection) {
                slicePoints.push(intersection);
            }
            if (position2 == DIRECTION && slicePoints.indexOf(p2) === -1) {
                slicePoints.push(p2);
            }
        }
        if (slicePoints.length > 3) {
            ThreeUtils.addFace(geom, [
                slicePoints[0],
                slicePoints[1],
                slicePoints[2]
            ]);
            ThreeUtils.addFace(geom, [
                slicePoints[2],
                slicePoints[3],
                slicePoints[0]
            ]);
        }
        else {
            ThreeUtils.addFace(geom, slicePoints);
        }
    };
    ThreeUtils.addFace = function (geom, points) {
        var existingIndex;
        var vertexIndices = [];
        var indexOffset = geom.vertices.length;
        var exists;
        var normals = [];
        var uvs = [];
        points.forEach(function (point) {
            existingIndex = geom.vertices.indexOf(point.vertex);
            if (existingIndex !== -1) {
                vertexIndices.push(existingIndex);
            }
            else {
                geom.vertices.push(point.vertex);
                vertexIndices.push(indexOffset);
                indexOffset += 1;
            }
            if (point.normal) {
                normals.push(point.normal);
            }
            if (point.uv) {
                uvs.push(point.uv);
            }
            return !exists;
        });
        var face = new THREE.Face3(vertexIndices[0], vertexIndices[1], vertexIndices[2], normals);
        geom.faces.push(face);
        if (uvs.length) {
            geom.faceVertexUvs[0].push(uvs);
        }
    };
    ThreeUtils.facePoints = function (geom, face, faceIndex) {
        var uvs = geom.faceVertexUvs[0];
        return ['a', 'b', 'c'].map(function (key, i) {
            return {
                vertex: geom.vertices[face[key]],
                normal: face.vertexNormals[i],
                uv: uvs[faceIndex] ? uvs[faceIndex][i] : undefined
            };
        });
    };
    ThreeUtils.intersectPlane = function (p1, p2, plane) {
        var line = new THREE.Line3(p1.vertex, p2.vertex);
        var intersection = plane.intersectLine(line);
        if (intersection) {
            var distance = p1.vertex.distanceTo(intersection);
            var alpha = distance / line.distance();
            return {
                vertex: intersection,
                normal: p1.normal.clone().lerp(p2.normal, alpha).normalize(),
                uv: p1.uv && p2.uv ? p1.uv.clone().lerp(p2.uv, alpha) : null
            };
        }
        return null;
    };
    ThreeUtils.facePosition = function (plane, points) {
        var a = ThreeUtils.vertexPosition(plane, points[0].vertex);
        var b = ThreeUtils.vertexPosition(plane, points[1].vertex);
        var c = ThreeUtils.vertexPosition(plane, points[2].vertex);
        if (a == BACK || b == BACK || c == BACK) {
            if (a == FRONT || b == FRONT || c == FRONT) {
                return STRADDLE;
            }
            return BACK;
        }
        if (a == FRONT || b == FRONT || c == FRONT) {
            if (a == BACK || b == BACK || c == BACK) {
                return STRADDLE;
            }
            return FRONT;
        }
        return ON;
    };
    ThreeUtils.vertexPosition = function (plane, vertex) {
        var distance = plane.distanceToPoint(vertex);
        if (distance < 0) {
            return BACK;
        }
        if (distance > 0) {
            return FRONT;
        }
        return ON;
    };
    ThreeUtils.objectToAxisPolygon = function (object, positionOnAxis, planeNormalAxis) {
        if (planeNormalAxis === void 0) { planeNormalAxis = 'y'; }
        var normal;
        if (planeNormalAxis === 'x')
            normal = new THREE.Vector3(1, 0, 0);
        if (planeNormalAxis === 'y')
            normal = new THREE.Vector3(0, 1, 0);
        if (planeNormalAxis === 'z')
            normal = new THREE.Vector3(0, 0, 1);
        var plane = new THREE.Plane(normal, positionOnAxis * -1);
        return ThreeUtils.objectToPolygon(object, plane);
    };
    ThreeUtils.objectToPolygon = function (object, plane, scene) {
        if (scene === void 0) { scene = null; }
        var intersectingLines = ThreeUtils.intersectingLines(object, plane);
        if (scene)
            ThreeUtils.intersectingGeometry(object, plane, scene);
        var linesByKey = {};
        for (var _i = 0, intersectingLines_1 = intersectingLines; _i < intersectingLines_1.length; _i++) {
            var line = intersectingLines_1[_i];
            line.start.x = Math.round(line.start.x * 10000) / 10000;
            line.start.y = Math.round(line.start.y * 10000) / 10000;
            line.start.z = Math.round(line.start.z * 10000) / 10000;
            line.end.x = Math.round(line.end.x * 10000) / 10000;
            line.end.y = Math.round(line.end.y * 10000) / 10000;
            line.end.z = Math.round(line.end.z * 10000) / 10000;
            if (line.start.x + "," + line.start.y + "," + line.start.z === line.end.x + "," + line.end.y + "," + line.end.z) {
                continue;
            }
            var key = line.start.x + "," + line.start.y + "," + line.start.z + "-" + line.end.x + "," + line.end.y + "," + line.end.z;
            var invertKey = line.end.x + "," + line.end.y + "," + line.end.z + "-" + line.start.x + "," + line.start.y + "," + line.start.z;
            if (linesByKey[key]) {
                delete linesByKey[key];
            }
            else if (linesByKey[invertKey]) {
                delete linesByKey[invertKey];
            }
            else {
                linesByKey[key] = line;
            }
        }
        var k = 0;
        var polygons = [];
        var currentPolygon = null;
        var currentKey = null;
        var nbLines = Object.keys(linesByKey).length;
        while (Object.keys(linesByKey).length || k > nbLines + 20) {
            k++;
            if (!currentKey) {
                currentKey = Object.keys(linesByKey)[0];
                currentPolygon = [];
            }
            var line = linesByKey[currentKey];
            delete linesByKey[currentKey];
            var point = [line.start.x, line.start.y, line.start.z];
            currentPolygon.push(point);
            if (currentPolygon && currentPolygon[0][0] === line.end.x && currentPolygon[0][1] === line.end.y && currentPolygon[0][2] === line.end.z) {
                currentPolygon.push(currentPolygon[0]);
                polygons.push(currentPolygon);
                currentPolygon = null;
                currentKey = null;
            }
            else {
                var found = false;
                for (var searchKey in linesByKey) {
                    var searchLine = linesByKey[searchKey];
                    if (line.end.x === searchLine.start.x && line.end.y === searchLine.start.y && line.end.z === searchLine.start.z) {
                        currentKey = searchKey;
                        found = true;
                        break;
                    }
                    if (line.end.x === searchLine.end.x && line.end.y === searchLine.end.y && line.end.z === searchLine.end.z) {
                        searchLine.set(searchLine.end.clone(), searchLine.start.clone());
                        currentKey = searchKey;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error('Cannot compute the polygon, could not find the next line after');
                }
            }
        }
        return polygons;
    };
    ThreeUtils.combineHoles = function (polygons) {
        var polygonsByArea = {};
        var areas = [];
        var multiPolygons = [];
        for (var _i = 0, polygons_1 = polygons; _i < polygons_1.length; _i++) {
            var polygon = polygons_1[_i];
            var geojson = {
                type: 'Polygon',
                coordinates: [polygon]
            };
            var area = geojsonArea.geometry(geojson);
            if (areas.indexOf(area) !== -1) {
                area += Math.random();
            }
            areas.push(area);
            polygonsByArea[area] = polygon;
        }
        areas.sort(function (a, b) { return b - a; });
        for (var _a = 0, areas_1 = areas; _a < areas_1.length; _a++) {
            var area = areas_1[_a];
            var polygon = [];
            var p = polygonsByArea[area];
            if (!p)
                continue;
            delete polygonsByArea[area];
            polygon.push(p);
            for (var key in polygonsByArea) {
                var p2 = polygonsByArea[key];
                var inside = ThreeUtils.isPointInsidePolygon(p2[0], p);
                if (inside) {
                    delete polygonsByArea[key];
                    polygon.push(p2);
                }
            }
            multiPolygons.push(polygon);
        }
        return multiPolygons;
    };
    ThreeUtils.intersectingLines = function (object, plane) {
        if (!object.geometry) {
            if (object.children && object.children.length) {
                var objectsWithGeometry = [];
                for (var _i = 0, _a = object.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child instanceof THREE.Mesh && child.geometry)
                        objectsWithGeometry.push(child);
                }
                if (objectsWithGeometry.length === 1) {
                    object = objectsWithGeometry[0];
                }
                else if (objectsWithGeometry.length === 0) {
                    throw new Error('No geometry found in the object or its children');
                }
                else {
                    throw new Error('The object has several geometries, this use case is not allowed');
                }
            }
            else {
                throw new Error('Object must have a geometry');
            }
        }
        if (object.geometry instanceof THREE.BufferGeometry) {
            throw new Error('Cannot use intersectingLines with an object containing a BufferGeometry');
        }
        var a = new THREE.Vector3;
        var b = new THREE.Vector3;
        var c = new THREE.Vector3;
        var planePointA = new THREE.Vector3;
        var planePointB = new THREE.Vector3;
        var planePointC = new THREE.Vector3;
        var lineAB = new THREE.Line3();
        var lineBC = new THREE.Line3();
        var lineCA = new THREE.Line3();
        var intersectingLines = [];
        var planeObject = ThreeUtils.PlaneHelper(plane, 100);
        var mathPlane = new THREE.Plane();
        var planeGeometry = planeObject.geometry;
        planeObject.localToWorld(planePointA.copy(planeGeometry.vertices[planeGeometry.faces[0].a]));
        planeObject.localToWorld(planePointB.copy(planeGeometry.vertices[planeGeometry.faces[0].b]));
        planeObject.localToWorld(planePointC.copy(planeGeometry.vertices[planeGeometry.faces[0].c]));
        mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);
        var objectGeometry = object.geometry;
        objectGeometry.faces.forEach(function (face, faceIndex) {
            object.localToWorld(a.copy(objectGeometry.vertices[face.a]));
            object.localToWorld(b.copy(objectGeometry.vertices[face.b]));
            object.localToWorld(c.copy(objectGeometry.vertices[face.c]));
            lineAB = new THREE.Line3(a, b);
            lineBC = new THREE.Line3(b, c);
            lineCA = new THREE.Line3(c, a);
            var distanceA = plane.distanceToPoint(a);
            var distanceB = plane.distanceToPoint(b);
            var distanceC = plane.distanceToPoint(c);
            if (distanceA === 0 && distanceB === 0 && distanceC === 0) {
                intersectingLines.push(lineAB.clone());
                intersectingLines.push(lineBC.clone());
                intersectingLines.push(lineCA.clone());
                return;
            }
            else if (distanceA === 0 && distanceB === 0 || distanceA === 0 && distanceC === 0 || distanceB === 0 && distanceC === 0) {
                return;
            }
            var intersectAB;
            intersectAB = plane.intersectLine(lineAB, intersectAB);
            var intersectBC;
            intersectBC = plane.intersectLine(lineBC, intersectBC);
            var intersectCA;
            intersectCA = plane.intersectLine(lineCA, intersectCA);
            var intersectingLine;
            if (intersectAB && intersectBC)
                intersectingLine = new THREE.Line3(intersectAB, intersectBC);
            if (intersectAB && intersectCA)
                intersectingLine = new THREE.Line3(intersectAB, intersectCA);
            if (intersectBC && intersectCA)
                intersectingLine = new THREE.Line3(intersectBC, intersectCA);
            if (intersectingLine)
                intersectingLines.push(intersectingLine);
        });
        return intersectingLines;
    };
    ThreeUtils.intersectingGeometry = function (object, plane, scene) {
        if (!object.geometry) {
            if (object.children && object.children.length) {
                var objectsWithGeometry = [];
                for (var _i = 0, _a = object.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child instanceof THREE.Mesh && child.geometry)
                        objectsWithGeometry.push(child);
                }
                if (objectsWithGeometry.length === 1) {
                    object = objectsWithGeometry[0];
                }
                else if (objectsWithGeometry.length === 0) {
                    throw new Error('No geometry found in the object or its children');
                }
                else {
                    throw new Error('The object has several geometries, this use case is not allowed');
                }
            }
            else {
                throw new Error('Object must have a geometry');
            }
        }
        var pointsOfIntersection = new THREE.Geometry();
        var intersectingLines = ThreeUtils.intersectingLines(object, plane);
        for (var _b = 0, intersectingLines_2 = intersectingLines; _b < intersectingLines_2.length; _b++) {
            var intersectingLine = intersectingLines_2[_b];
            pointsOfIntersection.vertices.push(intersectingLine.start.clone());
            pointsOfIntersection.vertices.push(intersectingLine.end.clone());
        }
        if (scene) {
            var pointsMaterial = new THREE.PointsMaterial({
                size: 5,
                color: "blue",
                sizeAttenuation: false
            });
            var pointsObject = new THREE.Points(pointsOfIntersection, pointsMaterial);
            scene.add(pointsObject);
            var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var lineObject = new THREE.LineSegments(pointsOfIntersection, lineMaterial);
            scene.add(lineObject);
        }
        return pointsOfIntersection;
    };
    ThreeUtils.centroidOfPolygon = function (arr) {
        var twoTimesSignedArea = 0;
        var cxTimes6SignedArea = 0;
        var cyTimes6SignedArea = 0;
        var length = arr.length;
        var x = function (i) { return arr[i % length][0]; };
        var y = function (i) { return arr[i % length][1]; };
        for (var i = 0; i < arr.length; i++) {
            var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
            twoTimesSignedArea += twoSA;
            cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
            cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
        }
        var sixSignedArea = 3 * twoTimesSignedArea;
        return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
    };
    ThreeUtils.isPointInsidePolygon = function (point, polygon) {
        var x = point[0], y = point[1];
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i][0], yi = polygon[i][1];
            var xj = polygon[j][0], yj = polygon[j][1];
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    };
    ThreeUtils.planeConstantNormalToPositionDirection = function (constant, normal) {
        return {
            position: normal.clone().setLength(constant),
            direction: normal
        };
    };
    ThreeUtils.planePositionDirectionToConstantNormal = function (position, direction) {
        return {
            normal: new THREE.Vector3(direction.x, direction.y, direction.z).normalize(),
            constant: new THREE.Vector3(position.x, position.y, position.z).length()
        };
    };
    return ThreeUtils;
}());
export { ThreeUtils };

//# sourceMappingURL=three-utils.js.map
