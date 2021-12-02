import {FrameworkConfiguration} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./components/three'),
    PLATFORM.moduleName('./components/three-admin'),
    PLATFORM.moduleName('./components/three-cube-view'),
    PLATFORM.moduleName('./components/three-rule-editor'),
    PLATFORM.moduleName('./components/three-style-editor'),
    PLATFORM.moduleName('./components/three-object-list'),
    PLATFORM.moduleName('./components/three-object-property-explorer'),
    PLATFORM.moduleName('./components/three-object-property-list'),

    PLATFORM.moduleName('./dialogs/checkers/checker-flow-dialog'),
    PLATFORM.moduleName('./dialogs/admin-dialog-manual-rotate'),
    PLATFORM.moduleName('./dialogs/admin-export-settings-dialog'),
    PLATFORM.moduleName('./dialogs/admin-import-settings-dialog'),
    PLATFORM.moduleName('./dialogs/three-admin-dialog-load-data-api'),
    PLATFORM.moduleName('./dialogs/three-admin-dialog-save-data-api'),
    PLATFORM.moduleName('./dialogs/three-checker-config-dialog'),
    PLATFORM.moduleName('./dialogs/three-checker-report-dialog'),

    PLATFORM.moduleName('./components/sidebar/sidebar-buttons'),
    PLATFORM.moduleName('./components/sidebar/sidebar-content'),
    PLATFORM.moduleName('./components/sidebar/sidebar-footer'),
    PLATFORM.moduleName('./components/sidebar/sidebar-header'),
    PLATFORM.moduleName('./components/sidebar/sidebar-section'),
    PLATFORM.moduleName('./components/sidebar/sidebar-section-header')

  ]);
}


export * from './components/sidebar/sidebar-buttons';
export * from './components/sidebar/sidebar-content';
export * from './components/sidebar/sidebar-footer';
export * from './components/sidebar/sidebar-header';
export * from './components/sidebar/sidebar-section';
export * from './components/sidebar/sidebar-section-header';
export * from './components/three';
export * from './components/three-admin';
export * from './components/three-cube-view';
export * from './components/three-object-list';
export * from './components/three-object-property-explorer';
export * from './components/three-object-property-list';
export * from './components/three-rule-editor';
export * from './components/three-style-editor';

export * from './dialogs';

export * from './helpers/three-generator';
export * from './helpers/three-navigation';
export * from './helpers/three-objects';
export * from './helpers/three-points';
export * from './helpers/three-utils';
export * from './helpers/three-logger';

export * from './models/checkers/checker-internals';
export * from './models/checker-config.model';
export * from './models/checker-report.model';
export * from './models/geometry.model';
export * from './models/material.model';
export * from './models/object.model';
export * from './models/site.model';
export * from './models/style.model';
export * from './models/theme.model';

export * from './themes/three-alt-theme';
export * from './themes/three-default-theme';
export * from './themes/three-geometry';
export * from './themes/three-icon';
export * from './themes/three-style-definition';
export * from './themes/three-styling-service';
export * from './themes/three-theme';
export * from './themes/three-theme-rule';

export * from './tools/three-measure-tool';
export * from './tools/three-rotation-tool';
export * from './tools/three-selection-tool';
export * from './tools/three-tool';
export * from './tools/three-tools-service';
export * from './tools/three-translation-tool';
