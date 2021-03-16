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
exports.configure = void 0;
var aurelia_pal_1 = require("aurelia-pal");
function configure(config) {
    config.globalResources([
        aurelia_pal_1.PLATFORM.moduleName('./components/three'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-admin'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-cube-view'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-rule-editor'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-style-editor'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-object-list'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-object-property-explorer'),
        aurelia_pal_1.PLATFORM.moduleName('./components/three-object-property-list'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/checkers/checker-flow-dialog'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/admin-dialog-manual-rotate'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/admin-export-settings-dialog'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/admin-import-settings-dialog'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/three-admin-dialog-load-data-api'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/three-admin-dialog-save-data-api'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/three-checker-config-dialog'),
        aurelia_pal_1.PLATFORM.moduleName('./dialogs/three-checker-report-dialog'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-buttons'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-content'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-footer'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-header'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-section'),
        aurelia_pal_1.PLATFORM.moduleName('./components/sidebar/sidebar-section-header')
    ]);
}
exports.configure = configure;
__exportStar(require("./components/sidebar/sidebar-buttons"), exports);
__exportStar(require("./components/sidebar/sidebar-content"), exports);
__exportStar(require("./components/sidebar/sidebar-footer"), exports);
__exportStar(require("./components/sidebar/sidebar-header"), exports);
__exportStar(require("./components/sidebar/sidebar-section"), exports);
__exportStar(require("./components/sidebar/sidebar-section-header"), exports);
__exportStar(require("./components/three"), exports);
__exportStar(require("./components/three-admin"), exports);
__exportStar(require("./components/three-cube-view"), exports);
__exportStar(require("./components/three-object-list"), exports);
__exportStar(require("./components/three-object-property-explorer"), exports);
__exportStar(require("./components/three-object-property-list"), exports);
__exportStar(require("./components/three-rule-editor"), exports);
__exportStar(require("./components/three-style-editor"), exports);
__exportStar(require("./dialogs"), exports);
__exportStar(require("./helpers/three-generator"), exports);
__exportStar(require("./helpers/three-navigation"), exports);
__exportStar(require("./helpers/three-objects"), exports);
__exportStar(require("./helpers/three-points"), exports);
__exportStar(require("./helpers/three-utils"), exports);
__exportStar(require("./helpers/three-logger"), exports);
__exportStar(require("./models/checkers/checker-internals"), exports);
__exportStar(require("./models/checker-config.model"), exports);
__exportStar(require("./models/checker-report.model"), exports);
__exportStar(require("./models/geometry.model"), exports);
__exportStar(require("./models/material.model"), exports);
__exportStar(require("./models/object.model"), exports);
__exportStar(require("./models/site.model"), exports);
__exportStar(require("./models/style.model"), exports);
__exportStar(require("./models/theme.model"), exports);
__exportStar(require("./themes/three-alt-theme"), exports);
__exportStar(require("./themes/three-default-theme"), exports);
__exportStar(require("./themes/three-geometry"), exports);
__exportStar(require("./themes/three-icon"), exports);
__exportStar(require("./themes/three-style-definition"), exports);
__exportStar(require("./themes/three-styling-service"), exports);
__exportStar(require("./themes/three-theme"), exports);
__exportStar(require("./themes/three-theme-rule"), exports);
__exportStar(require("./tools/three-measure-tool"), exports);
__exportStar(require("./tools/three-rotation-tool"), exports);
__exportStar(require("./tools/three-selection-tool"), exports);
__exportStar(require("./tools/three-slice-tool"), exports);
__exportStar(require("./tools/three-tool"), exports);
__exportStar(require("./tools/three-tools-service"), exports);
__exportStar(require("./tools/three-translation-tool"), exports);

//# sourceMappingURL=index.js.map
