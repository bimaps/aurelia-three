import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult} from '@aurelia-ux/modal'
import { errorify, notify } from 'aurelia-resources';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
import { CheckerModuleFilterModel, CheckerModuleExtractModel, CheckerModuleMathModel } from '../models/checkers/checker-internals';
import { CheckerModuleIfModel, CheckerModuleProjectionModel, CheckerModuleNormalDistanceModel } from '../models/checkers/checker-internals';
import {  CheckerModuleDistanceModel, CheckerModuleReducerModel, CheckerModuleOutputModel } from '../models/checkers/checker-internals';
const log = getLogger('admin-export-settings-dialog');

@inject(UxModalService)
export class AdminImportSettingsDialog {

  public name: string = '';
  public importThemes: boolean = true;
  public importStyles: boolean = true;
  public importReports: boolean = true;
  public importFlows: boolean = true;
  public hasRequiredStyles: boolean = false;
  public hasRequiredFlows: boolean = false;

  private currentThemesNames: string[] = [];
  private currentStylesNames: string[] = [];
  private currentReportsNames: string[] = [];
  private currentFlowsNames: string[] = [];

  private themesIdsByName: {[key: string]: string} = {};
  private stylesIdsByName: {[key: string]: string} = {};
  private reportsIdsByName: {[key: string]: string} = {};
  private flowsIdsByName: {[key: string]: string} = {};
  
  public siteId: string;
  public themes: (ThreeThemeModel & {import?: boolean, alreadyExists?: boolean, id?: string})[] = [];
  public styles: (ThreeStyleModel & {import?: boolean, alreadyExists?: boolean, id?: string, disabled?: boolean})[] = [];
  public reports: (ThreeCheckerReportModel & {import?: boolean, alreadyExists?: boolean, id?: string})[] = [] = [];
  public flows: (CheckerFlowModel & {import?: boolean, alreadyExists?: boolean, id?: string, disabled?: boolean})[] = [] = [];

  constructor(private modalService: UxModalService) {
    
  }

  public async activate(params: any) {
    if (params.siteId) {
      this.siteId = params.siteId;
    }
    try {
      await this.inputFile();
      await this.parseDatas();
      this.processThemeImports();
      this.processReportImports();
    } catch (error) {
      errorify(error);
      throw error;
    }
  }

