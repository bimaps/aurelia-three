import { ThreeCheckerReportModel } from './../../models/checker-report.model';
import { ThreeCustomElement } from './../../components/three';
import { UxModalService, UxModalServiceResult} from '@aurelia-ux/modal'
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { jsonify, TypeDecorator, UpdatePropertiesOptions } from 'aurelia-deco';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerFlowModel, CheckerModuleBaseModel } from '../../models/checkers/checker-internals';
import { CheckerModuleFilterModel, CheckerModuleExtractModel, CheckerModuleMathModel } from '../../models/checkers/checker-internals';
import { CheckerModuleIfModel, CheckerModuleProjectionModel, CheckerModuleNormalDistanceModel } from '../../models/checkers/checker-internals';
import {  CheckerModuleDistanceModel, CheckerModuleReducerModel, CheckerModuleOutputModel } from '../../models/checkers/checker-internals';
const log = getLogger('checker-flow-dialog');

@inject(UxModalService)
export class CheckerFlowDialog {

  public mode: 'create' | 'edit' = 'create';
  public siteId: string;
  public flow: CheckerFlowModel;
  public modules: CheckerModuleBaseModel[];
  public three: ThreeCustomElement;
  private keyValues: {[key: string]: Array<any>} = {};
  private inputOptions: Array<string> = [];

  constructor(private modalService: UxModalService) {
    
  }

