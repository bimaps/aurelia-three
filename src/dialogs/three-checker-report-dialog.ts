import { ThreeCustomElement } from './../components/three';
import { Condition } from './../models/checker-config.model';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult} from '@aurelia-ux/modal'
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { inject, computedFrom } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
const log = getLogger('category-dialog');

@inject(UxModalService)
export class ThreeCheckerReportDialog {

  public mode: 'create' | 'edit' = 'create';
  public siteId: string;
  public flows: CheckerFlowModel[] = [];
  public report: ThreeCheckerReportModel;
  public name: string;
  public three: ThreeCustomElement;
  public includedFlows: CheckerFlowModel[] = [];

  constructor(private modalService: UxModalService) {
    
  }

  public activate(params: any) {
    if (params.siteId) {
      this.siteId = params.siteId;
    }
    if (params.three && params.three instanceof ThreeCustomElement) {
      this.three = params.three;
    }
    if (params.flows && Array.isArray(params.flows)) {
      this.flows = params.flows;
    }
    if (params.report && params.report instanceof ThreeCheckerReportModel) {
      this.report = params.report;
      this.siteId = this.report.siteId;
      this.mode = 'edit';
      this.includedFlows = this.flows.filter(i => this.report.flows.includes(i.id));
    } else {
      this.report = new ThreeCheckerReportModel();
      this.report.siteId = this.siteId;
      this.mode = 'create';
    }
    console.log('end of activate', params, this);
  }

  public async canDeactivate(result: UxModalServiceResult) {
    if (result.wasCancelled) {
      return true;
    }
    if (result.output === 'remove') {
      const confirm = await this.modalService.open({
        viewModel: ConfirmDialog,
        model: {title: 'Are you sure ?', text: `Remove the report ${this.report.name} ?`}
      })
      const confirmResult = await confirm.whenClosed();
      if (!confirmResult.wasCancelled) {
        this.remove();
      }
      return;
    }
    const validationResult = await this.report.validationController.validate();
    if (!validationResult.valid) {
      for (let result of validationResult.results) {
        if (!result.valid) {
          errorify(new Error(result.message));
        }
      }
      return false;
    }
    try {
      const category = await this.save();
      result.output = category;
    } catch (error) {
      errorify(error);
      return false;
    }
  }

  public async save(): Promise<ThreeCheckerReportModel> {
    let report: ThreeCheckerReportModel;
    this.report.flows = this.includedFlows.map(i => i.id);
    if (this.mode === 'create') {
      report = await this.report.save();
    } else {
      report = await this.report.updateProperties('', Object.keys(this.report));
    }
    return report;
  }

  public async remove(): Promise<void> {
    if (this.mode === 'edit') {
      await this.report.remove();
    }
  }

  public addFlow(flow: CheckerFlowModel) {
    this.includedFlows.push(flow);
  }

  public removeFlow(index: number) {
    this.includedFlows.splice(index, 1);
  }

  @computedFrom('flows', 'includedFlows.length')
  public get availableFlows(): CheckerFlowModel[] {
    const flows: CheckerFlowModel[] = [];
    for (let flow of this.flows) {
      if (!this.includedFlows.includes(flow)) {
        flows.push(flow);
      }
    }
    return flows;
  }

  
}
