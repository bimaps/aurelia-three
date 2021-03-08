"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreePropertyValueConverter = exports.ThreeObjectPropertyList = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var THREE = require("three");
var ThreeObjectPropertyList = (function () {
    function ThreeObjectPropertyList(element) {
        this.element = element;
        this.editable = false;
        this.log = aurelia_logging_1.getLogger('comp:three-object-property-list');
    }
    ThreeObjectPropertyList.prototype.objectChanged = function () {
        var _this = this;
        if (this.orthoCameraInterval) {
            clearInterval(this.orthoCameraInterval);
            this.orthoCameraInterval = undefined;
        }
        if (this.object instanceof THREE.OrthographicCamera) {
            this.orthoCameraInterval = setInterval(function () {
                if (_this.object instanceof THREE.OrthographicCamera) {
                    _this.object.updateProjectionMatrix();
                    _this.object.updateMatrixWorld();
                }
            }, 500);
        }
    };
    Object.defineProperty(ThreeObjectPropertyList.prototype, "properties", {
        get: function () {
            if (!this.object)
                return [];
            var keys = Object.keys(this.object);
            var keyPriority = {
                name: 10,
                position: 9,
                near: 5,
                far: 5,
                zoom: 5,
                top: 4,
                left: 4,
                right: 4,
                bottom: 4
            };
            if (keys.indexOf('name') === -1) {
                keys.unshift('name');
            }
            keys.sort(function (a, b) {
                var pa = keyPriority[a] || 0;
                var pb = keyPriority[b] || 0;
                if (pa < pb)
                    return 1;
                if (pa > pb)
                    return -1;
                return 0;
            });
            return keys;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeObjectPropertyList.prototype, "userData", {
        get: function () {
            if (!this.object || !this.object.userData)
                return [];
            return Object.keys(this.object.userData);
        },
        enumerable: false,
        configurable: true
    });
    ThreeObjectPropertyList.prototype.editString = function (prop) {
        if (prop === 'name')
            return true;
        return false;
    };
    ThreeObjectPropertyList.prototype.edit3d = function (prop) {
        if (prop === 'position' || prop === 'rotation' || prop === 'up' || prop === 'scale')
            return true;
        return false;
    };
    ThreeObjectPropertyList.prototype.edit4d = function (prop) {
        if (prop === 'quaternion')
            return true;
        return false;
    };
    ThreeObjectPropertyList.prototype.editNumber = function (prop) {
        if (prop === 'top' || prop === 'left' || prop === 'right' || prop === 'bottom')
            return true;
        return false;
    };
    ThreeObjectPropertyList.prototype.editBoolean = function (prop) {
        if (prop === 'visible' || prop === 'matrixAutoUpdate' || prop === 'frustumCulled')
            return true;
        return false;
    };
    ThreeObjectPropertyList.prototype.hidePropDueToEdit = function (prop) {
        if (!this.editable)
            return false;
        return this.editString(prop) || this.edit3d(prop) || this.edit4d(prop) || this.editNumber(prop) || this.editBoolean(prop);
    };
    ThreeObjectPropertyList.prototype.propClick = function (prop) {
        if (prop === 'geometry') {
            this.log.debug('Geometry:', this.object[prop]);
        }
        else if (prop === 'material') {
            this.log.debug('Material:', this.object[prop]);
        }
        else if (prop === 'children') {
            this.log.debug('Children:', this.object[prop]);
        }
        return true;
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ThreeObjectPropertyList.prototype, "object", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], ThreeObjectPropertyList.prototype, "editable", void 0);
    __decorate([
        aurelia_framework_1.computedFrom('object'),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ThreeObjectPropertyList.prototype, "properties", null);
    __decorate([
        aurelia_framework_1.computedFrom('object.userData'),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ThreeObjectPropertyList.prototype, "userData", null);
    ThreeObjectPropertyList = __decorate([
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Element])
    ], ThreeObjectPropertyList);
    return ThreeObjectPropertyList;
}());
exports.ThreeObjectPropertyList = ThreeObjectPropertyList;
var ThreePropertyValueConverter = (function () {
    function ThreePropertyValueConverter() {
    }
    ThreePropertyValueConverter.prototype.toView = function (value, key) {
        if (key === void 0) { key = ''; }
        if (typeof value === 'string')
            return value;
        if (typeof value === 'boolean')
            return value ? 'true' : 'false';
        if (typeof value === 'number')
            return value.toString();
        if (value instanceof THREE.Vector3 || value instanceof THREE.Euler)
            return "{<br>&nbsp;&nbsp;x: " + value.x + ", <br>&nbsp;&nbsp;y: " + value.y + ", <br>&nbsp;&nbsp;z: " + value.z + "<br>}";
        if (value instanceof THREE.Quaternion)
            return "{<br>&nbsp;&nbsp;w: " + value.w + ", <br>&nbsp;&nbsp;x: " + value.x + ", <br>&nbsp;&nbsp;y: " + value.y + ", <br>&nbsp;&nbsp;z: " + value.z + "<br>}";
        if (value instanceof THREE.Object3D)
            return "" + (value.name || value.uuid);
        if (value instanceof THREE.Matrix4)
            return "[ " + value.elements.slice(0, 4).join(', ') + ", <br>" + value.elements.slice(4, 8).join(', ') + ", <br>" + value.elements.slice(8, 12).join(', ') + ", <br>" + value.elements.slice(12, 16).join(', ') + "]";
        if (value instanceof THREE.Layers)
            return "mask: " + value.mask;
        if (value instanceof THREE.Geometry)
            return value.uuid;
        if (value instanceof THREE.BufferGeometry)
            return value.uuid;
        if (value instanceof THREE.Material)
            return value.uuid;
        if (value instanceof THREE.Color)
            return "{<br>&nbsp;&nbsp;r: " + value.r + ", <br>&nbsp;&nbsp;g: " + value.g + ", <br>&nbsp;&nbsp;b: " + value.b + "<br>}<br>" + value.getHexString();
        if (Array.isArray(value))
            return value.length + " elements";
        console.warn('ThreePropertyValueConverter, unknown value type on key', key, ':', value);
        return '';
    };
    return ThreePropertyValueConverter;
}());
exports.ThreePropertyValueConverter = ThreePropertyValueConverter;

//# sourceMappingURL=three-object-property-list.js.map