  public async activate(params: any) {
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
    } else if (params.flowId) {
      const flow = await CheckerFlowModel.getOneWithId(params.flowId);
      if (!flow) {
        throw new Error('Flow not found');
      }
      this.flow = flow;
      this.siteId = flow.siteId;
      this.mode = 'edit';
    } else {
      this.flow = new CheckerFlowModel();
      this.flow.siteId = this.siteId;
      this.mode = 'create';
    }
    await this.fetchModules();
    await this.fetchKeyValues();
  }

  public async canDeactivate(result: UxModalServiceResult) {
    if (result.wasCancelled) {
      return true;
    }
    if (result.output === 'remove') {
      // fetch all the reports where this flow is linked
      const reports = await ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}&flows=${this.flow.id}`);
      let text = `Remove the flow ${this.flow.name} ?`;
      if (reports.length) {
        text += '<br><br>The flow will also be removed from the following reports: <ul>' + reports.map(r => `<li>${r.name}</li>`).join('') + '</ul>';
      }
      const confirm = await this.modalService.open({
        viewModel: ConfirmDialog,
        model: {title: 'Are you sure ?', text}
      })
      const confirmResult = await confirm.whenClosed();
      if (!confirmResult.wasCancelled) {
        this.remove();
      }
      return;
    }
    const validationResult = await this.flow.validationController.validate();
    if (!validationResult.valid) {
      for (let result of validationResult.results) {
        if (!result.valid) {
          errorify(new Error(result.message));
        }
      }
      return false;
    }
    try {
      const flow = await this.saveFlow();
      result.output = flow;
    } catch (error) {
      errorify(error);
      return false;
    }
  }

  public async remove(): Promise<void> {
    if (this.mode === 'edit') {
      await this.flow.remove();
    }
  }

  public async addModule(): Promise<void> {
    try {
      const options = [
        {value: 'filter', label: 'Filter Module'},
        {value: 'extract', label: 'Extract Module'},
        {value: 'math', label: 'Math Module'},
        {value: 'if', label: 'IF Module'},
        {value: 'reducer', label: 'Reducer Module'},
        {value: 'projection', label: 'Projection Module'},
        {value: 'normal-distance', label: 'Normal Distance Module'},
        {value: 'distance', label: 'Distance Module'},
        {value: 'output', label: 'Output Module'},
      ];
      const dialog = await this.modalService.open({
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
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        const instance = CheckerModuleBaseModel.create({moduleType: result.output, siteId: this.flow.siteId});
        // let instance: CheckerModuleFilterModel | CheckerModuleExtractModel | CheckerModuleMathModel | CheckerModuleNormalDistanceModel | CheckerModuleReducerModel | CheckerModuleIfModel | CheckerModuleProjectionModel |  CheckerModuleDistanceModel | CheckerModuleOutputModel;
        // switch (result.output) {
        //   case 'filter': instance = new CheckerModuleFilterModel(); break;
        //   case 'extract': instance = new CheckerModuleExtractModel(); break;
        //   case 'math': instance = new CheckerModuleMathModel(); break;
        //   case 'normal-distance': instance = new CheckerModuleNormalDistanceModel(); break;
        //   case 'distance': instance = new CheckerModuleDistanceModel(); break;
        //   case 'reducer': instance = new CheckerModuleReducerModel(); break;
        //   case 'projection': instance = new CheckerModuleProjectionModel(); break;
        //   case 'if': instance = new CheckerModuleIfModel(); break;
        //   case 'output': instance = new CheckerModuleOutputModel(); break;
        // }
        if (instance) {
          instance.flowId = this.flow.id;
          instance.inputVarName = 'scene';
          instance.outputVarName = `Output#${this.flow.modulesIds.length + 1}`;
          const module = await instance.save();
          this.flow.modulesIds.push(module.id);
          await this.flow.updateProperties('', ['modulesIds']);
          console.log('modulesIds saved');
        }
        await this.fetchModules();
      }
    } catch (error) {
      errorify(error);
    }
  }
  private async fetchModules() {
    const modules: Array<CheckerModuleBaseModel> = [];
    for (const moduleId of this.flow.modulesIds) {
      const mod = await CheckerModuleBaseModel.getOne(this.flow.id, moduleId);
      modules.push(mod);
    }
    this.modules = modules;
    this.setInputOptions();
  }

  public async fetchKeyValues() {
    try {
      const response = await CheckerFlowModel.api.get(`/three/site/${this.flow.siteId}/key-values`);
      const json = await response.json();
      this.keyValues = json;
    } catch (error) {
      errorify(error);
    }
  }

  public setInputOptions(): void {
    const options: Array<string> = ['scene']
    for (const mod of this.modules) {
      options.push(mod.outputVarName);
    }
    this.inputOptions = options;
  }

  public async saveModule(mod: CheckerModuleBaseModel): Promise<void> {
    try {
      mod.flowId = this.flow.id;
      const updatedMod = await mod.updateProperties('', Object.keys(mod), {updateInstanceWithResponse: false});
      for (const mod of this.modules) {
        if (mod.id === updatedMod.id) {
          await mod.updateInstanceFromElement(updatedMod);
          // mod.updateInstanceFromUnclassedElement(updatedMod);
        }
      }
      this.setInputOptions();
    } catch (error) {
      errorify(error);
    }
  }

  public async save(): Promise<CheckerFlowModel> {
    let flow: CheckerFlowModel;
    if (this.mode === 'create') {
      flow = await this.flow.save();
    } else {
      flow = await this.flow.updateProperties('', Object.keys(this.flow));
    }
    return flow;
  }

  public async saveFlow(): Promise<CheckerFlowModel> {
    let flow: CheckerFlowModel;
    try {
      if (this.mode === 'create') {
        flow = await this.flow.save();
        this.mode = 'edit';
        this.flow = flow;
      } else {
        flow = await this.flow.updateProperties('', Object.keys(this.flow));
      }
      for (const mod of this.modules) {
        await this.saveModule(mod);
      }
    } catch (error) {
      errorify(error);
    }
    return flow;
  }

  public async removeModule(index: number): Promise<void> {
    try {
      const mod = this.modules[index];
      if (!mod) {
        return;
      }
      if (this.flow.modulesIds[index] === mod.id) {
        this.flow.modulesIds.splice(index, 1);
        mod.flowId = this.flow.id;
        await mod.remove();
        await this.flow.updateProperties('', ['modulesIds']);
        this.fetchModules();
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async moduleOrderChanged(newOrder: CheckerModuleBaseModel[]): Promise<void> {
    try {
      this.flow.modulesIds = newOrder.map(m => m.id);
      await this.flow.updateProperties('', ['modulesIds']);
      this.fetchModules();
    } catch (error) {
      errorify(error);
    }
  }

  public flowIsRunning = false;
  public async testFlow(): Promise<void> {
    if (this.flowIsRunning) {
      return;
    }
    this.flowIsRunning = true;
    try {
      const json = await this.flow.api.post(`/three/checker/flow/${this.flow.id}/run`).then(jsonify);
      console.log('json', json);
      if (json.operation === 'completed') {
        for (let index = 0; index < json.outputs.length; index++) {
          const summary = json.outputs[index];
          this.modules[index].outputSummary = summary;
        }
      }
    } catch (error) {
      errorify(error);
    }
    this.flowIsRunning = false;
  }

  public async duplicate() {

    const duplicatedFlow = new CheckerFlowModel;
    await duplicatedFlow.updateInstanceFromElement(this.flow);
    delete duplicatedFlow.id;
    duplicatedFlow.modulesIds = [];
    duplicatedFlow.name += ' (copy)';
    const newFlow: CheckerFlowModel = await duplicatedFlow.save();

    const duplicatedModules: CheckerModuleBaseModel[] = [];
    for (const module of this.modules) {
      const newModule = CheckerModuleBaseModel.create(module);
      newModule.flowId = newFlow.id;
      delete newModule.id;
      const newModuleSaved = await newModule.save();
      duplicatedModules.push(newModuleSaved);
    }

    newFlow.modulesIds = duplicatedModules.map(m => m.id);
    await newFlow.updateProperties('', ['modulesIds']);
    await this.activate({
      siteId: this.siteId,
      three: this.three,
      flowId: newFlow.id,
    });
  }

}
