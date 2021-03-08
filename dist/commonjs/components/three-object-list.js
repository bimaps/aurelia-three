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
var three_loader_1 = require("@pnext/three-loader");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var THREE = require("three");
var aurelia_pal_1 = require("aurelia-pal");
var ThreeObjectList = (function () {
    function ThreeObjectList(element) {
        this.element = element;
        this.objects = [];
        this.q = '';
        this.limit = 10;
        this.showAll = false;
        this.log = aurelia_logging_1.getLogger('comp:three-object-list');
    }
    ThreeObjectList.prototype.toggleObject = function (object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        var o = object;
        if (Array.isArray(object.children) && object.children.length) {
            o.__list_opened = !o.__list_opened;
        }
        else {
            o.__list_opened = false;
        }
    };
    ThreeObjectList.prototype.toggleVisible = function (object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        object.visible = !object.visible;
    };
    ThreeObjectList.prototype.selectObject = function (object, event) {
        if (event.stopPropagation)
            event.stopPropagation();
        var eventDetail = object;
        this.element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent('select-object', { detail: eventDetail, bubbles: true }));
    };
    ThreeObjectList.prototype.isCamera = function (object) {
        return object instanceof THREE.Camera;
    };
    ThreeObjectList.prototype.isLight = function (object) {
        return object instanceof THREE.Light;
    };
    ThreeObjectList.prototype.isGroup = function (object) {
        return object instanceof THREE.Group;
    };
    ThreeObjectList.prototype.isMesh = function (object) {
        return object instanceof THREE.Mesh;
    };
    ThreeObjectList.prototype.isGeometry = function (object) {
        return object instanceof THREE.Geometry;
    };
    ThreeObjectList.prototype.isPointClouds = function (object) {
        return object instanceof three_loader_1.PointCloudOctree;
    };
    ThreeObjectList.prototype.isObject = function (object) {
        return !this.isCamera(object) &&
            !this.isLight(object) &&
            !this.isGroup(object) &&
            !this.isMesh(object) &&
            !this.isPointClouds(object) &&
            !this.isGeometry(object);
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
    return ThreeObjectList;
}());
exports.ThreeObjectList = ThreeObjectList;
var FilterObjectListValueConverter = (function () {
    function FilterObjectListValueConverter() {
    }
    FilterObjectListValueConverter.prototype.toView = function (list, q, limit, showAll) {
        if (limit === void 0) { limit = 10; }
        if (showAll === void 0) { showAll = false; }
        if (!q && (list.length < limit || showAll))
            return list;
        var newList = [];
        var terms = q ? q.toLowerCase().split(' ') : [];
        itemLoop: for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var item = list_1[_i];
            if (!q) {
                newList.push(item);
                continue itemLoop;
            }
            for (var _a = 0, terms_1 = terms; _a < terms_1.length; _a++) {
                var term = terms_1[_a];
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
                for (var key in item.userData || {}) {
                    var value = item.userData[key];
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
    };
    return FilterObjectListValueConverter;
}());
exports.FilterObjectListValueConverter = FilterObjectListValueConverter;

//# sourceMappingURL=three-object-list.js.map
