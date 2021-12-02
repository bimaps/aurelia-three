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
import { ThreeCheckerReportModel } from './../../models/checker-report.model';
import { ThreeCustomElement } from './../../components/three';
import { UxModalService } from '@aurelia-ux/modal';
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { jsonify } from 'aurelia-deco';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerFlowModel, CheckerModuleBaseModel } from '../../models/checkers/checker-internals';
const log = getLogger('checker-flow-dialog');
let CheckerFlowDialog = class CheckerFlowDialog {
    constructor(modalService) {
        this.modalService = modalService;
        this.mode = 'create';
        this.keyValues = {};
        this.inputOptions = [];
        this.flowIsRunning = false;
    }
    activate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.siteId) {
                this.siteId = params.siteId;
            }
            if (params.three && params.three instanceof ThreeCustomElement) {
                this.three = params.three;
            }
            if (params.flow && params.flow instanceof CheckerFlowModel) {
                this.flow = params.flow;
                this.siteId = this.flow.siteId;
                this.mode = 'edit';
            }
            else if (params.flowId) {
                const flow = yield CheckerFlowModel.getOneWithId(params.flowId);
                if (!flow) {
                    throw new Error('Flow not found');
                }
                this.flow = flow;
                this.siteId = flow.siteId;
                this.mode = 'edit';
            }
            else {
                this.flow = new CheckerFlowModel();
                this.flow.siteId = this.siteId;
                this.mode = 'create';
            }
            yield this.fetchModules();
            yield this.fetchKeyValues();
        });
    }
    canDeactivate(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.wasCancelled) {
                return true;
            }
            if (result.output === 'remove') {
                const reports = yield ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}&flows=${this.flow.id}`);
                let text = `Remove the flow ${this.flow.name} ?`;
                if (reports.length) {
                    text += '<br><br>The flow will also be removed from the following reports: <ul>' + reports.map(r => `<li>${r.name}</li>`).join('') + '</ul>';
                }
                const confirm = yield this.modalService.open({
                    viewModel: ConfirmDialog,
                    model: { title: 'Are you sure ?', text }
                });
                const confirmResult = yield confirm.whenClosed();
                if (!confirmResult.wasCancelled) {
                    this.remove();
                }
                return;
            }
            const validationResult = yield this.flow.validationController.validate();
            if (!validationResult.valid) {
                for (let result of validationResult.results) {
                    if (!result.valid) {
                        errorify(new Error(result.message));
                    }
                }
                return false;
            }
            try {
                const flow = yield this.saveFlow();
                result.output = flow;
            }
            catch (error) {
                errorify(error);
                return false;
            }
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode === 'edit') {
                yield this.flow.remove();
            }
        });
    }
    addModule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = [
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
                const dialog = yield this.modalService.open({
                    viewModel: PromptSelectDialog,
                    model: {
                        options,
                        labelKey: 'label',
                        valueKey: 'value',
                        autoClose: true,
                        required: true,
                        title: 'Select your new module type'
                    }
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    const instance = CheckerModuleBaseModel.create({ moduleType: result.output, siteId: this.flow.siteId });
                    if (instance) {
                        instance.flowId = this.flow.id;
                        instance.inputVarName = 'scene';
                        instance.outputVarName = `Output#${this.flow.modulesIds.length + 1}`;
                        const module = yield instance.save();
                        this.flow.modulesIds.push(module.id);
                        yield this.flow.updateProperties('', ['modulesIds']);
                        console.log('modulesIds saved');
                    }
                    yield this.fetchModules();
                }
            }
            catch (error) {
                errorify(error);
            }
        });
    }
    fetchModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = [];
            for (const moduleId of this.flow.modulesIds) {
                const mod = yield CheckerModuleBaseModel.getOne(this.flow.id, moduleId);
                modules.push(mod);
            }
            this.modules = modules;
            this.setInputOptions();
        });
    }
    fetchKeyValues() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield CheckerFlowModel.api.get(`/three/site/${this.flow.siteId}/key-values`);
                const json = yield response.json();
                this.keyValues = json;
            }
            catch (error) {
                errorify(error);
            }
        });
    }
    setInputOptions() {
        const options = ['scene'];
        for (const mod of this.modules) {
            options.push(mod.outputVarName);
        }
        this.inputOptions = options;
    }
    saveModule(mod) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                mod.flowId = this.flow.id;
                const updatedMod = yield mod.updateProperties('', Object.keys(mod), { updateInstanceWithResponse: false });
                for (const mod of this.modules) {
                    if (mod.id === updatedMod.id) {
                        yield mod.updateInstanceFromElement(updatedMod);
                    }
                }
                this.setInputOptions();
            }
            catch (error) {
                errorify(error);
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let flow;
            if (this.mode === 'create') {
                flow = yield this.flow.save();
            }
            else {
                flow = yield this.flow.updateProperties('', Object.keys(this.flow));
            }
            return flow;
        });
    }
    saveFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            let flow;
            try {
                if (this.mode === 'create') {
                    flow = yield this.flow.save();
                    this.mode = 'edit';
                    this.flow = flow;
                }
                else {
                    flow = yield this.flow.updateProperties('', Object.keys(this.flow));
                }
                for (const mod of this.modules) {
                    yield this.saveModule(mod);
                }
            }
            catch (error) {
                errorify(error);
            }
            return flow;
        });
    }
    removeModule(index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mod = this.modules[index];
                if (!mod) {
                    return;
                }
                if (this.flow.modulesIds[index] === mod.id) {
                    this.flow.modulesIds.splice(index, 1);
                    mod.flowId = this.flow.id;
                    yield mod.remove();
                    yield this.flow.updateProperties('', ['modulesIds']);
                    this.fetchModules();
                }
            }
            catch (error) {
                errorify(error);
            }
        });
    }
    moduleOrderChanged(newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.flow.modulesIds = newOrder.map(m => m.id);
                yield this.flow.updateProperties('', ['modulesIds']);
                this.fetchModules();
            }
            catch (error) {
                errorify(error);
            }
        });
    }
    testFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.flowIsRunning) {
                return;
            }
            this.flowIsRunning = true;
            try {
                const json = yield this.flow.api.post(`/three/checker/flow/${this.flow.id}/run`).then(jsonify);
                console.log('json', json);
                if (json.operation === 'completed') {
                    for (let index = 0; index < json.outputs.length; index++) {
                        const summary = json.outputs[index];
                        this.modules[index].outputSummary = summary;
                    }
                }
            }
            catch (error) {
                errorify(error);
            }
            this.flowIsRunning = false;
        });
    }
    duplicate() {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicatedFlow = new CheckerFlowModel;
            yield duplicatedFlow.updateInstanceFromElement(this.flow);
            delete duplicatedFlow.id;
            duplicatedFlow.modulesIds = [];
            duplicatedFlow.name += ' (copy)';
            const newFlow = yield duplicatedFlow.save();
            const duplicatedModules = [];
            for (const module of this.modules) {
                const newModule = CheckerModuleBaseModel.create(module);
                newModule.flowId = newFlow.id;
                delete newModule.id;
                const newModuleSaved = yield newModule.save();
                duplicatedModules.push(newModuleSaved);
            }
            newFlow.modulesIds = duplicatedModules.map(m => m.id);
            yield newFlow.updateProperties('', ['modulesIds']);
            yield this.activate({
                siteId: this.siteId,
                three: this.three,
                flowId: newFlow.id,
            });
        });
    }
};
CheckerFlowDialog = __decorate([
    inject(UxModalService),
    __metadata("design:paramtypes", [UxModalService])
], CheckerFlowDialog);
export { CheckerFlowDialog };

//# sourceMappingURL=checker-flow-dialog.js.map
