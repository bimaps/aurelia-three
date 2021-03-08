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
import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService } from '@aurelia-ux/modal';
import { errorify } from 'aurelia-resources';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import FileSaver from 'file-saver';
import * as moment from 'moment';
import { CheckerFlowModel, CheckerModuleBaseModel } from '../models/checkers/checker-internals';
var log = getLogger('admin-export-settings-dialog');
var AdminExportSettingsDialog = (function () {
    function AdminExportSettingsDialog(modalService) {
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
    AdminExportSettingsDialog.prototype.activate = function (params) {
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
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.loadDatas()];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2];
                }
            });
        });
    };
    AdminExportSettingsDialog.prototype.loadDatas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        return [4, ThreeThemeModel.getAll("?siteId=" + this.siteId)];
                    case 1:
                        _a.themes = _e.sent();
                        _b = this;
                        return [4, ThreeStyleModel.getAll("?siteId=" + this.siteId)];
                    case 2:
                        _b.styles = _e.sent();
                        _c = this;
                        return [4, ThreeCheckerReportModel.getAll("?siteId=" + this.siteId)];
                    case 3:
                        _c.reports = _e.sent();
                        _d = this;
                        return [4, CheckerFlowModel.getAll("?siteId=" + this.siteId)];
                    case 4:
                        _d.flows = _e.sent();
                        return [2];
                }
            });
        });
    };
    AdminExportSettingsDialog.prototype.canDeactivate = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result.wasCancelled) {
                    return [2, true];
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
                    errorify(error);
                    return [2, false];
                }
                return [2];
            });
        });
    };
    AdminExportSettingsDialog.prototype.processThemeExports = function () {
        var requiredStyleIds = [];
        for (var _i = 0, _a = this.themes; _i < _a.length; _i++) {
            var theme = _a[_i];
            if (theme.export) {
                for (var _b = 0, _c = theme.rules || []; _b < _c.length; _b++) {
                    var rule = _c[_b];
                    for (var _d = 0, _e = rule.styles || []; _d < _e.length; _d++) {
                        var style = _e[_d];
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
        for (var _f = 0, _g = this.styles; _f < _g.length; _f++) {
            var style = _g[_f];
            if (requiredStyleIds.includes(style.id)) {
                style.export = true;
                style.disabled = true;
            }
            else {
                style.disabled = false;
            }
        }
    };
    AdminExportSettingsDialog.prototype.processReportExports = function () {
        var requiredFlowsIds = [];
        for (var _i = 0, _a = this.reports; _i < _a.length; _i++) {
            var report = _a[_i];
            if (report.export) {
                for (var _b = 0, _c = report.flows; _b < _c.length; _b++) {
                    var flowId = _c[_b];
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
        for (var _d = 0, _e = this.flows; _d < _e.length; _d++) {
            var flow = _e[_d];
            if (requiredFlowsIds.includes(flow.id)) {
                flow.export = true;
                flow.disabled = true;
            }
            else {
                flow.disabled = false;
            }
        }
    };
    AdminExportSettingsDialog.prototype.export = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, stylesNamesByIds, _i, _a, style, flowsNamesByIds, _b, _c, flow, _d, _e, theme, _f, _g, style, keys, newStyle, _h, keys_1, key, _j, _k, report, _l, _m, flow, keys, newFlow, modules, _o, _p, moduleId, mod, moduleKeys, newModule, _q, moduleKeys_1, key, _r, keys_2, key, fileContent, blob;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        json = {
                            name: this.name,
                            date: moment().format('DD/MM/YYYY HH:mm:ss')
                        };
                        stylesNamesByIds = {};
                        for (_i = 0, _a = this.styles; _i < _a.length; _i++) {
                            style = _a[_i];
                            stylesNamesByIds[style.id] = style.name;
                        }
                        flowsNamesByIds = {};
                        for (_b = 0, _c = this.flows; _b < _c.length; _b++) {
                            flow = _c[_b];
                            flowsNamesByIds[flow.id] = flow.name;
                        }
                        if (this.exportThemes) {
                            json.themes = [];
                            for (_d = 0, _e = this.themes; _d < _e.length; _d++) {
                                theme = _e[_d];
                                if (theme.export) {
                                    json.themes.push({
                                        name: theme.name,
                                        rules: theme.rules.map(function (r) {
                                            r.styles = r.styles.map(function (styleId) { return stylesNamesByIds[styleId]; });
                                            return r;
                                        })
                                    });
                                }
                            }
                        }
                        if (this.exportStyles) {
                            json.styles = [];
                            for (_f = 0, _g = this.styles; _f < _g.length; _f++) {
                                style = _g[_f];
                                if (style.export) {
                                    keys = Object.keys(style).filter(function (key) {
                                        return key !== 'export' &&
                                            key !== 'disabled' &&
                                            key !== '_createdBy' &&
                                            key !== '_createdAt' &&
                                            key !== '_updatedBy' &&
                                            key !== '_updatedAt' &&
                                            key !== 'siteId' &&
                                            key !== 'id';
                                    });
                                    newStyle = {};
                                    for (_h = 0, keys_1 = keys; _h < keys_1.length; _h++) {
                                        key = keys_1[_h];
                                        newStyle[key] = style[key];
                                    }
                                    json.styles.push(newStyle);
                                }
                            }
                        }
                        if (this.exportReports) {
                            json.reports = [];
                            for (_j = 0, _k = this.reports; _j < _k.length; _j++) {
                                report = _k[_j];
                                if (report.export) {
                                    json.reports.push({
                                        name: report.name,
                                        description: report.description,
                                        metadata: report.metadata,
                                        flows: report.flows.map(function (flowId) { return flowsNamesByIds[flowId]; })
                                    });
                                }
                            }
                        }
                        if (!this.exportFlows) return [3, 7];
                        json.flows = [];
                        _l = 0, _m = this.flows;
                        _s.label = 1;
                    case 1:
                        if (!(_l < _m.length)) return [3, 7];
                        flow = _m[_l];
                        if (!flow.export) return [3, 6];
                        keys = Object.keys(flow).filter(function (key) {
                            return key !== 'export' &&
                                key !== 'disabled' &&
                                key !== '_createdBy' &&
                                key !== '_createdAt' &&
                                key !== '_updatedBy' &&
                                key !== '_updatedAt' &&
                                key !== 'siteId' &&
                                key !== 'id';
                        });
                        newFlow = {};
                        modules = [];
                        _o = 0, _p = flow.modulesIds;
                        _s.label = 2;
                    case 2:
                        if (!(_o < _p.length)) return [3, 5];
                        moduleId = _p[_o];
                        return [4, CheckerModuleBaseModel.getOne(flow.id, moduleId)];
                    case 3:
                        mod = _s.sent();
                        moduleKeys = Object.keys(mod).filter(function (key) {
                            return key !== 'export' &&
                                key !== 'disabled' &&
                                key !== '_createdBy' &&
                                key !== '_createdAt' &&
                                key !== '_updatedBy' &&
                                key !== '_updatedAt' &&
                                key !== 'siteId' &&
                                key !== 'id' &&
                                key !== 'allowedInputTypes' &&
                                key !== 'outputSummary';
                        });
                        newModule = {};
                        for (_q = 0, moduleKeys_1 = moduleKeys; _q < moduleKeys_1.length; _q++) {
                            key = moduleKeys_1[_q];
                            newModule[key] = mod[key];
                        }
                        modules.push(newModule);
                        _s.label = 4;
                    case 4:
                        _o++;
                        return [3, 2];
                    case 5:
                        newFlow.modules = modules;
                        for (_r = 0, keys_2 = keys; _r < keys_2.length; _r++) {
                            key = keys_2[_r];
                            newFlow[key] = flow[key];
                        }
                        json.flows.push(newFlow);
                        _s.label = 6;
                    case 6:
                        _l++;
                        return [3, 1];
                    case 7:
                        fileContent = JSON.stringify(json, null, 2);
                        blob = new Blob([fileContent], { type: "application/json" });
                        FileSaver.saveAs(blob, this.name + ".json");
                        return [2];
                }
            });
        });
    };
    AdminExportSettingsDialog = __decorate([
        inject(UxModalService),
        __metadata("design:paramtypes", [UxModalService])
    ], AdminExportSettingsDialog);
    return AdminExportSettingsDialog;
}());
export { AdminExportSettingsDialog };

//# sourceMappingURL=admin-export-settings-dialog.js.map
