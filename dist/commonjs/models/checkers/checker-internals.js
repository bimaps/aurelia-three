"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelsByType = void 0;
__exportStar(require("./checker-interfaces"), exports);
__exportStar(require("./checker-module-base.model"), exports);
__exportStar(require("./checker-module-filter.model"), exports);
__exportStar(require("./checker-module-extract.model"), exports);
__exportStar(require("./checker-module-math.model"), exports);
__exportStar(require("./checker-module-reducer.model"), exports);
__exportStar(require("./checker-module-if.model"), exports);
__exportStar(require("./checker-module-projection.model"), exports);
__exportStar(require("./checker-module-distance.model"), exports);
__exportStar(require("./checker-module-normal-distance.model"), exports);
__exportStar(require("./checker-module-output.model"), exports);
__exportStar(require("./checker-flow.model"), exports);
var checker_module_filter_model_1 = require("./checker-module-filter.model");
var checker_module_extract_model_1 = require("./checker-module-extract.model");
var checker_module_math_model_1 = require("./checker-module-math.model");
var checker_module_reducer_model_1 = require("./checker-module-reducer.model");
var checker_module_if_model_1 = require("./checker-module-if.model");
var checker_module_projection_model_1 = require("./checker-module-projection.model");
var checker_module_distance_model_1 = require("./checker-module-distance.model");
var checker_module_normal_distance_model_1 = require("./checker-module-normal-distance.model");
var checker_module_output_model_1 = require("./checker-module-output.model");
exports.modelsByType = {
    filter: checker_module_filter_model_1.CheckerModuleFilterModel,
    extract: checker_module_extract_model_1.CheckerModuleExtractModel,
    math: checker_module_math_model_1.CheckerModuleMathModel,
    reducer: checker_module_reducer_model_1.CheckerModuleReducerModel,
    if: checker_module_if_model_1.CheckerModuleIfModel,
    projection: checker_module_projection_model_1.CheckerModuleProjectionModel,
    distance: checker_module_distance_model_1.CheckerModuleDistanceModel,
    "normal-distance": checker_module_normal_distance_model_1.CheckerModuleNormalDistanceModel,
    output: checker_module_output_model_1.CheckerModuleOutputModel,
};

//# sourceMappingURL=checker-internals.js.map
