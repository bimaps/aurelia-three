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
exports.AdminImportSettingsDialog = void 0;
const style_model_1 = require("./../models/style.model");
const theme_model_1 = require("./../models/theme.model");
const checker_report_model_1 = require("./../models/checker-report.model");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_resources_1 = require("aurelia-resources");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const checker_internals_1 = require("../models/checkers/checker-internals");
const checker_internals_2 = require("../models/checkers/checker-internals");
const checker_internals_3 = require("../models/checkers/checker-internals");
const checker_internals_4 = require("../models/checkers/checker-internals");
const log = aurelia_logging_1.getLogger('admin-export-settings-dialog');
let AdminImportSettingsDialog = class AdminImportSettingsDialog {
    constructor(modalService) {
        this.modalService = modalService;
        this.name = '';
        this.importThemes = true;
        this.importStyles = true;
        this.importReports = true;
        this.importFlows = true;
        this.hasRequiredStyles = false;
        this.hasRequiredFlows = false;
        this.currentThemesNames = [];
        this.currentStylesNames = [];
        this.currentReportsNames = [];
        this.currentFlowsNames = [];
        this.themesIdsByName = {};
        this.stylesIdsByName = {};
        this.reportsIdsByName = {};
        this.flowsIdsByName = {};
        this.themes = [];
        this.styles = [];
        this.reports = [] = [];
        this.flows = [] = [];
        this.importing = false;
    }
    activate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.siteId) {
                this.siteId = params.siteId;
            }
            try {
                yield this.inputFile();
                yield this.parseDatas();
                this.processThemeImports();
                this.processReportImports();
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                throw error;
            }
        });
    }
    inputFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const input = document.createElement("input");
                input.type = 'file';
                document.body.appendChild(input);
                input.style.display = "none";
                input.onchange = (event) => __awaiter(this, void 0, void 0, function* () {
                    let reader = new FileReader();
                    reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                        let json = e.target.result;
                        try {
                            json = JSON.parse(json);
                        }
                        catch (error) {
                            aurelia_resources_1.errorify(new Error('The file must be a JSON'));
                            return;
                        }
                        try {
                            this.name = json.name || '';
                            this.themes = json.themes || [];
                            this.styles = json.styles || [];
                            this.reports = json.reports || [];
                            this.flows = json.flows || [];
                            resolve(null);
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                    reader.readAsText(event.target.files[0]);
                });
                input.onabort = (ev) => {
                    reject(new Error('Operation aborted'));
                };
                input.click();
            });
        });
    }
    parseDatas() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentThemes = yield theme_model_1.ThreeThemeModel.getAll(`?siteId=${this.siteId}`);
            const currentStyles = yield style_model_1.ThreeStyleModel.getAll(`?siteId=${this.siteId}`);
            const currentReports = yield checker_report_model_1.ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}`);
            const currentFlows = yield checker_internals_1.CheckerFlowModel.getAll(`?siteId=${this.siteId}`);
            this.currentThemesNames = currentThemes.map(t => t.name);
            this.currentStylesNames = currentStyles.map(t => t.name);
            this.currentReportsNames = currentReports.map(t => t.name);
            this.currentFlowsNames = currentFlows.map(t => t.name);
            this.themesIdsByName = {};
            currentThemes.reduce((idsByNames, i) => {
                idsByNames[i.name] = i.id;
                return idsByNames;
            }, this.themesIdsByName);
            this.stylesIdsByName = {};
            currentStyles.reduce((idsByNames, i) => {
                idsByNames[i.name] = i.id;
                return idsByNames;
            }, this.stylesIdsByName);
            this.reportsIdsByName = {};
            currentReports.reduce((idsByNames, i) => {
                idsByNames[i.name] = i.id;
                return idsByNames;
            }, this.reportsIdsByName);
            this.flowsIdsByName = {};
            currentFlows.reduce((idsByNames, i) => {
                idsByNames[i.name] = i.id;
                return idsByNames;
            }, this.flowsIdsByName);
            for (let theme of this.themes) {
                theme.alreadyExists = this.currentThemesNames.includes(theme.name);
                theme.id = this.themesIdsByName[theme.name];
                theme.import = !theme.alreadyExists;
            }
            for (let style of this.styles) {
                style.alreadyExists = this.currentStylesNames.includes(style.name);
                style.id = this.stylesIdsByName[style.name];
                style.import = !style.alreadyExists;
            }
            for (let report of this.reports) {
                report.alreadyExists = this.currentReportsNames.includes(report.name);
                report.id = this.reportsIdsByName[report.name];
                report.import = !report.alreadyExists;
            }
            for (let flow of this.flows) {
                flow.alreadyExists = this.currentFlowsNames.includes(flow.name);
                flow.id = this.flowsIdsByName[flow.name];
                flow.import = !flow.alreadyExists;
            }
        });
    }
    processThemeImports() {
        let requiredStyleIds = [];
        for (let theme of this.themes) {
            if (theme.import) {
                for (let rule of theme.rules || []) {
                    for (let style of rule.styles || []) {
                        if (!requiredStyleIds.includes(style) && !this.currentStylesNames.includes(style)) {
                            requiredStyleIds.push(style);
                        }
                    }
                }
            }
        }
        this.hasRequiredStyles = requiredStyleIds.length > 0;
        if (this.hasRequiredStyles) {
            this.importStyles = true;
        }
        for (let style of this.styles) {
            if (requiredStyleIds.includes(style.name)) {
                style.import = true;
                style.disabled = true;
            }
            else {
                style.disabled = false;
            }
        }
    }
    processReportImports() {
        let requiredFlowsIds = [];
        for (let report of this.reports) {
            if (report.import) {
                for (let flow of report.flows) {
                    if (!requiredFlowsIds.includes(flow) && !this.currentFlowsNames.includes(flow)) {
                        requiredFlowsIds.push(flow);
                    }
                }
            }
        }
        this.hasRequiredFlows = requiredFlowsIds.length > 0;
        if (this.hasRequiredFlows) {
            this.importFlows = true;
        }
        for (let flow of this.flows) {
            if (requiredFlowsIds.includes(flow.name)) {
                flow.import = true;
                flow.disabled = true;
            }
            else {
                flow.disabled = false;
            }
        }
    }
    canDeactivate(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.wasCancelled) {
                return true;
            }
            try {
                if (!this.importThemes && !this.importStyles && !this.importReports && !this.importFlows) {
                    throw new Error('Please select something to import. Otherwise you can cancel.');
                }
                this.import();
                result.output = true;
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                return false;
            }
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            this.importing = true;
            try {
                for (let style of this.styles) {
                    if (style.import) {
                        const newStyle = new style_model_1.ThreeStyleModel;
                        for (let key in style) {
                            newStyle[key] = style[key];
                        }
                        newStyle.siteId = this.siteId;
                        const newOrUpdatedStyle = newStyle.id
                            ? yield newStyle.updateProperties('', Object.keys(newStyle))
                            : yield newStyle.save('');
                        this.stylesIdsByName[newOrUpdatedStyle.name] = newOrUpdatedStyle.id;
                    }
                }
                for (let theme of this.themes) {
                    if (theme.import) {
                        const newTheme = new theme_model_1.ThreeThemeModel;
                        for (let key in theme) {
                            newTheme[key] = theme[key];
                        }
                        for (let rule of newTheme.rules) {
                            rule.styles = rule.styles.map(s => this.stylesIdsByName[s]);
                        }
                        newTheme.siteId = this.siteId;
                        const newOrUpdatedTheme = newTheme.id
                            ? yield newTheme.updateProperties('', Object.keys(newTheme))
                            : yield newTheme.save('');
                        this.themesIdsByName[newOrUpdatedTheme.name] = newOrUpdatedTheme.id;
                    }
                }
                for (let flow of this.flows) {
                    if (flow.import) {
                        const newFlow = new checker_internals_1.CheckerFlowModel;
                        for (let key in flow) {
                            newFlow[key] = flow[key];
                        }
                        newFlow.siteId = this.siteId;
                        newFlow.modulesIds = [];
                        const newOrUpdatedFlow = newFlow.id
                            ? yield newFlow.updateProperties('', Object.keys(newFlow))
                            : yield newFlow.save('');
                        this.flowsIdsByName[newOrUpdatedFlow.name] = newOrUpdatedFlow.id;
                        const modules = flow.modules;
                        newOrUpdatedFlow.modulesIds = [];
                        for (const mod of modules) {
                            let instance;
                            switch (mod.moduleType) {
                                case 'filter':
                                    instance = new checker_internals_2.CheckerModuleFilterModel();
                                    break;
                                case 'extract':
                                    instance = new checker_internals_2.CheckerModuleExtractModel();
                                    break;
                                case 'math':
                                    instance = new checker_internals_2.CheckerModuleMathModel();
                                    break;
                                case 'normal-distance':
                                    instance = new checker_internals_3.CheckerModuleNormalDistanceModel();
                                    break;
                                case 'distance':
                                    instance = new checker_internals_4.CheckerModuleDistanceModel();
                                    break;
                                case 'reducer':
                                    instance = new checker_internals_4.CheckerModuleReducerModel();
                                    break;
                                case 'projection':
                                    instance = new checker_internals_3.CheckerModuleProjectionModel();
                                    break;
                                case 'if':
                                    instance = new checker_internals_3.CheckerModuleIfModel();
                                    break;
                                case 'output':
                                    instance = new checker_internals_4.CheckerModuleOutputModel();
                                    break;
                            }
                            if (instance) {
                                instance.siteId = newFlow.siteId;
                                instance.flowId = newOrUpdatedFlow.id;
                                for (const key in mod) {
                                    instance[key] = mod[key];
                                }
                                const newModule = yield instance.save();
                                newOrUpdatedFlow.modulesIds.push(newModule.id);
                            }
                        }
                        newOrUpdatedFlow.updateProperties('', ['modulesIds']);
                    }
                }
                for (let report of this.reports) {
                    if (report.import) {
                        const newReport = new checker_report_model_1.ThreeCheckerReportModel;
                        for (let key in report) {
                            newReport[key] = report[key];
                        }
                        newReport.flows = newReport.flows.map(c => this.flowsIdsByName[c]);
                        newReport.siteId = this.siteId;
                        const newOrUpdatedReport = newReport.id
                            ? yield newReport.updateProperties('', Object.keys(newReport))
                            : yield newReport.save('');
                        this.reportsIdsByName[newOrUpdatedReport.name] = newOrUpdatedReport.id;
                    }
                }
                aurelia_resources_1.notify('Import successfully completed');
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                throw error;
            }
        });
    }
};
AdminImportSettingsDialog = __decorate([
    aurelia_framework_1.inject(modal_1.UxModalService),
    __metadata("design:paramtypes", [modal_1.UxModalService])
], AdminImportSettingsDialog);
exports.AdminImportSettingsDialog = AdminImportSettingsDialog;

//# sourceMappingURL=admin-import-settings-dialog.js.map
