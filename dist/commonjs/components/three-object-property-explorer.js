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
exports.ThreeObjectPropertyExplorer = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var resolvePath = require("object-resolve-path");
var aurelia_logging_1 = require("aurelia-logging");
var log = aurelia_logging_1.getLogger('three-object-property-explorer');
var ThreeObjectPropertyExplorer = (function () {
    function ThreeObjectPropertyExplorer(taskQueue) {
        this.taskQueue = taskQueue;
        this.properties = [];
        this.ready = false;
        this.props = [];
    }
    ThreeObjectPropertyExplorer.prototype.bind = function () {
        this.objectChanged();
        this.propertiesChanged();
    };
    ThreeObjectPropertyExplorer.prototype.objectChanged = function () {
        var _this = this;
        this.ready = false;
        this.taskQueue.queueTask(function () {
            _this.ready = true;
        });
        log.debug('object', this.object);
    };
    ThreeObjectPropertyExplorer.prototype.propertiesChanged = function () {
        var props = [];
        var properties = Array.isArray(this.properties) ? this.properties : this.properties(this.object);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            if (prop.substr(-2) === '.*') {
                var key = prop.substr(0, prop.length - 2);
                var value = resolvePath(this.object, key);
                if (typeof value !== 'object') {
                    continue;
                }
                var subKeys = Object.keys(value);
                for (var _a = 0, subKeys_1 = subKeys; _a < subKeys_1.length; _a++) {
                    var subKey = subKeys_1[_a];
                    props.push(key + "[\"" + subKey + "\"]");
                }
            }
            else {
                props.push(prop);
            }
        }
        this.props = props;
    };
    ThreeObjectPropertyExplorer.prototype.value = function (prop) {
        var anyValue = resolvePath(this.object, prop);
        if (typeof anyValue === 'string' || typeof anyValue === 'number') {
            return anyValue;
        }
        else if (typeof anyValue === 'boolean') {
            return anyValue ? 'Yes' : 'No';
        }
        else {
            return typeof anyValue;
        }
    };
    ThreeObjectPropertyExplorer.prototype.label = function (prop) {
        return prop.replace('["', '.').replace('"]', '').split('.').join(' ');
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", THREE.Object3D)
    ], ThreeObjectPropertyExplorer.prototype, "object", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ThreeObjectPropertyExplorer.prototype, "properties", void 0);
    ThreeObjectPropertyExplorer = __decorate([
        aurelia_framework_1.inject(aurelia_framework_1.TaskQueue),
        __metadata("design:paramtypes", [aurelia_framework_1.TaskQueue])
    ], ThreeObjectPropertyExplorer);
    return ThreeObjectPropertyExplorer;
}());
exports.ThreeObjectPropertyExplorer = ThreeObjectPropertyExplorer;

//# sourceMappingURL=three-object-property-explorer.js.map
