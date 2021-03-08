import { CheckerModuleBaseModel, CheckerExtractTypeOptions, CheckerModuleExtract, CheckerModuleType, CheckerModuleTypeOptions, CheckerModuleIOType, CheckerExtractType } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate, Model, GetAllOptions } from 'aurelia-deco';

@model('/three/checker/flow')
export class CheckerModuleExtractModel extends CheckerModuleBaseModel implements CheckerModuleExtract {

  @type.id
  public id: string;

  public flowId: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  public allowedInputTypes: Array<CheckerModuleIOType> = ['three-objects', 'scene', 'three-object'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @validate.required
  public moduleType: CheckerModuleType = 'extract';

  @type.string
  public name: string = '';

  @type.string
  @validate.required
  public inputVarName?: string;

  @type.string
  @validate.required
  public outputVarName: string;

  @type.select({options: CheckerModuleTypeOptions, multiple: false})
  public outputType: CheckerModuleIOType;

  @type.string
  public outputSummary: string;

  @type.select({options: CheckerExtractTypeOptions})
  public extractType: CheckerExtractType;

  @type.any
  public value: any;

  @type.boolean
  public forceOutputAsNumber: boolean;

  static getAll<T extends typeof Model>(this: T, suffix: string = '', options: GetAllOptions & {flowId?: string} = {} ): Promise<Array<InstanceType <T>>> {
    if (!options.route && options.flowId) {
      options.route = this.baseroute.replace('/flow/', `/flow/${options.flowId}/module`);
    }
    return super.getAll(suffix, options).then((elements) => {
      for (let element of elements) {
        if (options.flowId) element.set('flowId', options.flowId);
      }
      return elements as Array<InstanceType <T>>;
    });
  }

  getRoute(): string {
    return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + '/';
  }

  // getOneRoute(elementId: string): string {
  //   return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + `/${elementId}`;
  // }

  postRoute(): string {
    return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + '/';
  }

  putRoute(elementId: string): string {
    return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + `/${elementId}`;
  }

  deleteRoute(elementId: string): string {
    return this.deco.baseroute.replace('/flow', `/flow/${this.flowId}/module`) + `/${elementId}`;
  }

}
