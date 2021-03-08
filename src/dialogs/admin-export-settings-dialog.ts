import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCheckerConfigModel } from './../models/checker-config.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult} from '@aurelia-ux/modal'
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { inject, computedFrom } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import FileSaver from 'file-saver';
import * as moment from 'moment';
import { CheckerFlowModel, CheckerModuleBaseModel } from '../models/checkers/checker-internals';
const log = getLogger('admin-export-settings-dialog');

@inject(UxModalService)
export class AdminExportSettingsDialog {

  public name: string = '';
  public exportThemes: boolean = false;
  public exportStyles: boolean = false;
  public exportReports: boolean = false;
  public exportFlows: boolean = false;
  public hasRequiredStyles: boolean = false;
  public hasRequiredFlows: boolean = false;
  
  public siteId: string;
  public themes: (ThreeThemeModel & {export?: boolean})[];
  public styles: (ThreeStyleModel & {export?: boolean, disabled?: boolean})[];
  public reports: (ThreeCheckerReportModel & {export?: boolean})[] = [];
  public flows: (CheckerFlowModel & {export?: boolean, disabled?: boolean})[] = [];
  //public checkers: (ThreeCheckerConfigModel & {export?: boolean, disabled?: boolean})[] = [];

  constructor(private modalService: UxModalService) {
    
  }

  public async activate(params: any) {
    if (params.siteId) {
      this.siteId = params.siteId;
    }
    try {
      await this.loadDatas();
    } catch (error) {
      throw error;
    }
  }

  public async loadDatas() {
    this.themes = await ThreeThemeModel.getAll(`?siteId=${this.siteId}`);
    this.styles = await ThreeStyleModel.getAll(`?siteId=${this.siteId}`);
    this.reports = await ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}`);
    this.flows = await CheckerFlowModel.getAll(`?siteId=${this.siteId}`);
  }

  public async canDeactivate(result: UxModalServiceResult) {
    if (result.wasCancelled) {
      return true;
    }
    try {
      if (!this.name) {
        throw new Error('You must give a name to your export');
      }
      if (!this.exportThemes && !this.exportStyles && !this.exportReports && !this.exportFlows) {
        throw new Error('Please select something to export. Otherwise you can cancel.')
      }
      this.export();
      result.output = true;
    } catch (error) {
      errorify(error);
      return false;
    }
  }

  public processThemeExports() {
    let requiredStyleIds: Array<string> = [];
    for (let theme of this.themes) {
      if (theme.export) {
        for (let rule of theme.rules || []) {
          for (let style of rule.styles || []) {
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
        style.export =  true;
        style.disabled = true;
      } else {
        style.disabled = false;
      }
    }
  }

  public processReportExports() {
    let requiredFlowsIds: Array<string> = [];
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
        flow.export =  true;
        flow.disabled = true;
      } else {
        flow.disabled = false;
      }
    }
  }

  public async export() {
    let json: any = {
      name: this.name,
      date: moment().format('DD/MM/YYYY HH:mm:ss')
    };
    const stylesNamesByIds: {[key: string]: string} = {};
    for (let style of this.styles) {
      stylesNamesByIds[style.id] = style.name;
    }
    const flowsNamesByIds: {[key: string]: string} = {};
    for (let flow of this.flows) {
      flowsNamesByIds[flow.id] = flow.name;
    }
    if (this.exportThemes) {
      json.themes = [];
      for (let theme of this.themes) {
        if (theme.export) {
          json.themes.push({
            name: theme.name,
            rules: theme.rules.map( r => {
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
          const keys = Object.keys(style).filter(key => 
            key !== 'export' &&
            key !== 'disabled' &&
            key !== '_createdBy' &&
            key !== '_createdAt' &&
            key !== '_updatedBy' &&
            key !== '_updatedAt' &&
            key !== 'siteId' &&
            key !== 'id'
          );
          const newStyle: {[key: string]: any} = {};
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
          const keys = Object.keys(flow).filter(key => 
            key !== 'export' &&
            key !== 'disabled' &&
            key !== '_createdBy' &&
            key !== '_createdAt' &&
            key !== '_updatedBy' &&
            key !== '_updatedAt' &&
            key !== 'siteId' &&
            key !== 'id'
          );
          const newFlow: {[key: string]: any} = {};
          const modules: Array<{[key: string]: any}> = [];
          for (const moduleId of flow.modulesIds) {
            const mod = await CheckerModuleBaseModel.getOne(flow.id, moduleId);
            const moduleKeys = Object.keys(mod).filter(key => 
              key !== 'export' &&
              key !== 'disabled' &&
              key !== '_createdBy' &&
              key !== '_createdAt' &&
              key !== '_updatedBy' &&
              key !== '_updatedAt' &&
              key !== 'siteId' &&
              key !== 'id' && 
              key !== 'allowedInputTypes' && 
              key !== 'outputSummary'
            );
            const newModule: {[key: string]: any} = {};
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
    let fileContent: string = JSON.stringify(json, null, 2);
    let blob = new Blob([fileContent], {type: "application/json"});
    FileSaver.saveAs(blob, `${this.name}.json`);
  }

  
}
