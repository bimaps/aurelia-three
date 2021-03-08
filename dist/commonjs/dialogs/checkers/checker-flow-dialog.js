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
exports.CheckerFlowDialog = void 0;
var checker_report_model_1 = require("./../../models/checker-report.model");
var three_1 = require("./../../components/three");
var modal_1 = require("@aurelia-ux/modal");
var aurelia_resources_1 = require("aurelia-resources");
var aurelia_deco_1 = require("aurelia-deco");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var aurelia_resources_2 = require("aurelia-resources");
var checker_internals_1 = require("../../models/checkers/checker-internals");
var log = aurelia_logging_1.getLogger('checker-flow-dialog');
var CheckerFlowDialog = (function () {
    function CheckerFlowDialog(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
        this.keyValues = {};
        this.inputOptions = [];
        this.flowIsRunning = false;
    }
    CheckerFlowDialog.prototype.activate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var flow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.siteId) {
                            this.siteId = params.siteId;
                        }
                        if (params.three && params.three instanceof three_1.ThreeCustomElement) {
                            this.three = params.three;
                        }
                        if (!(params.flow && params.flow instanceof checker_internals_1.CheckerFlowModel)) return [3, 1];
                        this.flow = params.flow;
                        this.siteId = this.flow.siteId;
                        this.mode = 'edit';
                        return [3, 4];
                    case 1:
                        if (!params.flowId) return [3, 3];
                        return [4, checker_internals_1.CheckerFlowModel.getOneWithId(params.flowId)];
                    case 2:
                        flow = _a.sent();
                        if (!flow) {
                            throw new Error('Flow not found');
                        }
                        this.flow = flow;
                        this.siteId = flow.siteId;
                        this.mode = 'edit';
                        return [3, 4];
                    case 3:
                        this.flow = new checker_internals_1.CheckerFlowModel();
                        this.flow.siteId = this.siteId;
                        this.mode = 'create';
                        _a.label = 4;
                    case 4: return [4, this.fetchModules()];
                    case 5:
                        _a.sent();
                        return [4, this.fetchKeyValues()];
                    case 6:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.canDeactivate = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var reports, text, confirm_1, confirmResult, validationResult, _i, _a, result_1, flow, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (result.wasCancelled) {
                            return [2, true];
                        }
                        if (!(result.output === 'remove')) return [3, 4];
                        return [4, checker_report_model_1.ThreeCheckerReportModel.getAll("?siteId=" + this.siteId + "&flows=" + this.flow.id)];
                    case 1:
                        reports = _b.sent();
                        text = "Remove the flow " + this.flow.name + " ?";
                        if (reports.length) {
                            text += '<br><br>The flow will also be removed from the following reports: <ul>' + reports.map(function (r) { return "<li>" + r.name + "</li>"; }).join('') + '</ul>';
                        }
                        return [4, this.modalService.open({
                                viewModel: aurelia_resources_1.ConfirmDialog,
                                model: { title: 'Are you sure ?', text: text }
                            })];
                    case 2:
                        confirm_1 = _b.sent();
                        return [4, confirm_1.whenClosed()];
                    case 3:
                        confirmResult = _b.sent();
                        if (!confirmResult.wasCancelled) {
                            this.remove();
                        }
                        return [2];
                    case 4: return [4, this.flow.validationController.validate()];
                    case 5:
                        validationResult = _b.sent();
                        if (!validationResult.valid) {
                            for (_i = 0, _a = validationResult.results; _i < _a.length; _i++) {
                                result_1 = _a[_i];
                                if (!result_1.valid) {
                                    aurelia_resources_1.errorify(new Error(result_1.message));
                                }
                            }
                            return [2, false];
                        }
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4, this.saveFlow()];
                    case 7:
                        flow = _b.sent();
                        result.output = flow;
                        return [3, 9];
                    case 8:
                        error_1 = _b.sent();
                        aurelia_resources_1.errorify(error_1);
                        return [2, false];
                    case 9: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode === 'edit')) return [3, 2];
                        return [4, this.flow.remove()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.addModule = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, dialog, result, instance, module_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        options = [
                            { value: 'filter', label: 'Filter Module' },
                            { value: 'extract', label: 'Extract Module' },
                            { value: 'math', label: 'Math Module' },
                            { value: 'if', label: 'IF Module' },
                            { value: 'reducer', label: 'Reducer Module' },
                            { value: 'projection', label: 'Projection Module' },
                            { value: 'normal-distance', label: 'Normal Distance Module' },
                            { value: 'distance', label: 'Distance Module' },
                            { value: 'output', label: 'Output Module' },
                        ];
                        return [4, this.modalService.open({
                                viewModel: aurelia_resources_2.PromptSelectDialog,
                                model: {
                                    options: options,
                                    labelKey: 'label',
                                    valueKey: 'value',
                                    autoClose: true,
                                    required: true,
                                    title: 'Select your new module type'
                                }
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!!result.wasCancelled) return [3, 7];
                        instance = checker_internals_1.CheckerModuleBaseModel.create({ moduleType: result.output, siteId: this.flow.siteId });
                        if (!instance) return [3, 5];
                        instance.flowId = this.flow.id;
                        instance.inputVarName = 'scene';
                        instance.outputVarName = "Output#" + (this.flow.modulesIds.length + 1);
                        return [4, instance.save()];
                    case 3:
                        module_1 = _a.sent();
                        this.flow.modulesIds.push(module_1.id);
                        return [4, this.flow.updateProperties('', ['modulesIds'])];
                    case 4:
                        _a.sent();
                        console.log('modulesIds saved');
                        _a.label = 5;
                    case 5: return [4, this.fetchModules()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3, 9];
                    case 8:
                        error_2 = _a.sent();
                        aurelia_resources_1.errorify(error_2);
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.fetchModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules, _i, _a, moduleId, mod;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        modules = [];
                        _i = 0, _a = this.flow.modulesIds;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        moduleId = _a[_i];
                        return [4, checker_internals_1.CheckerModuleBaseModel.getOne(this.flow.id, moduleId)];
                    case 2:
                        mod = _b.sent();
                        modules.push(mod);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        this.modules = modules;
                        this.setInputOptions();
                        return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.fetchKeyValues = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, checker_internals_1.CheckerFlowModel.api.get("/three/site/" + this.flow.siteId + "/key-values")];
                    case 1:
                        response = _a.sent();
                        return [4, response.json()];
                    case 2:
                        json = _a.sent();
                        this.keyValues = json;
                        return [3, 4];
                    case 3:
                        error_3 = _a.sent();
                        aurelia_resources_1.errorify(error_3);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.setInputOptions = function () {
        var options = ['scene'];
        for (var _i = 0, _a = this.modules; _i < _a.length; _i++) {
            var mod = _a[_i];
            options.push(mod.outputVarName);
        }
        this.inputOptions = options;
    };
    CheckerFlowDialog.prototype.saveModule = function (mod) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedMod, _i, _a, mod_1, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        mod.flowId = this.flow.id;
                        return [4, mod.updateProperties('', Object.keys(mod), { updateInstanceWithResponse: false })];
                    case 1:
                        updatedMod = _b.sent();
                        _i = 0, _a = this.modules;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3, 5];
                        mod_1 = _a[_i];
                        if (!(mod_1.id === updatedMod.id)) return [3, 4];
                        return [4, mod_1.updateInstanceFromElement(updatedMod)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5:
                        this.setInputOptions();
                        return [3, 7];
                    case 6:
                        error_4 = _b.sent();
                        aurelia_resources_1.errorify(error_4);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode === 'create')) return [3, 2];
                        return [4, this.flow.save()];
                    case 1:
                        flow = _a.sent();
                        return [3, 4];
                    case 2: return [4, this.flow.updateProperties('', Object.keys(this.flow))];
                    case 3:
                        flow = _a.sent();
                        _a.label = 4;
                    case 4: return [2, flow];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.saveFlow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flow, _i, _a, mod, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        if (!(this.mode === 'create')) return [3, 2];
                        return [4, this.flow.save()];
                    case 1:
                        flow = _b.sent();
                        this.mode = 'edit';
                        this.flow = flow;
                        return [3, 4];
                    case 2: return [4, this.flow.updateProperties('', Object.keys(this.flow))];
                    case 3:
                        flow = _b.sent();
                        _b.label = 4;
                    case 4:
                        _i = 0, _a = this.modules;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3, 8];
                        mod = _a[_i];
                        return [4, this.saveModule(mod)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3, 5];
                    case 8: return [3, 10];
                    case 9:
                        error_5 = _b.sent();
                        aurelia_resources_1.errorify(error_5);
                        return [3, 10];
                    case 10: return [2, flow];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.removeModule = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var mod, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        mod = this.modules[index];
                        if (!mod) {
                            return [2];
                        }
                        if (!(this.flow.modulesIds[index] === mod.id)) return [3, 3];
                        this.flow.modulesIds.splice(index, 1);
                        mod.flowId = this.flow.id;
                        return [4, mod.remove()];
                    case 1:
                        _a.sent();
                        return [4, this.flow.updateProperties('', ['modulesIds'])];
                    case 2:
                        _a.sent();
                        this.fetchModules();
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        error_6 = _a.sent();
                        aurelia_resources_1.errorify(error_6);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.moduleOrderChanged = function (newOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.flow.modulesIds = newOrder.map(function (m) { return m.id; });
                        return [4, this.flow.updateProperties('', ['modulesIds'])];
                    case 1:
                        _a.sent();
                        this.fetchModules();
                        return [3, 3];
                    case 2:
                        error_7 = _a.sent();
                        aurelia_resources_1.errorify(error_7);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.testFlow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, index, summary, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.flowIsRunning) {
                            return [2];
                        }
                        this.flowIsRunning = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.flow.api.post("/three/checker/flow/" + this.flow.id + "/run").then(aurelia_deco_1.jsonify)];
                    case 2:
                        json = _a.sent();
                        console.log('json', json);
                        if (json.operation === 'completed') {
                            for (index = 0; index < json.outputs.length; index++) {
                                summary = json.outputs[index];
                                this.modules[index].outputSummary = summary;
                            }
                        }
                        return [3, 4];
                    case 3:
                        error_8 = _a.sent();
                        aurelia_resources_1.errorify(error_8);
                        return [3, 4];
                    case 4:
                        this.flowIsRunning = false;
                        return [2];
                }
            });
        });
    };
    CheckerFlowDialog.prototype.duplicate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var duplicatedFlow, newFlow, duplicatedModules, _i, _a, module_2, newModule, newModuleSaved;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        duplicatedFlow = new checker_internals_1.CheckerFlowModel;
                        return [4, duplicatedFlow.updateInstanceFromElement(this.flow)];
                    case 1:
                        _b.sent();
                        delete duplicatedFlow.id;
                        duplicatedFlow.modulesIds = [];
                        duplicatedFlow.name += ' (copy)';
                        return [4, duplicatedFlow.save()];
                    case 2:
                        newFlow = _b.sent();
                        duplicatedModules = [];
                        _i = 0, _a = this.modules;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3, 6];
                        module_2 = _a[_i];
                        newModule = checker_internals_1.CheckerModuleBaseModel.create(module_2);
                        newModule.flowId = newFlow.id;
                        delete newModule.id;
                        return [4, newModule.save()];
                    case 4:
                        newModuleSaved = _b.sent();
                        duplicatedModules.push(newModuleSaved);
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6:
                        newFlow.modulesIds = duplicatedModules.map(function (m) { return m.id; });
                        return [4, newFlow.updateProperties('', ['modulesIds'])];
                    case 7:
                        _b.sent();
                        return [4, this.activate({
                                siteId: this.siteId,
                                three: this.three,
                                flowId: newFlow.id,
                            })];
                    case 8:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    CheckerFlowDialog = __decorate([
        aurelia_framework_1.inject(modal_1.UxModalService),
        __metadata("design:paramtypes", [modal_1.UxModalService])
    ], CheckerFlowDialog);
    return CheckerFlowDialog;
}());
exports.CheckerFlowDialog = CheckerFlowDialog;

//# sourceMappingURL=checker-flow-dialog.js.map
