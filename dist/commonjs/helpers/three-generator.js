"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeGenerator = void 0;
const THREE = require("three");
class ThreeGenerator {
    constructor() {
        this.materials = {};
    }
    shapeFromGeoJSON(feature, scale = 1) {
        if (feature.geometry.type === 'Polygon') {
            if (!feature.geometry) {
                console.error('Missing geometry');
                return null;
            }
            if (!Array.isArray(feature.geometry.coordinates)) {
                console.error('Missing coordinates');
                return null;
            }
            if (!Array.isArray(feature.geometry.coordinates[0])) {
                console.error('Invalid coordinates');
                console.log('Invalid geometry:', feature.geometry);
                return null;
            }
            return new THREE.Shape(feature.geometry.coordinates[0].map(position => new THREE.Vector2(position[0] * scale, position[1] * scale)));
        }
        return null;
    }
    extrudeFromGeoJSON(feature, material, options) {
        if (feature.geometry.type === 'Polygon') {
            const scale = options.scale || 1;
            const shape = this.shapeFromGeoJSON(feature, scale);
            if (shape === null) {
                return null;
            }
            const extrude = new THREE.ExtrudeBufferGeometry(shape, options);
            const mesh = new THREE.Mesh(extrude, material);
            return mesh;
        }
        return null;
    }
    space2mesh(space, material, defaultHeight = 0.01, options) {
        if (space.boundary) {
            const alwaysUseDefaultHeight = (options === null || options === void 0 ? void 0 : options.alwaysUseDefaultHeight) === true;
            const height = space.boundary.properties.height && !alwaysUseDefaultHeight
                ? parseFloat(space.boundary.properties.height)
                : defaultHeight;
            const mesh = this.extrudeFromGeoJSON(space.boundary, material, { depth: height, bevelEnabled: false, scale: 1 });
            if (mesh === null) {
                return null;
            }
            mesh.userData = space.userData;
            if (!mesh.userData)
                mesh.userData = {};
            mesh.userData.id = space.id;
            mesh.userData.siteId = space.siteId;
            mesh.userData.importId = space.importId;
            mesh.userData.buildingId = space.buildingId;
            mesh.userData.storeys = space.storeyIds;
            mesh.userData.spaceId = space.id;
            mesh.userData.type = 'IfcSpace';
            for (const key in space.userData) {
                mesh.userData[key] = space.userData[key];
            }
            if (space.boundary.properties && space.boundary.properties.elevation) {
                const elevation = parseFloat(space.boundary.properties.elevation);
                mesh.translateY(elevation);
            }
            mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -2);
            return mesh;
        }
        return null;
    }
    getMaterial(color, opacity = 1, type = 'Basic') {
        let matName = `color-${color}-${opacity}-${type}`;
        if (!this.materials[matName]) {
            let material;
            if (type === 'Basic') {
                let transparent = opacity < 1;
                material = new THREE.MeshBasicMaterial({ color: color, opacity: opacity, transparent: transparent, side: THREE.DoubleSide });
            }
            else {
                let transparent = opacity < 1;
                material = new THREE.MeshPhongMaterial({ color: color, opacity: opacity, transparent: transparent, side: THREE.DoubleSide });
            }
            this.materials[matName] = material;
        }
        return this.materials[matName];
    }
    centeredCube(length = 10, material = new THREE.MeshBasicMaterial({ color: '#000', wireframe: true })) {
        let cubeGeometry = new THREE.BoxGeometry(length, length, length);
        let cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(0, 0, 0);
        return cube;
    }
    groundAnd3Cubes() {
        let ground = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), this.getMaterial('green', 1, 'Phong'));
        let cube1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), this.getMaterial('red', 1, 'Phong'));
        let cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.getMaterial('blue', 1, 'Phong'));
        let cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), this.getMaterial('yellow', 1, 'Phong'));
        ground.position.set(5, 5, 1);
        cube1.position.set(0, 0, 0);
        cube2.position.set(5, 1, 5);
        cube3.position.set(0, 5, 0);
        ground.add(cube1).add(cube2).add(cube3);
        return ground;
    }
    testAllGeometries() {
        let ground = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 30), this.getMaterial('green', 1, 'Phong'));
        let cube1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 4), this.getMaterial('red', 1, 'Phong'));
        cube1.translateY(1).translateZ(2);
        let cube2 = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 1, 4), this.getMaterial('yellow', 1, 'Phong'));
        cube2.translateY(1).translateZ(2).translateX(4);
        let cone1 = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 20), this.getMaterial('red', 1, 'Phong'));
        cone1.translateY(3).translateZ(10);
        let cone2 = new THREE.Mesh(new THREE.ConeBufferGeometry(2, 5, 20), this.getMaterial('yellow', 1, 'Phong'));
        cone2.translateY(3).translateX(4).translateZ(10);
        let circle1 = new THREE.Mesh(new THREE.CircleGeometry(5, 20), this.getMaterial('red', 1, 'Phong'));
        circle1.translateY(3).translateZ(-20).translateX(0);
        let circle2 = new THREE.Mesh(new THREE.CircleBufferGeometry(5, 20), this.getMaterial('yellow', 1, 'Phong'));
        circle2.translateY(3).translateX(0).translateZ(-24);
        let cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 5, 32), this.getMaterial('red', 1, 'Phong'));
        cylinder1.translateY(3).translateX(-6).translateZ(-10);
        let cylinder2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 5, 5, 32), this.getMaterial('yellow', 1, 'Phong'));
        cylinder2.translateY(3).translateX(6).translateZ(-10);
        let plane1 = new THREE.Mesh(new THREE.PlaneGeometry(5, 10, 20), this.getMaterial('red', 1, 'Phong'));
        plane1.rotateX(-90 / 180 * Math.PI);
        plane1.translateZ(-3);
        let plane2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 10, 20), this.getMaterial('yellow', 1, 'Phong'));
        plane2.rotateX(-90 / 180 * Math.PI);
        plane2.translateZ(-6);
        let response = [];
        response.push(ground);
        response.push(new THREE.Group().add(cube1).add(cube2));
        response.push(new THREE.Group().add(cone1).add(cone2));
        response.push(new THREE.Group().add(circle1).add(circle2));
        response.push(new THREE.Group().add(cylinder1).add(cylinder2));
        response.push(new THREE.Group().add(plane1).add(plane2));
        ground.translateY(-0.5);
        return response;
    }
}
exports.ThreeGenerator = ThreeGenerator;

//# sourceMappingURL=three-generator.js.map
