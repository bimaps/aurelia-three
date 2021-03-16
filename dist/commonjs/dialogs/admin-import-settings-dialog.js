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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminImportSettingsDialog = void 0;
var style_model_1 = require("./../models/style.model");
var theme_model_1 = require("./../models/theme.model");
var checker_report_model_1 = require("./../models/checker-report.model");
var modal_1 = require("@aurelia-ux/modal");
var aurelia_resources_1 = require("aurelia-resources");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var checker_internals_1 = require("../models/checkers/checker-internals");
var checker_internals_2 = require("../models/checkers/checker-internals");
var checker_internals_3 = require("../models/checkers/checker-internals");
var checker_internals_4 = require("../models/checkers/checker-internals");
var log = aurelia_logging_1.getLogger('admin-export-settings-dialog');
var AdminImportSettingsDialog = (function () {
    function AdminImportSettingsDialog(modalService) {
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
        this.reports = [];
        this.flows = [];
        this.importing = false;
    }
    AdminImportSettingsDialog.prototype.activate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.siteId) {
                            this.siteId = params.siteId;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.inputFile()];
                    case 2:
                        _a.sent();
                        return [4, this.parseDatas()];
                    case 3:
                        _a.sent();
                        this.processThemeImports();
                        this.processReportImports();
                        return [3, 5];
                    case 4:
                        error_1 = _a.sent();
                        aurelia_resources_1.errorify(error_1);
                        throw error_1;
                    case 5: return [2];
                }
            });
        });
    };
    AdminImportSettingsDialog.prototype.inputFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var input = document.createElement("input");
                        input.type = 'file';
                        document.body.appendChild(input);
                        input.style.display = "none";
                        input.onchange = function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var reader;
                            var _this = this;
                            return __generator(this, function (_a) {
                                reader = new FileReader();
                                reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                                    var json;
                                    return __generator(this, function (_a) {
                                        json = e.target.result;
                                        try {
                                            json = JSON.parse(json);
                                        }
                                        catch (error) {
                                            aurelia_resources_1.errorify(new Error('The file must be a JSON'));
                                            return [2];
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
                                        return [2];
                                    });
                                }); };
                                reader.readAsText(event.target.files[0]);
                                return [2];
                            });
                        }); };
                        input.onabort = function (ev) {
                            reject(new Error('Operation aborted'));
                        };
                        input.click();
                    })];
            });
        });
    };
    AdminImportSettingsDialog.prototype.parseDatas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentThemes, currentStyles, currentReports, currentFlows, _i, _a, theme, _b, _c, style, _d, _e, report, _f, _g, flow;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4, theme_model_1.ThreeThemeModel.getAll("?siteId=" + this.siteId)];
                    case 1:
                        currentThemes = _h.sent();
                        return [4, style_model_1.ThreeStyleModel.getAll("?siteId=" + this.siteId)];
                    case 2:
                        currentStyles = _h.sent();
                        return [4, checker_report_model_1.ThreeCheckerReportModel.getAll("?siteId=" + this.siteId)];
                    case 3:
                        currentReports = _h.sent();
                        return [4, checker_internals_1.CheckerFlowModel.getAll("?siteId=" + this.siteId)];
                    case 4:
                        currentFlows = _h.sent();
                        this.currentThemesNames = currentThemes.map(function (t) { return t.name; });
                        this.currentStylesNames = currentStyles.map(function (t) { return t.name; });
                        this.currentReportsNames = currentReports.map(function (t) { return t.name; });
                        this.currentFlowsNames = currentFlows.map(function (t) { return t.name; });
                        this.themesIdsByName = {};
                        currentThemes.reduce(function (idsByNames, i) {
                            idsByNames[i.name] = i.id;
                            return idsByNames;
                        }, this.themesIdsByName);
                        this.stylesIdsByName = {};
                        currentStyles.reduce(function (idsByNames, i) {
                            idsByNames[i.name] = i.id;
                            return idsByNames;
                        }, this.stylesIdsByName);
                        this.reportsIdsByName = {};
                        currentReports.reduce(function (idsByNames, i) {
                            idsByNames[i.name] = i.id;
                            return idsByNames;
                        }, this.reportsIdsByName);
                        this.flowsIdsByName = {};
                        currentFlows.reduce(function (idsByNames, i) {
                            idsByNames[i.name] = i.id;
                            return idsByNames;
                        }, this.flowsIdsByName);
                        for (_i = 0, _a = this.themes; _i < _a.length; _i++) {
                            theme = _a[_i];
                            theme.alreadyExists = this.currentThemesNames.includes(theme.name);
                            theme.id = this.themesIdsByName[theme.name];
                            theme.import = !theme.alreadyExists;
                        }
                        for (_b = 0, _c = this.styles; _b < _c.length; _b++) {
                            style = _c[_b];
                            style.alreadyExists = this.currentStylesNames.includes(style.name);
                            style.id = this.stylesIdsByName[style.name];
                            style.import = !style.alreadyExists;
                        }
                        for (_d = 0, _e = this.reports; _d < _e.length; _d++) {
                            report = _e[_d];
                            report.alreadyExists = this.currentReportsNames.includes(report.name);
                            report.id = this.reportsIdsByName[report.name];
                            report.import = !report.alreadyExists;
                        }
                        for (_f = 0, _g = this.flows; _f < _g.length; _f++) {
                            flow = _g[_f];
                            flow.alreadyExists = this.currentFlowsNames.includes(flow.name);
                            flow.id = this.flowsIdsByName[flow.name];
                            flow.import = !flow.alreadyExists;
                        }
                        return [2];
                }
            });
        });
    };
    AdminImportSettingsDialog.prototype.processThemeImports = function () {
        var requiredStyleIds = [];
        for (var _i = 0, _a = this.themes; _i < _a.length; _i++) {
            var theme = _a[_i];
            if (theme.import) {
                for (var _b = 0, _c = theme.rules || []; _b < _c.length; _b++) {
                    var rule = _c[_b];
                    for (var _d = 0, _e = rule.styles || []; _d < _e.length; _d++) {
                        var style = _e[_d];
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
        for (var _f = 0, _g = this.styles; _f < _g.length; _f++) {
            var style = _g[_f];
            if (requiredStyleIds.includes(style.name)) {
                style.import = true;
                style.disabled = true;
            }
            else {
                style.disabled = false;
            }
        }
    };
    AdminImportSettingsDialog.prototype.processReportImports = function () {
        var requiredFlowsIds = [];
        for (var _i = 0, _a = this.reports; _i < _a.length; _i++) {
            var report = _a[_i];
            if (report.import) {
                for (var _b = 0, _c = report.flows; _b < _c.length; _b++) {
                    var flow = _c[_b];
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
        for (var _d = 0, _e = this.flows; _d < _e.length; _d++) {
            var flow = _e[_d];
            if (requiredFlowsIds.includes(flow.name)) {
                flow.import = true;
                flow.disabled = true;
            }
            else {
                flow.disabled = false;
            }
        }
    };
    AdminImportSettingsDialog.prototype.canDeactivate = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result.wasCancelled) {
                    return [2, true];
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
                    return [2, false];
                }
                return [2];
            });
        });
    };
    AdminImportSettingsDialog.prototype.import = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, style, newStyle, key, newOrUpdatedStyle, _b, _c, _d, theme, newTheme, key, _e, _f, rule, newOrUpdatedTheme, _g, _h, _j, flow, newFlow, key, newOrUpdatedFlow, _k, modules, _l, modules_1, mod, instance, key, newModule, _m, _o, report, newReport, key, newOrUpdatedReport, _p, error_2;
            var _this = this;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        this.importing = true;
                        _q.label = 1;
                    case 1:
                        _q.trys.push([1, 34, , 35]);
                        _i = 0, _a = this.styles;
                        _q.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3, 8];
                        style = _a[_i];
                        if (!style.import) return [3, 7];
                        newStyle = new style_model_1.ThreeStyleModel;
                        for (key in style) {
                            newStyle[key] = style[key];
                        }
                        newStyle.siteId = this.siteId;
                        if (!newStyle.id) return [3, 4];
                        return [4, newStyle.updateProperties('', Object.keys(newStyle))];
                    case 3:
                        _b = _q.sent();
                        return [3, 6];
                    case 4: return [4, newStyle.save('')];
                    case 5:
                        _b = _q.sent();
                        _q.label = 6;
                    case 6:
                        newOrUpdatedStyle = _b;
                        this.stylesIdsByName[newOrUpdatedStyle.name] = newOrUpdatedStyle.id;
                        _q.label = 7;
                    case 7:
                        _i++;
                        return [3, 2];
                    case 8:
                        _c = 0, _d = this.themes;
                        _q.label = 9;
                    case 9:
                        if (!(_c < _d.length)) return [3, 15];
                        theme = _d[_c];
                        if (!theme.import) return [3, 14];
                        newTheme = new theme_model_1.ThreeThemeModel;
                        for (key in theme) {
                            newTheme[key] = theme[key];
                        }
                        for (_e = 0, _f = newTheme.rules; _e < _f.length; _e++) {
                            rule = _f[_e];
                            rule.styles = rule.styles.map(function (s) { return _this.stylesIdsByName[s]; });
                        }
                        newTheme.siteId = this.siteId;
                        if (!newTheme.id) return [3, 11];
                        return [4, newTheme.updateProperties('', Object.keys(newTheme))];
                    case 10:
                        _g = _q.sent();
                        return [3, 13];
                    case 11: return [4, newTheme.save('')];
                    case 12:
                        _g = _q.sent();
                        _q.label = 13;
                    case 13:
                        newOrUpdatedTheme = _g;
                        this.themesIdsByName[newOrUpdatedTheme.name] = newOrUpdatedTheme.id;
                        _q.label = 14;
                    case 14:
                        _c++;
                        return [3, 9];
                    case 15:
                        _h = 0, _j = this.flows;
                        _q.label = 16;
                    case 16:
                        if (!(_h < _j.length)) return [3, 26];
                        flow = _j[_h];
                        if (!flow.import) return [3, 25];
                        newFlow = new checker_internals_1.CheckerFlowModel;
                        for (key in flow) {
                            newFlow[key] = flow[key];
                        }
                        newFlow.siteId = this.siteId;
                        newFlow.modulesIds = [];
                        if (!newFlow.id) return [3, 18];
                        return [4, newFlow.updateProperties('', Object.keys(newFlow))];
                    case 17:
                        _k = _q.sent();
                        return [3, 20];
                    case 18: return [4, newFlow.save('')];
                    case 19:
                        _k = _q.sent();
                        _q.label = 20;
                    case 20:
                        newOrUpdatedFlow = _k;
                        this.flowsIdsByName[newOrUpdatedFlow.name] = newOrUpdatedFlow.id;
                        modules = flow.modules;
                        newOrUpdatedFlow.modulesIds = [];
                        _l = 0, modules_1 = modules;
                        _q.label = 21;
                    case 21:
                        if (!(_l < modules_1.length)) return [3, 24];
                        mod = modules_1[_l];
                        instance = void 0;
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
                        if (!instance) return [3, 23];
                        instance.siteId = newFlow.siteId;
                        instance.flowId = newOrUpdatedFlow.id;
                        for (key in mod) {
                            instance[key] = mod[key];
                        }
                        return [4, instance.save()];
                    case 22:
                        newModule = _q.sent();
                        newOrUpdatedFlow.modulesIds.push(newModule.id);
                        _q.label = 23;
                    case 23:
                        _l++;
                        return [3, 21];
                    case 24:
                        newOrUpdatedFlow.updateProperties('', ['modulesIds']);
                        _q.label = 25;
                    case 25:
                        _h++;
                        return [3, 16];
                    case 26:
                        _m = 0, _o = this.reports;
                        _q.label = 27;
                    case 27:
                        if (!(_m < _o.length)) return [3, 33];
                        report = _o[_m];
                        if (!report.import) return [3, 32];
                        newReport = new checker_report_model_1.ThreeCheckerReportModel;
                        for (key in report) {
                            newReport[key] = report[key];
                        }
                        newReport.flows = newReport.flows.map(function (c) { return _this.flowsIdsByName[c]; });
                        newReport.siteId = this.siteId;
                        if (!newReport.id) return [3, 29];
                        return [4, newReport.updateProperties('', Object.keys(newReport))];
                    case 28:
                        _p = _q.sent();
                        return [3, 31];
                    case 29: return [4, newReport.save('')];
                    case 30:
                        _p = _q.sent();
                        _q.label = 31;
                    case 31:
                        newOrUpdatedReport = _p;
                        this.reportsIdsByName[newOrUpdatedReport.name] = newOrUpdatedReport.id;
                        _q.label = 32;
                    case 32:
                        _m++;
                        return [3, 27];
                    case 33:
                        aurelia_resources_1.notify('Import successfully completed');
                        return [3, 35];
                    case 34:
                        error_2 = _q.sent();
                        aurelia_resources_1.errorify(error_2);
                        throw error_2;
                    case 35: return [2];
                }
            });
        });
    };
    AdminImportSettingsDialog = __decorate([
        aurelia_framework_1.inject(modal_1.UxModalService),
        __metadata("design:paramtypes", [modal_1.UxModalService])
    ], AdminImportSettingsDialog);
    return AdminImportSettingsDialog;
}());
exports.AdminImportSettingsDialog = AdminImportSettingsDialog;

//# sourceMappingURL=admin-import-settings-dialog.js.map
