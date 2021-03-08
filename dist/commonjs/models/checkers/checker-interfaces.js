"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerModuleReducerOperationOptions = exports.CheckerModule = exports.CheckerExtractTypeOptions = exports.CheckerModuleIOStyleOptions = exports.CheckerModuleIOTypeOptions = exports.CheckerModuleTypeOptions = void 0;
exports.CheckerModuleTypeOptions = ['filter', 'extract', 'math', 'reducer', 'if', 'projection', 'distance', 'normal-distance', 'output'];
exports.CheckerModuleIOTypeOptions = ['scene', 'three-objects', 'three-object', 'triangles', 'triangle', 'line3s', 'line3', 'vector3s', 'vector3', 'vector2s', 'vector2', 'box3s', 'box3', 'strings', 'string', 'numbers', 'number', 'booleans', 'boolean', 'json'];
exports.CheckerModuleIOStyleOptions = ['default', 'correct', 'incorrect', 'danger'];
exports.CheckerExtractTypeOptions = ['faces', 'edges', 'vertices', 'wireframe', 'property'];
var CheckerModule = (function () {
    function CheckerModule() {
    }
    return CheckerModule;
}());
exports.CheckerModule = CheckerModule;
exports.CheckerModuleReducerOperationOptions = ['min', 'max', 'average', 'count', 'sum'];

//# sourceMappingURL=checker-interfaces.js.map
