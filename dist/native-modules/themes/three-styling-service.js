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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreeGeometry } from './three-geometry';
import { ThreeUtils } from './../helpers/three-utils';
import { Parser } from "aurelia-resources";
import * as THREE from 'three';
import * as resolvePath from 'object-resolve-path';
import * as moment from 'moment';
import { computedFrom } from 'aurelia-binding';
import { ThreeStyleDefinition } from './three-style-definition';
import { getLogger } from 'aurelia-logging';
import { SpriteText2D, textAlign } from 'three-text2d';
import { ThreeIcon } from './three-icon';
var ThreeStylingService = (function () {
    function ThreeStylingService(three, atv) {
        this.atv = atv;
        this.log = getLogger('three-styling-service');
        this.three = three;
        this.registerSubscribers();
    }
    ThreeStylingService.prototype.registerSubscribers = function () {
        var _this = this;
        this.three.subscribe('three-scene.request-styling', function (data) {
            if (data.three === _this.three && _this.currentTheme) {
                _this.applyCurrentTheme();
            }
        });
    };
    Object.defineProperty(ThreeStylingService.prototype, "currentThemeName", {
        get: function () {
            if (!this.currentTheme)
                return '';
            return this.currentTheme.name;
        },
        enumerable: false,
        configurable: true
    });
    ThreeStylingService.prototype.activate = function (theme) {
        if (this.currentTheme) {
            this.currentTheme.deactivate();
        }
        theme.activate(this.three);
        this.currentTheme = theme;
        return this.applyCurrentTheme();
    };
    ThreeStylingService.prototype.clearTheme = function () {
        var _this = this;
        if (this.currentTheme) {
            this.currentTheme.deactivate();
        }
        this.currentTheme = undefined;
        this.three.getScene().traverse(function (object) {
            _this.resetDefinition(object);
        });
        this.three.objects.removeAllEdges();
    };
    ThreeStylingService.prototype.applyCurrentTheme = function (context, options) {
        if (context === void 0) { context = []; }
        if (options === void 0) { options = {}; }
        return this.applyTheme(this.three.getScene(), this.currentTheme, context, options);
    };
    ThreeStylingService.prototype.removeRelatedObjects = function (obj) {
        this.removeObjectIcon(obj);
        this.removeObjectLabel(obj);
    };
    ThreeStylingService.prototype.applyTheme = function (objects, theme, context, options) {
        var _this = this;
        if (context === void 0) { context = []; }
        if (options === void 0) { options = {}; }
        if (objects instanceof THREE.Object3D)
            objects = [objects];
        var rules = theme.rules.filter(function (rule) {
            if (rule.active === false)
                return false;
            if (rule.context.length === 0)
                return true;
            return (rule.context.filter(function (x) { return context.includes(x); })).length > 0;
        });
        rules.sort(function (a, b) {
            if (a.priority > b.priority)
                return -1;
            if (a.priority > b.priority)
                return 1;
            return 0;
        });
        var childrenDefinitions = {};
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var rootObject = objects_1[_i];
            rootObject.traverse(function (object) {
                var o = object;
                if (o.__filterToolVisible == false) {
                    _this.removeObjectIcon(object);
                    _this.removeObjectLabel(object);
                    return;
                }
                var definition = new ThreeStyleDefinition();
                if (childrenDefinitions[object.uuid])
                    definition.augment(childrenDefinitions[object.uuid]);
                for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                    var rule = rules_1[_i];
                    if (!_this.compareRuleWithObject(rule, object))
                        continue;
                    if (rule.exclusive) {
                        definition.clear();
                    }
                    definition.augment(rule.definition);
                    if (rule.applyToChildren) {
                        object.traverse(function (child) {
                            if (child === object)
                                return;
                            var uuid = child.uuid;
                            var def = childrenDefinitions[uuid] ? childrenDefinitions[uuid] : new ThreeStyleDefinition();
                            def.augment(definition);
                            childrenDefinitions[uuid] = def;
                        });
                    }
                    if (rule.last) {
                        break;
                    }
                }
                _this.applyDefinition(object, definition);
            });
        }
        childrenDefinitions = undefined;
    };
    ThreeStylingService.prototype.preparePathKey = function (key) {
        var parts = key.split('.');
        for (var i = 0; i < parts.length; i++) {
            if (i === 0) {
                continue;
            }
            parts[i] = "[\"" + parts[i] + "\"]";
        }
        return parts.join('');
    };
    ThreeStylingService.prototype.compareRuleWithObject = function (rule, object) {
        for (var _i = 0, _a = rule.conditions; _i < _a.length; _i++) {
            var condition = _a[_i];
            var key = this.fixKeyWithOriginal(object, condition.key);
            var value = resolvePath(object, this.preparePathKey(key));
            if (typeof condition.value === 'number' && typeof value === 'string') {
                value = parseFloat(value);
            }
            else if (condition.value instanceof Date && typeof value === 'string') {
                value = moment(value).toDate();
            }
            if (condition.type === '=') {
                if (this.makeNumerIfPossible(value) != this.makeNumerIfPossible(condition.value))
                    return false;
            }
            else if (condition.type === '!=') {
                if (this.makeNumerIfPossible(value) == this.makeNumerIfPossible(condition.value))
                    return false;
            }
            else if (condition.type === '<') {
                if (this.makeNumerIfPossible(value) > this.makeNumerIfPossible(condition.value))
                    return false;
            }
            else if (condition.type === '>') {
                if (this.makeNumerIfPossible(value) < this.makeNumerIfPossible(condition.value))
                    return false;
            }
            else if (condition.type === '*') {
                if (typeof condition.value !== 'string' && condition.value.toString)
                    condition.value = condition.value.toString();
                if (typeof value !== 'string' && value.toString)
                    value = value.toString();
                if (typeof value !== 'string' || typeof condition.value !== 'string') {
                    return false;
                }
                if (value.toLowerCase().indexOf(condition.value.toLowerCase()) === -1)
                    return false;
            }
        }
        return true;
    };
    ThreeStylingService.prototype.makeNumerIfPossible = function (input) {
        if (typeof input !== 'string') {
            return input;
        }
        var num = parseFloat(input.trim());
        return "" + num === input.trim() ? num : input;
    };
    ThreeStylingService.prototype.fixKeyWithOriginal = function (object, key) {
        var o = object;
        if (key.indexOf('geometry.') === 0 && o.__originalGeometry) {
            key = key.replace('geometry.', '__originalGeometry.');
        }
        if (key.indexOf('material.') === 0 && o.__originalMaterial) {
            key = key.replace('material.', '__originalMaterial.');
        }
        return key;
    };
    ThreeStylingService.prototype.resetDefinition = function (object) {
        var o = object;
        if (!o.__originalSaved) {
            return;
        }
        object.visible = o.__originalVisible;
        if (object instanceof THREE.Mesh) {
            delete object.__selectToolOriginalMaterial;
            object.material = o.__originalMaterial;
            object.geometry = o.__originalGeometry;
        }
        if (o.__originalSaved) {
            this.unsetOriginalObjectValues(object);
        }
        this.removeObjectLabel(object);
        this.removeObjectIcon(object);
    };
    ThreeStylingService.prototype.applyDefinition = function (object, definition) {
        var o = object;
        if (!o.__originalSaved) {
            this.setOriginalObjectValues(object);
        }
        if (definition.display === undefined) {
            object.visible = object.__filterToolVislble;
        }
        else {
            object.visible = definition.display;
        }
        if (object instanceof THREE.Mesh) {
            delete object.__selectToolOriginalMaterial;
            if (definition.material === undefined) {
                object.material = o.__originalMaterial;
            }
            else {
                object.material = definition.material;
            }
            if (definition.replaceGeometry === true) {
                this.replaceObjectGeometry(object, definition);
            }
            else if (o.__originalGeometry && object.geometry !== o.__originalGeometry && definition.replaceGeometry === false) {
                object.geometry = o.__originalGeometry;
            }
            if (definition.edgesDisplay) {
                this.three.objects.addEdgestoObject(object);
            }
            else {
                this.three.objects.removeEdgesObject(object);
            }
        }
        if (definition.displayLabel === true) {
            this.addObjectLabel(object, definition);
        }
        else {
            this.removeObjectLabel(object);
        }
        if (definition.icon === true) {
            this.addObjectIcon(object, definition);
        }
        else {
            this.removeObjectIcon(object);
        }
    };
    ThreeStylingService.prototype.addObjectLabel = function (object, definition) {
        this.removeObjectLabel(object);
        var name = "label-" + object.uuid;
        var position;
        if (object.userData.__labelPosition) {
            var labelPosition = object.userData.__labelPosition.split(',');
            position = {
                x: parseFloat(labelPosition[0]),
                y: parseFloat(labelPosition[1]),
                z: parseFloat(labelPosition[2])
            };
        }
        else {
            var bbox = ThreeUtils.bboxFromObject(object);
            if (definition.labelCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
                position = ThreeUtils.polylabel(object, bbox.min.y);
            }
            else {
                position = ThreeUtils.centroidFromBbox(bbox);
            }
        }
        var offsetX = 0;
        var offsetY = 0;
        var offsetZ = 0;
        if (definition.labelPosition && definition.labelPosition.x) {
            offsetX = definition.labelPosition.x;
        }
        if (definition.labelPosition && definition.labelPosition.y) {
            offsetY = definition.labelPosition.y;
        }
        if (definition.labelPosition && definition.labelPosition.z) {
            offsetZ = definition.labelPosition.z;
        }
        position.x += offsetX;
        position.y += offsetY;
        position.z += offsetZ;
        var options = {
            textAlign: textAlign.center,
            font: '40px Arial',
            textColor: definition.labelTextColor,
            backgroundColor: definition.labelBackgroundColor,
            paddingX: 10
        };
        var text = '';
        if (definition.labelTemplate) {
            text = Parser.parseTemplate(definition.labelTemplate, { object: object });
        }
        else {
            text = resolvePath(object, definition.labelKey || 'userData.label');
        }
        if (!text)
            return;
        this.addLabel(name, text, position, definition.labelScale, options);
    };
    ThreeStylingService.prototype.removeObjectLabel = function (object) {
        var name = "label-" + object.uuid;
        var labelObject = this.three.getScene('overlay').getObjectByName(name);
        if (labelObject)
            this.three.getScene('overlay').remove(labelObject);
    };
    ThreeStylingService.prototype.addLabel = function (name, text, position, scale, options) {
        if (position === void 0) { position = { x: 0, y: 0, z: 0 }; }
        if (scale === void 0) { scale = 1; }
        if (options === void 0) { options = {}; }
        if (options.textAlign === undefined)
            options.textAlign = textAlign.center;
        if (options.font === undefined)
            options.font = '20px Arial';
        if (options.textColor === undefined)
            options.textColor = '#000000';
        if (options.backgroundColor === undefined)
            options.backgroundColor = '#fffff';
        if (options.paddingX === undefined)
            options.paddingX = 10;
        if (typeof scale !== 'number' || Number.isNaN(scale))
            scale = 1;
        var sprite = new SpriteText2D(text, {
            align: options.textAlign,
            font: options.font,
            fillStyle: options.textColor,
            backgroundColor: options.backgroundColor,
            verticalPadding: 2,
            horizontalPadding: 2,
            antialias: false
        });
        sprite.position.set(position.x, position.y, position.z);
        sprite.scale.set(scale * 0.1, scale * 0.1, scale * 0.1);
        sprite.name = name;
        sprite.userData._type = '_label';
        sprite.material.depthTest = false;
        sprite.renderOrder = 10;
        this.three.getScene('overlay').add(sprite);
        return sprite;
    };
    ThreeStylingService.prototype.addObjectIcon = function (object, definition) {
        this.removeObjectIcon(object);
        var name = "icon-" + object.uuid;
        var position;
        if (object.userData.__iconPosition) {
            var iconPosition = object.userData.__iconPosition.split(',');
            position = {
                x: parseFloat(iconPosition[0]),
                y: parseFloat(iconPosition[1]),
                z: parseFloat(iconPosition[2])
            };
        }
        else {
            var bbox = ThreeUtils.bboxFromObject(object);
            if (definition.iconCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
                position = ThreeUtils.polylabel(object, bbox.min.y);
            }
            else {
                position = ThreeUtils.centroidFromBbox(bbox);
            }
        }
        var offsetX = 0;
        var offsetY = 0;
        var offsetZ = 0;
        if (definition.iconPosition && definition.iconPosition.x) {
            offsetX = definition.iconPosition.x;
        }
        if (definition.iconPosition && definition.iconPosition.y) {
            offsetY = definition.iconPosition.y;
        }
        if (definition.iconPosition && definition.iconPosition.z) {
            offsetZ = definition.iconPosition.z;
        }
        position.x += offsetX;
        position.y += offsetY;
        position.z += offsetZ;
        var options = {
            strokeColor: definition.iconForeground,
            backgroundColor: definition.iconBackground,
            text: definition.iconText
        };
        var iconName = definition.iconDefault;
        var iconValue = resolvePath(object, definition.iconKey || 'userData.icon');
        if (iconValue) {
            iconName = iconValue;
        }
        if (!iconName && !options.text)
            return;
        this.addIcon(name, iconName, position, definition.iconScale, options);
    };
    ThreeStylingService.prototype.addIcon = function (objectName, iconName, position, scale, options) {
        var _this = this;
        if (scale === void 0) { scale = 1; }
        if (options === void 0) { options = {}; }
        if (!options.backgroundColor)
            options.backgroundColor = 'default';
        if (!options.strokeColor)
            options.strokeColor = 'default';
        return ThreeIcon.getTexture(iconName, options.backgroundColor, options.strokeColor, options.text).then(function (texture) {
            if (!texture) {
                throw new Error('Impossible to draw icon, missing texture');
            }
            var material = new THREE.SpriteMaterial({ map: texture });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(position.x, position.y, position.z);
            sprite.scale.set(scale, scale, scale);
            sprite.name = objectName;
            sprite.userData._type = '_icon';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            _this.three.getScene('overlay').add(sprite);
            return sprite;
        });
    };
    ThreeStylingService.prototype.removeObjectIcon = function (object) {
        var name = "icon-" + object.uuid;
        var iconObject = this.three.getScene('overlay').getObjectByName(name);
        if (iconObject)
            this.three.getScene('overlay').remove(iconObject);
    };
    ThreeStylingService.prototype.replaceObjectGeometry = function (object, definition) {
        var o = object;
        var position = ThreeUtils.centroidFromObject(object);
        var tx = position.x + (definition.geometryPosition ? definition.geometryPosition.x : 0);
        var ty = position.x + (definition.geometryPosition ? definition.geometryPosition.y : 0);
        var tz = position.x + (definition.geometryPosition ? definition.geometryPosition.z : 0);
        var rx;
        var ry;
        var rz;
        if (object.userData.__geometryRotation) {
            var geometryRotation = object.userData.__geometryRotation.split(',');
            rx = parseFloat(geometryRotation[0]);
            ry = parseFloat(geometryRotation[1]);
            rz = parseFloat(geometryRotation[2]);
        }
        else {
            rx = definition.geometryRotation ? definition.geometryRotation.x : 0;
            ry = definition.geometryRotation ? definition.geometryRotation.y : 0;
            rz = definition.geometryRotation ? definition.geometryRotation.z : 0;
        }
        var matrix = new THREE.Matrix4();
        var translation = new THREE.Matrix4().makeTranslation(tx, ty, tz);
        var rotationX = new THREE.Matrix4().makeRotationX(rx);
        var rotationY = new THREE.Matrix4().makeRotationY(ry);
        var rotationZ = new THREE.Matrix4().makeRotationZ(rz);
        var scale = new THREE.Matrix4().makeScale(definition.geometryScale, definition.geometryScale, definition.geometryScale);
        matrix.multiply(translation).multiply(rotationX).multiply(rotationY).multiply(rotationZ).multiply(scale);
        var geometry = ThreeGeometry.get(definition.geometryShape);
        geometry.applyMatrix(matrix);
        if (object instanceof THREE.Mesh) {
            object.geometry = geometry;
        }
        else if (definition.material) {
            var replacingObject = new THREE.Mesh(geometry, definition.material);
            for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.substr(0, 1) === '_')
                    replacingObject[key] = object[key];
            }
            replacingObject.userData = object.userData;
            replacingObject.userData._replacing = object;
            object.add(replacingObject);
        }
    };
    ThreeStylingService.prototype.setOriginalObjectValues = function (object) {
        var o = object;
        o.__originalVisible = object.visible;
        o.__originalGeometry = object instanceof THREE.Mesh ? object.geometry : undefined;
        o.__originalMaterial = object instanceof THREE.Mesh ? object.material : undefined;
        o.__originalSaved = true;
        return o;
    };
    ThreeStylingService.prototype.unsetOriginalObjectValues = function (object) {
        var o = object;
        delete o.__originalVisible;
        delete o.__originalGeometry;
        delete o.__originalMaterial;
        delete o.__originalSaved;
        return o;
    };
    __decorate([
        computedFrom('currentTheme', 'currentTheme.name'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ThreeStylingService.prototype, "currentThemeName", null);
    return ThreeStylingService;
}());
export { ThreeStylingService };
var StylingObject = (function (_super) {
    __extends(StylingObject, _super);
    function StylingObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StylingObject;
}(THREE.Object3D));
export { StylingObject };

//# sourceMappingURL=three-styling-service.js.map
