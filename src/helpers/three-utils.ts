import * as THREE from 'three';
import geojsonArea from '@mapbox/geojson-area';

let FRONT = 'front';
let BACK = 'back';
let STRADDLE = 'straddle';
let ON = 'on';

export class ThreeUtils {

  public static bboxFromObject(object: THREE.Object3D): THREE.Box3 {
    let bbox = new THREE.BoxHelper(object);
    bbox.geometry.computeBoundingBox();
    return bbox.geometry.boundingBox;
  }

  public static bboxFromObjects(objects: Array<THREE.Object3D>): THREE.Box3 | null {
    if (!objects || !objects.length) return null;
    let bbox: THREE.Box3;
    for (let obj of objects) {
      if (!bbox) {
        bbox = new THREE.Box3();
        bbox.setFromObject(obj);
      } else {
        bbox.expandByObject(obj);
      }
    }
    return bbox;
  }
  
  public static isBbox000(bbox: THREE.Box3): boolean {
    return bbox.min.x === 0 && bbox.min.y === 0 && bbox.min.z === 0 && bbox.max.x === 0 && bbox.max.y === 0 && bbox.max.z === 0;
  }

  public static centroidFromBbox(bbox: THREE.Box3): THREE.Vector3 {
    let centroid = new THREE.Vector3(0.5 * ( bbox.max.x + bbox.min.x ), 0.5 * ( bbox.max.y + bbox.min.y ), 0.5 * ( bbox.max.z + bbox.min.z ));
    return centroid;
  }

  public static centroidFromObject(object: THREE.Object3D): THREE.Vector3 {
    let bbox = ThreeUtils.bboxFromObject(object);
    return ThreeUtils.centroidFromBbox(bbox);
  }

  public static centroidFromObjects(objects: Array<THREE.Object3D>): THREE.Vector3 | null {
    if (objects.length === 0) return null;
    let bbox = ThreeUtils.bboxFromObjects(objects);
    return ThreeUtils.centroidFromBbox(bbox);
  }

  public static edgesFromObject(object: THREE.Mesh): THREE.Line3[] {
    const edges: THREE.Line3[] = [];
    const edgesGeom = new THREE.EdgesGeometry(object.geometry);
    const vertices: THREE.Vector3[] = []
    const arr = edgesGeom.attributes.position.array;
    for (let k = 0; k < arr.length; k += 3) {
      vertices.push(new THREE.Vector3(arr[k], arr[k+1], arr[k+2]));
    };
    for (let k = 0; k < vertices.length; k += 2) {
      const start = vertices[k];
      const end = vertices[k+1];
      edges.push(new THREE.Line3(start, end));
    }
    return edges;
  }

