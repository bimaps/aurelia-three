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
exports.StylingObject = exports.ThreeStylingService = void 0;
const three_geometry_1 = require("./three-geometry");
const three_utils_1 = require("./../helpers/three-utils");
const aurelia_resources_1 = require("aurelia-resources");
const THREE = require("three");
const resolvePath = require("object-resolve-path");
const moment = require("moment");
const aurelia_binding_1 = require("aurelia-binding");
const three_style_definition_1 = require("./three-style-definition");
const aurelia_logging_1 = require("aurelia-logging");
const three_text2d_1 = require("three-text2d");
const three_icon_1 = require("./three-icon");
class ThreeStylingService {
    constructor(three, atv) {
        this.atv = atv;
        this.log = aurelia_logging_1.getLogger('three-styling-service');
        this.three = three;
        this.registerSubscribers();
    }
    registerSubscribers() {
        this.three.subscribe('three-scene.request-styling', (data) => {
            if (data.three === this.three && this.currentTheme) {
                this.applyCurrentTheme();
            }
        });
    }
    get currentThemeName() {
        if (!this.currentTheme)
            return '';
        return this.currentTheme.name;
    }
    activate(theme) {
        if (this.currentTheme) {
            this.currentTheme.deactivate();
        }
        theme.activate(this.three);
        this.currentTheme = theme;
        return this.applyCurrentTheme();
    }
    clearTheme() {
        if (this.currentTheme) {
            this.currentTheme.deactivate();
        }
        this.currentTheme = undefined;
        this.three.getScene().traverse((object) => {
            this.resetDefinition(object);
        });
        this.three.objects.removeAllEdges();
    }
    applyCurrentTheme(context = [], options = {}) {
        return this.applyTheme(this.three.getScene(), this.currentTheme, context, options);
    }
    removeRelatedObjects(obj) {
        this.removeObjectIcon(obj);
        this.removeObjectLabel(obj);
    }
    applyTheme(objects, theme, context = [], options = {}) {
        if (objects instanceof THREE.Object3D)
            objects = [objects];
        let rules = theme.rules.filter((rule) => {
            if (rule.active === false)
                return false;
            if (rule.context.length === 0)
                return true;
            return (rule.context.filter(x => context.includes(x))).length > 0;
        });
        rules.sort((a, b) => {
            if (a.priority > b.priority)
                return -1;
            if (a.priority > b.priority)
                return 1;
            return 0;
        });
        let childrenDefinitions = {};
        for (let rootObject of objects) {
            rootObject.traverse((object) => {
                const o = object;
                if (o.__filterToolVisible == false) {
                    this.removeObjectIcon(object);
                    this.removeObjectLabel(object);
                    return;
                }
                let definition = new three_style_definition_1.ThreeStyleDefinition();
                if (childrenDefinitions[object.uuid])
                    definition.augment(childrenDefinitions[object.uuid]);
                for (let rule of rules) {
                    if (!this.compareRuleWithObject(rule, object))
                        continue;
                    if (rule.exclusive) {
                        definition.clear();
                    }
                    definition.augment(rule.definition);
                    if (rule.applyToChildren) {
                        object.traverse((child) => {
                            if (child === object)
                                return;
                            let uuid = child.uuid;
                            let def = childrenDefinitions[uuid] ? childrenDefinitions[uuid] : new three_style_definition_1.ThreeStyleDefinition();
                            def.augment(definition);
                            childrenDefinitions[uuid] = def;
                        });
                    }
                    if (rule.last) {
                        break;
                    }
                }
                this.applyDefinition(object, definition);
            });
        }
        childrenDefinitions = undefined;
    }
    preparePathKey(key) {
        const parts = key.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === 0) {
                continue;
            }
            parts[i] = `["${parts[i]}"]`;
        }
        return parts.join('');
    }
    compareRuleWithObject(rule, object) {
        for (let condition of rule.conditions) {
            let key = this.fixKeyWithOriginal(object, condition.key);
            let value = resolvePath(object, this.preparePathKey(key));
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
    }
    makeNumerIfPossible(input) {
        if (typeof input !== 'string') {
            return input;
        }
        const num = parseFloat(input.trim());
        return `${num}` === input.trim() ? num : input;
    }
    fixKeyWithOriginal(object, key) {
        const o = object;
        if (key.indexOf('geometry.') === 0 && o.__originalGeometry) {
            key = key.replace('geometry.', '__originalGeometry.');
        }
        if (key.indexOf('material.') === 0 && o.__originalMaterial) {
            key = key.replace('material.', '__originalMaterial.');
        }
        return key;
    }
    resetDefinition(object) {
        const o = object;
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
    }
    applyDefinition(object, definition) {
        const o = object;
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
    }
    addObjectLabel(object, definition) {
        this.removeObjectLabel(object);
        let name = `label-${object.uuid}`;
        let position;
        if (object.userData.__labelPosition) {
            let labelPosition = object.userData.__labelPosition.split(',');
            position = {
                x: parseFloat(labelPosition[0]),
                y: parseFloat(labelPosition[1]),
                z: parseFloat(labelPosition[2])
            };
        }
        else {
            let bbox = three_utils_1.ThreeUtils.bboxFromObject(object);
            if (definition.labelCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
                console.warn('Polylabel is not currently supported');
            }
            else {
                position = three_utils_1.ThreeUtils.centroidFromBbox(bbox);
            }
        }
        let offsetX = 0;
        let offsetY = 0;
        let offsetZ = 0;
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
        let options = {
            textAlign: three_text2d_1.textAlign.center,
            font: '40px Arial',
            textColor: definition.labelTextColor,
            backgroundColor: definition.labelBackgroundColor,
            paddingX: 10
        };
        let text = '';
        if (definition.labelTemplate) {
            text = aurelia_resources_1.Parser.parseTemplate(definition.labelTemplate, { object });
        }
        else {
            text = resolvePath(object, definition.labelKey || 'userData.label');
        }
        if (!text)
            return;
        this.addLabel(name, text, position, definition.labelScale, options);
    }
    removeObjectLabel(object) {
        let name = `label-${object.uuid}`;
        let labelObject = this.three.getScene('overlay').getObjectByName(name);
        if (labelObject)
            this.three.getScene('overlay').remove(labelObject);
    }
    addLabel(name, text, position = { x: 0, y: 0, z: 0 }, scale = 1, options = {}) {
        if (options.textAlign === undefined)
            options.textAlign = three_text2d_1.textAlign.center;
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
        let sprite = new three_text2d_1.SpriteText2D(text, {
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
    }
    addObjectIcon(object, definition) {
        this.removeObjectIcon(object);
        let name = `icon-${object.uuid}`;
        let position;
        if (object.userData.__iconPosition) {
            let iconPosition = object.userData.__iconPosition.split(',');
            position = {
                x: parseFloat(iconPosition[0]),
                y: parseFloat(iconPosition[1]),
                z: parseFloat(iconPosition[2])
            };
        }
        else {
            let bbox = three_utils_1.ThreeUtils.bboxFromObject(object);
            if (definition.iconCentroidMethod === 'polylabel' && object instanceof THREE.Mesh) {
                console.warn('Polylabel is not currently supported');
            }
            else {
                position = three_utils_1.ThreeUtils.centroidFromBbox(bbox);
            }
        }
        let offsetX = 0;
        let offsetY = 0;
        let offsetZ = 0;
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
        let options = {
            strokeColor: definition.iconForeground,
            backgroundColor: definition.iconBackground,
            text: definition.iconText
        };
        let iconName = definition.iconDefault;
        let iconValue = resolvePath(object, definition.iconKey || 'userData.icon');
        if (iconValue) {
            iconName = iconValue;
        }
        if (!iconName && !options.text)
            return;
        this.addIcon(name, iconName, position, definition.iconScale, options);
    }
    addIcon(objectName, iconName, position, scale = 1, options = {}) {
        if (!options.backgroundColor)
            options.backgroundColor = 'default';
        if (!options.strokeColor)
            options.strokeColor = 'default';
        return three_icon_1.ThreeIcon.getTexture(iconName, options.backgroundColor, options.strokeColor, options.text).then((texture) => {
            if (!texture) {
                throw new Error('Impossible to draw icon, missing texture');
            }
            let material = new THREE.SpriteMaterial({ map: texture });
            let sprite = new THREE.Sprite(material);
            sprite.position.set(position.x, position.y, position.z);
            sprite.scale.set(scale, scale, scale);
            sprite.name = objectName;
            sprite.userData._type = '_icon';
            sprite.material.depthTest = false;
            sprite.renderOrder = 10;
            this.three.getScene('overlay').add(sprite);
            return sprite;
        });
    }
    removeObjectIcon(object) {
        let name = `icon-${object.uuid}`;
        let iconObject = this.three.getScene('overlay').getObjectByName(name);
        if (iconObject)
            this.three.getScene('overlay').remove(iconObject);
    }
    replaceObjectGeometry(object, definition) {
        const o = object;
        let position = three_utils_1.ThreeUtils.centroidFromObject(object);
        let tx = position.x + (definition.geometryPosition ? definition.geometryPosition.x : 0);
        let ty = position.x + (definition.geometryPosition ? definition.geometryPosition.y : 0);
        let tz = position.x + (definition.geometryPosition ? definition.geometryPosition.z : 0);
        let rx;
        let ry;
        let rz;
        if (object.userData.__geometryRotation) {
            let geometryRotation = object.userData.__geometryRotation.split(',');
            rx = parseFloat(geometryRotation[0]);
            ry = parseFloat(geometryRotation[1]);
            rz = parseFloat(geometryRotation[2]);
        }
        else {
            rx = definition.geometryRotation ? definition.geometryRotation.x : 0;
            ry = definition.geometryRotation ? definition.geometryRotation.y : 0;
            rz = definition.geometryRotation ? definition.geometryRotation.z : 0;
        }
        let matrix = new THREE.Matrix4();
        let translation = new THREE.Matrix4().makeTranslation(tx, ty, tz);
        let rotationX = new THREE.Matrix4().makeRotationX(rx);
        let rotationY = new THREE.Matrix4().makeRotationY(ry);
        let rotationZ = new THREE.Matrix4().makeRotationZ(rz);
        let scale = new THREE.Matrix4().makeScale(definition.geometryScale, definition.geometryScale, definition.geometryScale);
        matrix.multiply(translation).multiply(rotationX).multiply(rotationY).multiply(rotationZ).multiply(scale);
        let geometry = three_geometry_1.ThreeGeometry.get(definition.geometryShape);
        geometry.applyMatrix4(matrix);
        if (object instanceof THREE.Mesh) {
            object.geometry = geometry;
        }
        else if (definition.material) {
            let replacingObject = new THREE.Mesh(geometry, definition.material);
            for (let key of Object.keys(object)) {
                if (key.substr(0, 1) === '_')
                    replacingObject[key] = object[key];
            }
            replacingObject.userData = object.userData;
            replacingObject.userData._replacing = object;
            object.add(replacingObject);
        }
    }
    setOriginalObjectValues(object) {
        const o = object;
        o.__originalVisible = object.visible;
        o.__originalGeometry = object instanceof THREE.Mesh ? object.geometry : undefined;
        o.__originalMaterial = object instanceof THREE.Mesh ? object.material : undefined;
        o.__originalSaved = true;
        return o;
    }
    unsetOriginalObjectValues(object) {
        const o = object;
        delete o.__originalVisible;
        delete o.__originalGeometry;
        delete o.__originalMaterial;
        delete o.__originalSaved;
        return o;
    }
}
__decorate([
    aurelia_binding_1.computedFrom('currentTheme', 'currentTheme.name'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ThreeStylingService.prototype, "currentThemeName", null);
exports.ThreeStylingService = ThreeStylingService;
class StylingObject extends THREE.Object3D {
}
exports.StylingObject = StylingObject;

//# sourceMappingURL=three-styling-service.js.map
