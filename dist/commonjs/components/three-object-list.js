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
exports.FilterObjectListValueConverter = exports.ThreeObjectList = void 0;
const three_loader_1 = require("@pnext/three-loader");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const THREE = require("three");
const aurelia_pal_1 = require("aurelia-pal");
let ThreeObjectList = class ThreeObjectList {
    constructor(element) {
        this.element = element;
        this.objects = [];
        this.q = '';
        this.limit = 10;
        this.showAll = false;
        this.log = aurelia_logging_1.getLogger('comp:three-object-list');
    }
    toggleObject(object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        const o = object;
        if (Array.isArray(object.children) && object.children.length) {
            o.__list_opened = !o.__list_opened;
        }
        else {
            o.__list_opened = false;
        }
    }
    toggleVisible(object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        object.visible = !object.visible;
    }
    selectObject(object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        let eventDetail = object;
        this.element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent('select-object', { detail: eventDetail, bubbles: true }));
    }
    isCamera(object) {
        return object instanceof THREE.Camera;
    }
    isLight(object) {
        return object instanceof THREE.Light;
    }
    isGroup(object) {
        return object instanceof THREE.Group;
    }
    isMesh(object) {
        return object instanceof THREE.Mesh;
    }
    isGeometry(object) {
        return object instanceof THREE.BufferGeometry;
    }
    isPointClouds(object) {
        return object instanceof three_loader_1.PointCloudOctree;
    }
    isObject(object) {
        return !this.isCamera(object) &&
            !this.isLight(object) &&
            !this.isGroup(object) &&
            !this.isMesh(object) &&
            !this.isPointClouds(object) &&
            !this.isGeometry(object);
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Array)
], ThreeObjectList.prototype, "objects", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", String)
], ThreeObjectList.prototype, "q", void 0);
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", Number)
], ThreeObjectList.prototype, "limit", void 0);
ThreeObjectList = __decorate([
    aurelia_framework_1.inject(Element),
    __metadata("design:paramtypes", [Element])
], ThreeObjectList);
exports.ThreeObjectList = ThreeObjectList;
class FilterObjectListValueConverter {
    toView(list, q, limit = 10, showAll = false) {
        if (!q && (list.length < limit || showAll))
            return list;
        let newList = [];
        let terms = q ? q.toLowerCase().split(' ') : [];
        itemLoop: for (let item of list) {
            if (!q) {
                newList.push(item);
                continue itemLoop;
            }
            for (let term of terms) {
                if (item.name && item.name.toLowerCase().indexOf(term) !== -1) {
                    newList.push(item);
                    continue itemLoop;
                }
                if (item.uuid.toLowerCase().indexOf(term) !== -1) {
                    newList.push(item);
                    continue itemLoop;
                }
                if (item.type.toLowerCase().indexOf(term) !== -1) {
                    newList.push(item);
                    continue itemLoop;
                }
                for (let key in item.userData || {}) {
                    let value = item.userData[key];
                    if (typeof value === 'string' && value.toLowerCase().indexOf(term) !== -1) {
                        newList.push(item);
                        continue itemLoop;
                    }
                }
            }
        }
        if (!q && !showAll && newList.length > limit) {
            newList = newList.slice(0, limit);
        }
        return newList;
    }
}
exports.FilterObjectListValueConverter = FilterObjectListValueConverter;

//# sourceMappingURL=three-object-list.js.map