  public static polylabel(object: THREE.Mesh, y: number): THREE.Vector3 {
    // get an array of polygons intersecting the plane on y axis
    let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), y * -1);
    let polygons = ThreeUtils.objectToPolygon(object, plane/*, this.globalScene*/);
    // transform the 3d polygons in 2d polygons (removing the y altitude axis)
    for (let key in polygons) {
      polygons[key] = polygons[key].map((c) => {
        return [c[0], c[2]];
      });
    }
    // combines the polygons if necessary
    polygons = ThreeUtils.combineHoles(polygons);
    // use the first polygon if exists
    let polygon = null;
    if (polygons.length) {
      polygon = polygons[0];
    } else {
      // otherwise return the centroid of the object
      return ThreeUtils.centroidFromBbox(ThreeUtils.bboxFromObject(object));
    }
    let centroid = this.polylabel(polygon, 1.0);
    return new THREE.Vector3(
      centroid[0],
      y,
      centroid[1]
    );
  }

  static textureText(text: string, font = '500px Arial', paddingX = 150, paddingY = 80) {
    let canvas = document.createElement('canvas');
    // canvas.css
    let context = canvas.getContext('2d');

    context.font = font;

    let textSize = context.measureText(text);
    //textSize.height = 500;

    canvas.width = textSize.width + (paddingX * 2);
    //canvas.height = textSize.height + (paddingY * 2);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#000';
    context.lineWidth = 100;
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = font;

    context.fillStyle = '#000';
    context.fillText(text, paddingX, canvas.height - (paddingY *1.5), textSize.width);

    //context.strokeStyle = 'black';
    //context.strokeText(text, 0, 20);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    let geometry = new THREE.PlaneGeometry( canvas.width, canvas.height, 1 );
    let material = new THREE.MeshBasicMaterial({map: texture, color: 0xffffff});
    //material.combine = THREE.MixOperation;
    material.transparent = true;
    material.needsUpdate = true;
    let plane = new THREE.Mesh( geometry, material );

    plane.scale.set(10,10,10);

    return plane;
  }

  static PlaneHelper(plane: THREE.Plane, size = 10000) {
    let geom = new THREE.PlaneGeometry( size, size, 10, 10 );
    let material = new THREE.MeshBasicMaterial({
      color: '#BBBBBB',
      side: THREE.DoubleSide,
      wireframe: false,
      opacity: 0.5,
      transparent: true
    });
    let obj = new THREE.Mesh( geom, material );
    obj.lookAt(plane.normal);
    let axis = new THREE.Vector3(0, 0, 1);
    obj.translateOnAxis(axis, plane.constant * -1);

    return obj;
  };

  static geometryFromBuffer(bufferGeometry: THREE.BufferGeometry) {
    return new THREE.Geometry().fromBufferGeometry( bufferGeometry );
  }

  // based on https://github.com/tdhooper/threejs-slice-geometry
  // latest commit before integration here: https://github.com/tdhooper/threejs-slice-geometry/commit/8f8298d0a0e4d8257151144a704e69e336f5f852
  // added DIRECTION
  static sliceGeometry(geometry: THREE.Geometry, plane: THREE.Plane, DIRECTION = 'front') {
    let sliced = new THREE.Geometry();
    let points;
    let position;
    geometry.faces.forEach(function(face, faceIndex) {
      points = ThreeUtils.facePoints(geometry, face, faceIndex);
      position = ThreeUtils.facePosition(plane, points);
      if (position == DIRECTION || position == ON) {
        ThreeUtils.addFace(sliced, points);
      } else if (position == STRADDLE) {
        ThreeUtils.sliceFace(plane, sliced, points, DIRECTION);
      }
    });
    return sliced;
  }

  static sliceFace(plane: THREE.Plane, geom: THREE.Geometry, points, DIRECTION) {
    let i;
    let len = points.length;
    let p1;
    let p2;
    let intersection;
    let position1;
    let position2;
    let slicePoints = [];

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
    } else {
      ThreeUtils.addFace(geom, slicePoints);
    }
  }

  static addFace(geom: THREE.Geometry, points) {
    let existingIndex;
    let vertexIndices = [];
    let indexOffset = geom.vertices.length;
    let exists;
    let normals = [];
    let uvs = [];

    points.forEach((point) => {
      existingIndex = geom.vertices.indexOf(point.vertex);
      if (existingIndex !== -1) {
        vertexIndices.push(existingIndex);
      } else {
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
      return ! exists;
    });

    let face = new THREE.Face3(
      vertexIndices[0],
      vertexIndices[1],
      vertexIndices[2],
      normals
    );
    geom.faces.push(face);
    if (uvs.length) {
      geom.faceVertexUvs[0].push(uvs);
    }
  }

  static facePoints(geom: THREE.Geometry, face: THREE.Face3, faceIndex: number) {
    let uvs = geom.faceVertexUvs[0];
    return ['a', 'b', 'c'].map(function(key, i) {
      return {
        vertex: geom.vertices[face[key]],
        normal: face.vertexNormals[i],
        uv: uvs[faceIndex] ? uvs[faceIndex][i] : undefined
      };
    });
  }

  static intersectPlane(p1, p2, plane) {
    let line = new THREE.Line3(p1.vertex, p2.vertex);
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

  static vertexPosition(plane: THREE.Plane, vertex) {
    let distance = plane.distanceToPoint(vertex);
    if (distance < 0) {
      return BACK;
    }
    if (distance > 0) {
      return FRONT;
    }
    return ON;
  }

  static objectToAxisPolygon(object: THREE.Mesh, positionOnAxis, planeNormalAxis = 'y') {
    let normal;
    if (planeNormalAxis === 'x') normal = new THREE.Vector3(1, 0, 0);
    if (planeNormalAxis === 'y') normal = new THREE.Vector3(0, 1, 0);
    if (planeNormalAxis === 'z') normal = new THREE.Vector3(0, 0, 1);

    let plane = new THREE.Plane(normal, positionOnAxis * -1);
    return ThreeUtils.objectToPolygon(object, plane);
  }

  /*
  WARNING: This function is currently hard-coded to keep points in 2d, removing value of the y axis, assuming that we want to slice on the horizontal plane
  */
  static objectToPolygon(object: THREE.Mesh, plane: THREE.Plane, scene = null) {
    let intersectingLines = ThreeUtils.intersectingLines(object, plane);
    
    if (scene) ThreeUtils.intersectingGeometry(object, plane, scene);

    // remove all lines that are "duplicates"
    // and all lines where start and end are same
    let linesByKey = {};
    for (let line of intersectingLines) {
      line.start.x = Math.round(line.start.x * 10000) / 10000;
      line.start.y = Math.round(line.start.y * 10000) / 10000;
      line.start.z = Math.round(line.start.z * 10000) / 10000;
      line.end.x = Math.round(line.end.x * 10000) / 10000;
      line.end.y = Math.round(line.end.y * 10000) / 10000;
      line.end.z = Math.round(line.end.z * 10000) / 10000;
      if (`${line.start.x},${line.start.y},${line.start.z}` === `${line.end.x},${line.end.y},${line.end.z}`) {
        // start and end are same, continue without keeping the line
        continue;
      }
      let key = `${line.start.x},${line.start.y},${line.start.z}-${line.end.x},${line.end.y},${line.end.z}`;
      let invertKey = `${line.end.x},${line.end.y},${line.end.z}-${line.start.x},${line.start.y},${line.start.z}`;
      if (linesByKey[key]) {
        delete linesByKey[key];
      } else if (linesByKey[invertKey]) {
        delete linesByKey[invertKey];
      } else {
        linesByKey[key] = line;
      }
    }

    let k = 0;
    let polygons = [];
    let currentPolygon = null;
    let currentKey = null;
    let nbLines = Object.keys(linesByKey).length;
    while (Object.keys(linesByKey).length || k > nbLines + 20) {
      k++;
      if (!currentKey) {
        // take the first key
        currentKey = Object.keys(linesByKey)[0];
        currentPolygon = [];
      }

      // get the line with the currentKey and remove it from the "bank"
      let line = linesByKey[currentKey];
      delete linesByKey[currentKey];
      
      // get the start of line coordinate as polygon point
      let point = [line.start.x, line.start.y, line.start.z];
      currentPolygon.push(point);

      // check if the end point of the currentLine is the origin of polygon
      if (currentPolygon && currentPolygon[0][0] === line.end.x && currentPolygon[0][1] === line.end.y && currentPolygon[0][2] === line.end.z) {
        // close the polygon
        currentPolygon.push(currentPolygon[0]);
        // clear the current polygon in order to start a new one
        polygons.push(currentPolygon);
        currentPolygon = null;
        currentKey = null;
      } else {
        // find the next line
        let found = false;
        for (let searchKey in linesByKey) {
          let searchLine = linesByKey[searchKey];
          if (line.end.x === searchLine.start.x && line.end.y === searchLine.start.y && line.end.z === searchLine.start.z) {
            // found a line where the start equals the end of the current line
            currentKey = searchKey;
            found = true;
            break;
          }
          if (line.end.x === searchLine.end.x && line.end.y === searchLine.end.y && line.end.z === searchLine.end.z) {
            // found a line where the end equals the end of the current line
            // we should revert it before to use it as next line
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
  }

  /**
   * 
   * Input: an array of polygons where each element is a ring
   * Output: coordinates of MultiPolygon, compatible with GeoJSON
   */
  static combineHoles(polygons) {
    // order polygons by area
    let polygonsByArea = {};
    let areas = [];
    let multiPolygons = [];

    for (let polygon of polygons) {
      let geojson = {
        type: 'Polygon',
        coordinates: [polygon]
      };
      let area = geojsonArea.geometry(geojson);
      if (areas.indexOf(area) !== -1) {
        // add an arbitrary value to differentiate
        area += Math.random();
      }
      areas.push(area);
      polygonsByArea[area] = polygon;
    }

    areas.sort(function(a, b){return b - a});

    for (let area of areas) {
      let polygon = [];
      let p = polygonsByArea[area];
      if (!p) continue; // this polygon has been used as an internal ring
      delete polygonsByArea[area];
      polygon.push(p); // push the outer ring
      // check if another polygon is inside
      for (let key in polygonsByArea) {
        let p2 = polygonsByArea[key];
        // is the first point inside
        let inside = ThreeUtils.isPointInsidePolygon(p2[0], p);
        if (inside) {
          delete polygonsByArea[key];
          polygon.push(p2);
        }
      }
      multiPolygons.push(polygon);
    }

    return multiPolygons;
  }

  static intersectingLines(object: THREE.Mesh, plane: THREE.Plane) {
    if (!object.geometry) {
      if (object.children && object.children.length) {
        let objectsWithGeometry = [];
        for (let child of object.children) {
          if (child instanceof THREE.Mesh && child.geometry) objectsWithGeometry.push(child);
        }
        if (objectsWithGeometry.length === 1) {
          object = objectsWithGeometry[0];
        } else if (objectsWithGeometry.length === 0) {
          throw new Error('No geometry found in the object or its children');
        } else {
          throw new Error('The object has several geometries, this use case is not allowed');
        } 
      } else {
        throw new Error('Object must have a geometry');
      }
    }

    if (object.geometry instanceof THREE.BufferGeometry) {
      throw new Error('Cannot use intersectingLines with an object containing a BufferGeometry');
    }

    let a = new THREE.Vector3;
    let b = new THREE.Vector3;
    let c = new THREE.Vector3;

    let planePointA = new THREE.Vector3;
    let planePointB = new THREE.Vector3;
    let planePointC = new THREE.Vector3;

    let lineAB = new THREE.Line3();
    let lineBC = new THREE.Line3();
    let lineCA = new THREE.Line3();

    let intersectingLines = [];

    // make sure we have the plane in World Coordinates
    let planeObject = ThreeUtils.PlaneHelper(plane, 100);
    let mathPlane = new THREE.Plane();
    const planeGeometry: THREE.Geometry = planeObject.geometry as THREE.Geometry;
    planeObject.localToWorld(planePointA.copy(planeGeometry.vertices[planeGeometry.faces[0].a]));
    planeObject.localToWorld(planePointB.copy(planeGeometry.vertices[planeGeometry.faces[0].b]));
    planeObject.localToWorld(planePointC.copy(planeGeometry.vertices[planeGeometry.faces[0].c]));
    mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

    const objectGeometry: THREE.Geometry = object.geometry as THREE.Geometry;
    objectGeometry.faces.forEach((face, faceIndex) => {
      object.localToWorld(a.copy(objectGeometry.vertices[face.a]));
      object.localToWorld(b.copy(objectGeometry.vertices[face.b]));
      object.localToWorld(c.copy(objectGeometry.vertices[face.c]));
      lineAB = new THREE.Line3(a, b);
      lineBC = new THREE.Line3(b, c);
      lineCA = new THREE.Line3(c, a);

      let distanceA = plane.distanceToPoint(a);
      let distanceB = plane.distanceToPoint(b);
      let distanceC = plane.distanceToPoint(c);

      if (distanceA === 0 && distanceB === 0 && distanceC === 0) {
        // 100% coplanar
        intersectingLines.push(lineAB.clone());
        intersectingLines.push(lineBC.clone());
        intersectingLines.push(lineCA.clone());
        return;
      } else if (distanceA === 0 && distanceB === 0 || distanceA === 0 && distanceC === 0 || distanceB === 0 && distanceC === 0) {
        // partial coplanar
        return;
      }
      // not coplanar at all

      let intersectAB: THREE.Vector3;
      intersectAB = plane.intersectLine(lineAB, intersectAB);
      let intersectBC: THREE.Vector3;
      intersectBC = plane.intersectLine(lineBC, intersectBC);
      let intersectCA: THREE.Vector3;
      intersectCA = plane.intersectLine(lineCA, intersectCA);

      // TODO: FIX SCENERIO WHEN FACE IS COPLANAR WITH THE PLAN
      let intersectingLine;
      if (intersectAB && intersectBC) intersectingLine = new THREE.Line3(intersectAB, intersectBC);
      if (intersectAB && intersectCA) intersectingLine = new THREE.Line3(intersectAB, intersectCA);
      if (intersectBC && intersectCA) intersectingLine = new THREE.Line3(intersectBC, intersectCA);
      if (intersectingLine) intersectingLines.push(intersectingLine);
    });

    return intersectingLines;
  }

  static intersectingGeometry(object: THREE.Mesh, plane: THREE.Plane, scene) {    
    if (!object.geometry) {
      if (object.children && object.children.length) {
        let objectsWithGeometry = [];
        for (let child of object.children) {
          if (child instanceof THREE.Mesh && child.geometry) objectsWithGeometry.push(child);
        }
        if (objectsWithGeometry.length === 1) {
          object = objectsWithGeometry[0];
        } else if (objectsWithGeometry.length === 0) {
          throw new Error('No geometry found in the object or its children');
        } else {
          throw new Error('The object has several geometries, this use case is not allowed');
        } 
      } else {
        throw new Error('Object must have a geometry');
      }
    }

    let pointsOfIntersection = new THREE.Geometry();

    let intersectingLines = ThreeUtils.intersectingLines(object, plane);
    for (let intersectingLine of intersectingLines) {
      pointsOfIntersection.vertices.push(intersectingLine.start.clone());
      pointsOfIntersection.vertices.push(intersectingLine.end.clone());
    }

    if (scene) {
      let pointsMaterial = new THREE.PointsMaterial({
        size: 5,
        color: "blue",
        sizeAttenuation: false
      });
      let pointsObject = new THREE.Points(pointsOfIntersection, pointsMaterial);
      scene.add(pointsObject);
      
      let lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
      let lineObject = new THREE.LineSegments( pointsOfIntersection, lineMaterial );
      scene.add( lineObject );
      
    }

    return pointsOfIntersection;
  }

  static centroidOfPolygon(arr) {
    let twoTimesSignedArea = 0;
    let cxTimes6SignedArea = 0;
    let cyTimes6SignedArea = 0;

    let length = arr.length;

    let x = function(i) { return arr[i % length][0]; };
    let y = function(i) { return arr[i % length][1]; };

    for ( let i = 0; i < arr.length; i++) {
      let twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
      twoTimesSignedArea += twoSA;
      cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
      cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
    }
    let sixSignedArea = 3 * twoTimesSignedArea;
    return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
  }

  static isPointInsidePolygon(point, polygon) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    let x = point[0], y = point[1];
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];
        
        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
  }

  static planeConstantNormalToPositionDirection(constant: number, normal: THREE.Vector3): {position: THREE.Vector3, direction: THREE.Vector3} {
    return {
      position: normal.clone().setLength(constant),
      direction: normal
    };
  }

  static planePositionDirectionToConstantNormal(position: THREE.Vector3, direction: THREE.Vector3): {constant: number, normal: THREE.Vector3} {
    return {
      normal: new THREE.Vector3(direction.x, direction.y, direction.z).normalize(),
      constant: new THREE.Vector3(position.x, position.y, position.z).length()
    }
  }
}
