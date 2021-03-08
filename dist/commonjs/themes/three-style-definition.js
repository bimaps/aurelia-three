"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeStyleDefinition = void 0;
var ThreeStyleDefinition = (function () {
    function ThreeStyleDefinition() {
    }
    ThreeStyleDefinition.prototype.clone = function () {
        var clone = new ThreeStyleDefinition();
        clone.setWithProperties(this);
        return clone;
    };
    ThreeStyleDefinition.prototype.setWithProperties = function (definition) {
        for (var key in this) {
            if (typeof key !== 'string')
                continue;
            if (definition[key] !== undefined)
                this[key] = definition[key];
        }
    };
    ThreeStyleDefinition.prototype.augment = function (definition) {
        var entryDefinition = Object.assign({}, definition);
        entryDefinition.displayLabel = entryDefinition.displayLabel ? true : undefined;
        entryDefinition.icon = entryDefinition.icon ? true : undefined;
        entryDefinition.replaceGeometry = entryDefinition.replaceGeometry ? true : undefined;
        for (var key in entryDefinition) {
            if (entryDefinition.display === undefined && (key === 'material' || key === 'geometry' || key === 'color' || key === 'opacity' || key === 'renderOrder' || key === 'image')) {
                entryDefinition[key] = undefined;
            }
            if (entryDefinition.displayLabel === undefined && key.substr(0, 5) === 'label') {
                entryDefinition[key] = undefined;
            }
            if (entryDefinition.icon === undefined && key.substr(0, 5) === 'icon') {
                entryDefinition[key] = undefined;
            }
            if (entryDefinition.replaceGeometry === undefined && key.substr(0, 8) === 'geometry') {
                entryDefinition[key] = undefined;
            }
            if (entryDefinition.edgesDisplay === undefined && key.substr(0, 5) === 'edges') {
                entryDefinition[key] = undefined;
            }
        }
        for (var key in entryDefinition) {
            if (typeof key !== 'string')
                continue;
            if (entryDefinition[key] !== undefined)
                this[key] = entryDefinition[key];
        }
    };
    ThreeStyleDefinition.prototype.clear = function () {
        this.setWithProperties(new ThreeStyleDefinition);
    };
    return ThreeStyleDefinition;
}());
exports.ThreeStyleDefinition = ThreeStyleDefinition;

//# sourceMappingURL=three-style-definition.js.map
