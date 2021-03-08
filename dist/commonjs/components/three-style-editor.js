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
exports.ThreeStyleEditor = void 0;
var style_model_1 = require("./../models/style.model");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var ThreeStyleEditor = (function () {
    function ThreeStyleEditor(element) {
        this.element = element;
        this.subscriptions = [];
        this.log = aurelia_logging_1.getLogger('comp:three-style-editor');
    }
    ThreeStyleEditor.prototype.detatched = function () {
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
    };
    ThreeStyleEditor.prototype.styleModif = function (prop) {
        var s = this._style;
        if (!Array.isArray(s.__editedProperties)) {
            s.__editedProperties = [];
        }
        if (!s.__editedProperties.includes(prop))
            s.__editedProperties.push(prop);
        this.notifyStyleChange();
    };
    ThreeStyleEditor.prototype.notifyStyleChange = function () {
        aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator).publish('three-style:update');
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", style_model_1.ThreeStyleModel)
    ], ThreeStyleEditor.prototype, "_style", void 0);
    ThreeStyleEditor = __decorate([
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Element])
    ], ThreeStyleEditor);
    return ThreeStyleEditor;
}());
exports.ThreeStyleEditor = ThreeStyleEditor;

//# sourceMappingURL=three-style-editor.js.map
