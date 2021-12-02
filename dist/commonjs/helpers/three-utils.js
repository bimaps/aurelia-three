"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeUtils = void 0;
const three_1 = require("three");
const three_2 = require("three");
let FRONT = 'front';
let BACK = 'back';
let STRADDLE = 'straddle';
let ON = 'on';
class ThreeUtils {
    static bboxFromObject(object) {
        let bbox = new three_1.BoxHelper(object);
        bbox.geometry.computeBoundingBox();
        return bbox.geometry.boundingBox;
    }
    static bboxFromObjects(objects) {
        if (!objects || !objects.length)
            return null;
        let bbox;
        for (let obj of objects) {
            if (!bbox) {
                bbox = new three_1.Box3();
                bbox.setFromObject(obj);
            }
            else {
                bbox.expandByObject(obj);
            }
        }
        return bbox;
    }
    static isBbox000(bbox) {
        return bbox.min.x === 0 && bbox.min.y === 0 && bbox.min.z === 0 && bbox.max.x === 0 && bbox.max.y === 0 && bbox.max.z === 0;
    }
    static centroidFromBbox(bbox) {
        let centroid = new three_1.Vector3(0.5 * (bbox.max.x + bbox.min.x), 0.5 * (bbox.max.y + bbox.min.y), 0.5 * (bbox.max.z + bbox.min.z));
        return centroid;
    }
    static centroidFromObject(object) {
        let bbox = ThreeUtils.bboxFromObject(object);
        return ThreeUtils.centroidFromBbox(bbox);
    }
    static centroidFromObjects(objects) {
        if (objects.length === 0)
            return null;
        let bbox = ThreeUtils.bboxFromObjects(objects);
        return ThreeUtils.centroidFromBbox(bbox);
    }
    static edgesFromObject(object) {
        const edges = [];
        const edgesGeom = new three_2.EdgesGeometry(object.geometry);
        const vertices = [];
        const arr = edgesGeom.attributes.position.array;
        for (let k = 0; k < arr.length; k += 3) {
            vertices.push(new three_1.Vector3(arr[k], arr[k + 1], arr[k + 2]));
        }
        ;
        for (let k = 0; k < vertices.length; k += 2) {
            const start = vertices[k];
            const end = vertices[k + 1];
            edges.push(new three_2.Line3(start, end));
        }
        return edges;
    }
    static textureText(text, font = '500px Arial', paddingX = 150, paddingY = 80) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = font;
        let textSize = context.measureText(text);
        canvas.width = textSize.width + (paddingX * 2);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#000';
        context.lineWidth = 100;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = font;
        context.fillStyle = '#000';
        context.fillText(text, paddingX, canvas.height - (paddingY * 1.5), textSize.width);
        var texture = new three_2.Texture(canvas);
        texture.needsUpdate = true;
        let geometry = new three_1.PlaneGeometry(canvas.width, canvas.height, 1);
        let material = new three_2.MeshBasicMaterial({ map: texture, color: 0xffffff });
        material.transparent = true;
        material.needsUpdate = true;
        let plane = new three_1.Mesh(geometry, material);
        plane.scale.set(10, 10, 10);
        return plane;
    }
    static PlaneHelper(plane, size = 10000) {
        let geom = new three_1.PlaneGeometry(size, size, 10, 10);
        let material = new three_2.MeshBasicMaterial({
            color: '#BBBBBB',
            side: three_2.DoubleSide,
            wireframe: false,
            opacity: 0.5,
            transparent: true
        });
        let obj = new three_1.Mesh(geom, material);
        obj.lookAt(plane.normal);
        let axis = new three_1.Vector3(0, 0, 1);
        obj.translateOnAxis(axis, plane.constant * -1);
        return obj;
    }
    ;
    static intersectPlane(p1, p2, plane) {
        let line = new three_2.Line3(p1.vertex, p2.vertex);
        let intersection = plane.intersectLine(line);
        if (intersection) {
            let distance = p1.vertex.distanceTo(intersection);
            let alpha = distance / line.distance();
            return {
                vertex: intersection,
                normal: p1.normal.clone().lerp(p2.normal, alpha).normalize(),
                uv: p1.uv && p2.uv ? p1.uv.clone().lerp(p2.uv, alpha) : null
            };
        }
        return null;
    }
    static facePosition(plane, points) {
        let a = ThreeUtils.vertexPosition(plane, points[0].vertex);
        let b = ThreeUtils.vertexPosition(plane, points[1].vertex);
        let c = ThreeUtils.vertexPosition(plane, points[2].vertex);
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
    }
    static vertexPosition(plane, vertex) {
        let distance = plane.distanceToPoint(vertex);
        if (distance < 0) {
            return BACK;
        }
        if (distance > 0) {
            return FRONT;
        }
        return ON;
    }
    static centroidOfPolygon(arr) {
        let twoTimesSignedArea = 0;
        let cxTimes6SignedArea = 0;
        let cyTimes6SignedArea = 0;
        let length = arr.length;
        let x = function (i) { return arr[i % length][0]; };
        let y = function (i) { return arr[i % length][1]; };
        for (let i = 0; i < arr.length; i++) {
            let twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
            twoTimesSignedArea += twoSA;
            cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
            cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
        }
        let sixSignedArea = 3 * twoTimesSignedArea;
        return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
    }
    static isPointInsidePolygon(point, polygon) {
        let x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i][0], yi = polygon[i][1];
            let xj = polygon[j][0], yj = polygon[j][1];
            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
    static planeConstantNormalToPositionDirection(constant, normal) {
        return {
            position: normal.clone().setLength(constant),
            direction: normal
        };
    }
    static planePositionDirectionToConstantNormal(position, direction) {
        return {
            normal: new three_1.Vector3(direction.x, direction.y, direction.z).normalize(),
            constant: new three_1.Vector3(position.x, position.y, position.z).length()
        };
    }
}
exports.ThreeUtils = ThreeUtils;

//# sourceMappingURL=three-utils.js.map
