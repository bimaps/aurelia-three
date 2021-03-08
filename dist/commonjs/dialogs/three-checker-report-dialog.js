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
exports.ThreeCheckerReportDialog = void 0;
var three_1 = require("./../components/three");
var checker_report_model_1 = require("./../models/checker-report.model");
var modal_1 = require("@aurelia-ux/modal");
var aurelia_resources_1 = require("aurelia-resources");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var log = aurelia_logging_1.getLogger('category-dialog');
var ThreeCheckerReportDialog = (function () {
    function ThreeCheckerReportDialog(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
        this.flows = [];
        this.includedFlows = [];
    }
    ThreeCheckerReportDialog.prototype.activate = function (params) {
        var _this = this;
        if (params.siteId) {
            this.siteId = params.siteId;
        }
        if (params.three && params.three instanceof three_1.ThreeCustomElement) {
            this.three = params.three;
        }
        if (params.flows && Array.isArray(params.flows)) {
            this.flows = params.flows;
        }
        if (params.report && params.report instanceof checker_report_model_1.ThreeCheckerReportModel) {
            this.report = params.report;
            this.siteId = this.report.siteId;
            this.mode = 'edit';
            this.includedFlows = this.flows.filter(function (i) { return _this.report.flows.includes(i.id); });
        }
        else {
            this.report = new checker_report_model_1.ThreeCheckerReportModel();
            this.report.siteId = this.siteId;
            this.mode = 'create';
        }
        console.log('end of activate', params, this);
    };
    ThreeCheckerReportDialog.prototype.canDeactivate = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm_1, confirmResult, validationResult, _i, _a, result_1, category, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (result.wasCancelled) {
                            return [2, true];
                        }
                        if (!(result.output === 'remove')) return [3, 3];
                        return [4, this.modalService.open({
                                viewModel: aurelia_resources_1.ConfirmDialog,
                                model: { title: 'Are you sure ?', text: "Remove the report " + this.report.name + " ?" }
                            })];
                    case 1:
                        confirm_1 = _b.sent();
                        return [4, confirm_1.whenClosed()];
                    case 2:
                        confirmResult = _b.sent();
                        if (!confirmResult.wasCancelled) {
                            this.remove();
                        }
                        return [2];
                    case 3: return [4, this.report.validationController.validate()];
                    case 4:
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
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4, this.save()];
                    case 6:
                        category = _b.sent();
                        result.output = category;
                        return [3, 8];
                    case 7:
                        error_1 = _b.sent();
                        aurelia_resources_1.errorify(error_1);
                        return [2, false];
                    case 8: return [2];
                }
            });
        });
    };
    ThreeCheckerReportDialog.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.report.flows = this.includedFlows.map(function (i) { return i.id; });
                        if (!(this.mode === 'create')) return [3, 2];
                        return [4, this.report.save()];
                    case 1:
                        report = _a.sent();
                        return [3, 4];
                    case 2: return [4, this.report.updateProperties('', Object.keys(this.report))];
                    case 3:
                        report = _a.sent();
                        _a.label = 4;
                    case 4: return [2, report];
                }
            });
        });
    };
    ThreeCheckerReportDialog.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode === 'edit')) return [3, 2];
                        return [4, this.report.remove()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    ThreeCheckerReportDialog.prototype.addFlow = function (flow) {
        this.includedFlows.push(flow);
    };
    ThreeCheckerReportDialog.prototype.removeFlow = function (index) {
        this.includedFlows.splice(index, 1);
    };
    Object.defineProperty(ThreeCheckerReportDialog.prototype, "availableFlows", {
        get: function () {
            var flows = [];
            for (var _i = 0, _a = this.flows; _i < _a.length; _i++) {
                var flow = _a[_i];
                if (!this.includedFlows.includes(flow)) {
                    flows.push(flow);
                }
            }
            return flows;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        aurelia_framework_1.computedFrom('flows', 'includedFlows.length'),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ThreeCheckerReportDialog.prototype, "availableFlows", null);
    ThreeCheckerReportDialog = __decorate([
        aurelia_framework_1.inject(modal_1.UxModalService),
        __metadata("design:paramtypes", [modal_1.UxModalService])
    ], ThreeCheckerReportDialog);
    return ThreeCheckerReportDialog;
}());
exports.ThreeCheckerReportDialog = ThreeCheckerReportDialog;

//# sourceMappingURL=three-checker-report-dialog.js.map