  public async inputFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = 'file';
      document.body.appendChild(input);
      input.style.display = "none";
      input.onchange = async (event) => {
        let reader = new FileReader();
        reader.onload = async (e) => {
          let json: any = (e.target as any).result;
          try {
            json = JSON.parse(json);
          } catch (error) {
            errorify(new Error('The file must be a JSON'));
            return;
          }
  
          try {
            this.name = json.name || '';
            this.themes = (json.themes as Array<any>) || [];
            this.styles = (json.styles as Array<any>) || [];
            this.reports = (json.reports as Array<any>) || [];
            this.flows = (json.flows as Array<any>) || [];
            resolve(null);
          } catch (error) {
            reject(error);
          }
        };
  
        reader.readAsText((event.target as any).files[0]);
      };
      input.onabort = (ev: UIEvent) => {
        reject(new Error('Operation aborted'));
      };
      input.click();
    })
  }

  public async parseDatas() {
    const currentThemes = await ThreeThemeModel.getAll(`?siteId=${this.siteId}`);
    const currentStyles = await ThreeStyleModel.getAll(`?siteId=${this.siteId}`);
    const currentReports = await ThreeCheckerReportModel.getAll(`?siteId=${this.siteId}`);
    const currentFlows = await CheckerFlowModel.getAll(`?siteId=${this.siteId}`);

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
  }

  public processThemeImports() {
    let requiredStyleIds: Array<string> = [];
    for (let theme of this.themes) {
      if (theme.import) {
        for (let rule of theme.rules || []) {
          for (let style of rule.styles || []) {
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
        style.import =  true;
        style.disabled = true;
      } else {
        style.disabled = false;
      }
    }
  }

  public processReportImports() {
    let requiredFlowsIds: Array<string> = [];
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
        flow.import =  true;
        flow.disabled = true;
      } else {
        flow.disabled = false;
      }
    }
  }

  public async canDeactivate(result: UxModalServiceResult) {
    if (result.wasCancelled) {
      return true;
    }
    try {
      if (!this.importThemes && !this.importStyles && !this.importReports && !this.importFlows) {
        throw new Error('Please select something to import. Otherwise you can cancel.')
      }
      this.import();
      result.output = true;
    } catch (error) {
      errorify(error);
      return false;
    }
  }

  private importing: boolean = false;
  public async import() {
    this.importing = true;
    try {
      for (let style of this.styles) {
        if (style.import) {
          const newStyle = new ThreeStyleModel;
          for (let key in style) {
            newStyle[key] = style[key];
          }
          newStyle.siteId = this.siteId;
          const newOrUpdatedStyle = newStyle.id
            ? await newStyle.updateProperties('', Object.keys(newStyle))
            : await newStyle.save('');
          this.stylesIdsByName[newOrUpdatedStyle.name] = newOrUpdatedStyle.id;
        }
      }
      for (let theme of this.themes) {
        if (theme.import) {
          const newTheme = new ThreeThemeModel;
          for (let key in theme) {
            newTheme[key] = theme[key];
          }
          for (let rule of newTheme.rules) {
            rule.styles = rule.styles.map(s => this.stylesIdsByName[s]);
          }
          newTheme.siteId = this.siteId;
          const newOrUpdatedTheme = newTheme.id
            ? await newTheme.updateProperties('', Object.keys(newTheme))
            : await newTheme.save('');
          this.themesIdsByName[newOrUpdatedTheme.name] = newOrUpdatedTheme.id;
        }
      }
      // FIX Flow imports
      // first create the flow
      // then add the flowId to the modules
      // and maybe use the add module to flow request
      for (let flow of this.flows) {
        if (flow.import) {
          const newFlow = new CheckerFlowModel;
          for (let key in flow) {
            newFlow[key] = flow[key];
          }
          newFlow.siteId = this.siteId;
          newFlow.modulesIds = [];

          const newOrUpdatedFlow: CheckerFlowModel = newFlow.id
            ? await newFlow.updateProperties('', Object.keys(newFlow))
            : await newFlow.save('');
          this.flowsIdsByName[newOrUpdatedFlow.name] = newOrUpdatedFlow.id;

          const modules: {[key: string]: any}[] = (flow as any).modules;
          newOrUpdatedFlow.modulesIds = [];
          for (const mod of modules) {
            let instance: CheckerModuleFilterModel | CheckerModuleExtractModel | CheckerModuleMathModel | CheckerModuleNormalDistanceModel | CheckerModuleReducerModel | CheckerModuleIfModel | CheckerModuleProjectionModel |  CheckerModuleDistanceModel | CheckerModuleOutputModel;
            switch (mod.moduleType) {
              case 'filter': instance = new CheckerModuleFilterModel(); break;
              case 'extract': instance = new CheckerModuleExtractModel(); break;
              case 'math': instance = new CheckerModuleMathModel(); break;
              case 'normal-distance': instance = new CheckerModuleNormalDistanceModel(); break;
              case 'distance': instance = new CheckerModuleDistanceModel(); break;
              case 'reducer': instance = new CheckerModuleReducerModel(); break;
              case 'projection': instance = new CheckerModuleProjectionModel(); break;
              case 'if': instance = new CheckerModuleIfModel(); break;
              case 'output': instance = new CheckerModuleOutputModel(); break;
            }
            if (instance) {
              instance.siteId = newFlow.siteId;
              instance.flowId = newOrUpdatedFlow.id;
              for (const key in mod) {
                instance[key] = mod[key];
              }
              const newModule = await instance.save();
              newOrUpdatedFlow.modulesIds.push(newModule.id);
            }
          }
          newOrUpdatedFlow.updateProperties('', ['modulesIds']);
          
        }
      }
      for (let report of this.reports) {
        if (report.import) {
          const newReport = new ThreeCheckerReportModel;
          for (let key in report) {
            newReport[key] = report[key];
          }
          newReport.flows = newReport.flows.map(c => this.flowsIdsByName[c]);
          newReport.siteId = this.siteId;
          const newOrUpdatedReport = newReport.id
            ? await newReport.updateProperties('', Object.keys(newReport))
            : await newReport.save('');
          this.reportsIdsByName[newOrUpdatedReport.name] = newOrUpdatedReport.id;
        }
      }
      notify('Import successfully completed');
    } catch (error) {
      errorify(error);
      throw error;
    }
    
  }

  
}
