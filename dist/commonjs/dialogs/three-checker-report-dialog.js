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
exports.ThreeCheckerReportDialog = void 0;
const three_1 = require("./../components/three");
const checker_report_model_1 = require("./../models/checker-report.model");
const modal_1 = require("@aurelia-ux/modal");
const aurelia_resources_1 = require("aurelia-resources");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const log = aurelia_logging_1.getLogger('category-dialog');
let ThreeCheckerReportDialog = class ThreeCheckerReportDialog {
    constructor(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
        this.flows = [];
        this.includedFlows = [];
    }
    activate(params) {
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
            this.includedFlows = this.flows.filter(i => this.report.flows.includes(i.id));
        }
        else {
            this.report = new checker_report_model_1.ThreeCheckerReportModel();
            this.report.siteId = this.siteId;
            this.mode = 'create';
        }
        console.log('end of activate', params, this);
    }
    canDeactivate(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.wasCancelled) {
                return true;
            }
            if (result.output === 'remove') {
                const confirm = yield this.modalService.open({
                    viewModel: aurelia_resources_1.ConfirmDialog,
                    model: { title: 'Are you sure ?', text: `Remove the report ${this.report.name} ?` }
                });
                const confirmResult = yield confirm.whenClosed();
                if (!confirmResult.wasCancelled) {
                    this.remove();
                }
                return;
            }
            const validationResult = yield this.report.validationController.validate();
            if (!validationResult.valid) {
                for (let result of validationResult.results) {
                    if (!result.valid) {
                        aurelia_resources_1.errorify(new Error(result.message));
                    }
                }
                return false;
            }
            try {
                const category = yield this.save();
                result.output = category;
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
                return false;
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let report;
            this.report.flows = this.includedFlows.map(i => i.id);
            if (this.mode === 'create') {
                report = yield this.report.save();
            }
            else {
                report = yield this.report.updateProperties('', Object.keys(this.report));
            }
            return report;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode === 'edit') {
                yield this.report.remove();
            }
        });
    }
    addFlow(flow) {
        this.includedFlows.push(flow);
    }
    removeFlow(index) {
        this.includedFlows.splice(index, 1);
    }
    get availableFlows() {
        const flows = [];
        for (let flow of this.flows) {
            if (!this.includedFlows.includes(flow)) {
                flows.push(flow);
            }
        }
        return flows;
    }
};
__decorate([
    aurelia_framework_1.computedFrom('flows', 'includedFlows.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeCheckerReportDialog.prototype, "availableFlows", null);
ThreeCheckerReportDialog = __decorate([
    aurelia_framework_1.inject(modal_1.UxModalService),
    __metadata("design:paramtypes", [modal_1.UxModalService])
], ThreeCheckerReportDialog);
exports.ThreeCheckerReportDialog = ThreeCheckerReportDialog;

//# sourceMappingURL=three-checker-report-dialog.js.map
