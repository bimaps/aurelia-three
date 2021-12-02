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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminExportSettingsDialog = void 0;
const style_model_1 = require("./../models/style.model");
const theme_model_1 = require("./../models/theme.model");
const checker_report_model_1 = require("./../models/checker-report.model");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_resources_1 = require("aurelia-resources");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const file_saver_1 = require("file-saver");
const moment = require("moment");
const checker_internals_1 = require("../models/checkers/checker-internals");
const log = aurelia_logging_1.getLogger('admin-export-settings-dialog');
let AdminExportSettingsDialog = class AdminExportSettingsDialog {
    constructor(modalService) {
        this.modalService = modalService;
        this.name = '';
        this.exportThemes = false;
        this.exportStyles = false;
        this.exportReports = false;
        this.exportFlows = false;
        this.hasRequiredStyles = false;
        this.hasRequiredFlows = false;
        this.reports = [];
        this.flows = [];
    }
    activate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.siteId) {
                this.siteId = params.siteId;
            }
            try {
                yield this.loadDatas();
            }
            catch (error) {
                throw error;
            }
        });
    }
    loadDatas() {
        return __awaiter(this, void 0, void 0, function* () {
            this.themes = yield theme_model_1.ThreeThemeModel.getAll(`?siteId=${this.siteId}`);
            this.styles = yield style_model_1.ThreeStyleModel.getAll(`?siteId=${this.siteId}`);
            this.reports = yield checker_report_model_1.ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}`);
            this.flows = yield checker_internals_1.CheckerFlowModel.getAll(`?siteId=${this.siteId}`);
        });
    }
    canDeactivate(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.wasCancelled) {
                return true;
            }
            try {
                if (!this.name) {
                    throw new Error('You must give a name to your export');
                }
                if (!this.exportThemes && !this.exportStyles && !this.exportReports && !this.exportFlows) {
                    throw new Error('Please select something to export. Otherwise you can cancel.');
                }
                this.export();
                result.output = true;
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                return false;
            }
        });
    }
    processThemeExports() {
        let requiredStyleIds = [];
        for (let theme of this.themes) {
            if (theme.export) {
                for (let rule of theme.rules || []) {
                    for (let style of rule.styles || []) {
                        if (!requiredStyleIds.includes(style)) {
                            requiredStyleIds.push(style);
                        }
                    }
                }
            }
        }
        this.hasRequiredStyles = requiredStyleIds.length > 0;
        if (this.hasRequiredStyles) {
            this.exportStyles = true;
        }
        for (let style of this.styles) {
            if (requiredStyleIds.includes(style.id)) {
                style.export = true;
                style.disabled = true;
            }
            else {
                style.disabled = false;
            }
        }
    }
    processReportExports() {
        let requiredFlowsIds = [];
        for (let report of this.reports) {
            if (report.export) {
                for (let flowId of report.flows) {
                    if (!requiredFlowsIds.includes(flowId)) {
                        requiredFlowsIds.push(flowId);
                    }
                }
            }
        }
        this.hasRequiredFlows = requiredFlowsIds.length > 0;
        if (this.hasRequiredFlows) {
            this.exportFlows = true;
        }
        for (let flow of this.flows) {
            if (requiredFlowsIds.includes(flow.id)) {
                flow.export = true;
                flow.disabled = true;
            }
            else {
                flow.disabled = false;
            }
        }
    }
    export() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = {
                name: this.name,
                date: moment().format('DD/MM/YYYY HH:mm:ss')
            };
            const stylesNamesByIds = {};
            for (let style of this.styles) {
                stylesNamesByIds[style.id] = style.name;
            }
            const flowsNamesByIds = {};
            for (let flow of this.flows) {
                flowsNamesByIds[flow.id] = flow.name;
            }
            if (this.exportThemes) {
                json.themes = [];
                for (let theme of this.themes) {
                    if (theme.export) {
                        json.themes.push({
                            name: theme.name,
                            rules: theme.rules.map(r => {
                                r.styles = r.styles.map(styleId => stylesNamesByIds[styleId]);
                                return r;
                            })
                        });
                    }
                }
            }
            if (this.exportStyles) {
                json.styles = [];
                for (let style of this.styles) {
                    if (style.export) {
                        const keys = Object.keys(style).filter(key => key !== 'export' &&
                            key !== 'disabled' &&
                            key !== '_createdBy' &&
                            key !== '_createdAt' &&
                            key !== '_updatedBy' &&
                            key !== '_updatedAt' &&
                            key !== 'siteId' &&
                            key !== 'id');
                        const newStyle = {};
                        for (let key of keys) {
                            newStyle[key] = style[key];
                        }
                        json.styles.push(newStyle);
                    }
                }
            }
            if (this.exportReports) {
                json.reports = [];
                for (let report of this.reports) {
                    if (report.export) {
                        json.reports.push({
                            name: report.name,
                            description: report.description,
                            metadata: report.metadata,
                            flows: report.flows.map(flowId => flowsNamesByIds[flowId])
                        });
                    }
                }
            }
            if (this.exportFlows) {
                json.flows = [];
                for (let flow of this.flows) {
                    if (flow.export) {
                        const keys = Object.keys(flow).filter(key => key !== 'export' &&
                            key !== 'disabled' &&
                            key !== '_createdBy' &&
                            key !== '_createdAt' &&
                            key !== '_updatedBy' &&
                            key !== '_updatedAt' &&
                            key !== 'siteId' &&
                            key !== 'id');
                        const newFlow = {};
                        const modules = [];
                        for (const moduleId of flow.modulesIds) {
                            const mod = yield checker_internals_1.CheckerModuleBaseModel.getOne(flow.id, moduleId);
                            const moduleKeys = Object.keys(mod).filter(key => key !== 'export' &&
                                key !== 'disabled' &&
                                key !== '_createdBy' &&
                                key !== '_createdAt' &&
                                key !== '_updatedBy' &&
                                key !== '_updatedAt' &&
                                key !== 'siteId' &&
                                key !== 'id' &&
                                key !== 'allowedInputTypes' &&
                                key !== 'outputSummary');
                            const newModule = {};
                            for (let key of moduleKeys) {
                                newModule[key] = mod[key];
                            }
                            modules.push(newModule);
                        }
                        newFlow.modules = modules;
                        for (let key of keys) {
                            newFlow[key] = flow[key];
                        }
                        json.flows.push(newFlow);
                    }
                }
            }
            let fileContent = JSON.stringify(json, null, 2);
            let blob = new Blob([fileContent], { type: "application/json" });
            file_saver_1.default.saveAs(blob, `${this.name}.json`);
        });
    }
};
AdminExportSettingsDialog = __decorate([
    aurelia_framework_1.inject(modal_1.UxModalService),
    __metadata("design:paramtypes", [modal_1.UxModalService])
], AdminExportSettingsDialog);
exports.AdminExportSettingsDialog = AdminExportSettingsDialog;

//# sourceMappingURL=admin-export-settings-dialog.js.map
