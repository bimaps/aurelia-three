import * as THREE from 'three';
var ThreeGenerator = (function () {
    function ThreeGenerator() {
        this.materials = {};
    }
    ThreeGenerator.prototype.shapeFromGeoJSON = function (feature, scale) {
        if (scale === void 0) { scale = 1; }
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
            return new THREE.Shape(feature.geometry.coordinates[0].map(function (position) { return new THREE.Vector2(position[0] * scale, position[1] * scale); }));
        }
        return null;
    };
    ThreeGenerator.prototype.extrudeFromGeoJSON = function (feature, material, options) {
        if (feature.geometry.type === 'Polygon') {
            var scale = options.scale || 1;
            var shape = this.shapeFromGeoJSON(feature, scale);
            if (shape === null) {
                return null;
            }
            var extrude = new THREE.ExtrudeBufferGeometry(shape, options);
            var mesh = new THREE.Mesh(extrude, material);
            return mesh;
        }
        return null;
    };
    ThreeGenerator.prototype.space2mesh = function (space, material, defaultHeight, options) {
        if (defaultHeight === void 0) { defaultHeight = 0.01; }
        if (space.boundary) {
            var alwaysUseDefaultHeight = (options === null || options === void 0 ? void 0 : options.alwaysUseDefaultHeight) === true;
            var height = space.boundary.properties.height && !alwaysUseDefaultHeight
                ? parseFloat(space.boundary.properties.height)
                : defaultHeight;
            var mesh = this.extrudeFromGeoJSON(space.boundary, material, { depth: height, bevelEnabled: false, scale: 1 });
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
            for (var key in space.userData) {
                mesh.userData[key] = space.userData[key];
            }
            if (space.boundary.properties && space.boundary.properties.elevation) {
                var elevation = parseFloat(space.boundary.properties.elevation);
                mesh.translateY(elevation);
            }
            mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -2);
            return mesh;
        }
        return null;
    };
    ThreeGenerator.prototype.getMaterial = function (color, opacity, type) {
        if (opacity === void 0) { opacity = 1; }
        if (type === void 0) { type = 'Basic'; }
        var matName = "color-" + color + "-" + opacity + "-" + type;
        if (!this.materials[matName]) {
            var material = void 0;
            if (type === 'Basic') {
                var transparent = opacity < 1;
                material = new THREE.MeshBasicMaterial({ color: color, opacity: opacity, transparent: transparent, side: THREE.DoubleSide });
            }
            else {
                var transparent = opacity < 1;
                material = new THREE.MeshPhongMaterial({ color: color, opacity: opacity, transparent: transparent, side: THREE.DoubleSide });
            }
            this.materials[matName] = material;
        }
        return this.materials[matName];
    };
    ThreeGenerator.prototype.centeredCube = function (length, material) {
        if (length === void 0) { length = 10; }
        if (material === void 0) { material = new THREE.MeshBasicMaterial({ color: '#000', wireframe: true }); }
        var cubeGeometry = new THREE.BoxGeometry(length, length, length);
        var cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(0, 0, 0);
        return cube;
    };
    ThreeGenerator.prototype.groundAnd3Cubes = function () {
        var ground = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), this.getMaterial('green', 1, 'Phong'));
        var cube1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), this.getMaterial('red', 1, 'Phong'));
        var cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.getMaterial('blue', 1, 'Phong'));
        var cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), this.getMaterial('yellow', 1, 'Phong'));
        ground.position.set(5, 5, 1);
        cube1.position.set(0, 0, 0);
        cube2.position.set(5, 1, 5);
        cube3.position.set(0, 5, 0);
        ground.add(cube1).add(cube2).add(cube3);
        return ground;
    };
    ThreeGenerator.prototype.testAllGeometries = function () {
        var ground = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 30), this.getMaterial('green', 1, 'Phong'));
        var cube1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 4), this.getMaterial('red', 1, 'Phong'));
        cube1.translateY(1).translateZ(2);
        var cube2 = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 1, 4), this.getMaterial('yellow', 1, 'Phong'));
        cube2.translateY(1).translateZ(2).translateX(4);
        var cone1 = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 20), this.getMaterial('red', 1, 'Phong'));
        cone1.translateY(3).translateZ(10);
        var cone2 = new THREE.Mesh(new THREE.ConeBufferGeometry(2, 5, 20), this.getMaterial('yellow', 1, 'Phong'));
        cone2.translateY(3).translateX(4).translateZ(10);
        var circle1 = new THREE.Mesh(new THREE.CircleGeometry(5, 20), this.getMaterial('red', 1, 'Phong'));
        circle1.translateY(3).translateZ(-20).translateX(0);
        var circle2 = new THREE.Mesh(new THREE.CircleBufferGeometry(5, 20), this.getMaterial('yellow', 1, 'Phong'));
        circle2.translateY(3).translateX(0).translateZ(-24);
        var cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 5, 32), this.getMaterial('red', 1, 'Phong'));
        cylinder1.translateY(3).translateX(-6).translateZ(-10);
        var cylinder2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 5, 5, 32), this.getMaterial('yellow', 1, 'Phong'));
        cylinder2.translateY(3).translateX(6).translateZ(-10);
        var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(5, 10, 20), this.getMaterial('red', 1, 'Phong'));
        plane1.rotateX(-90 / 180 * Math.PI);
        plane1.translateZ(-3);
        var plane2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 10, 20), this.getMaterial('yellow', 1, 'Phong'));
        plane2.rotateX(-90 / 180 * Math.PI);
        plane2.translateZ(-6);
        var response = [];
        response.push(ground);
        response.push(new THREE.Group().add(cube1).add(cube2));
        response.push(new THREE.Group().add(cone1).add(cone2));
        response.push(new THREE.Group().add(circle1).add(circle2));
        response.push(new THREE.Group().add(cylinder1).add(cylinder2));
        response.push(new THREE.Group().add(plane1).add(plane2));
        ground.translateY(-0.5);
        return response;
    };
    return ThreeGenerator;
}());
export { ThreeGenerator };

//# sourceMappingURL=three-generator.js.map
