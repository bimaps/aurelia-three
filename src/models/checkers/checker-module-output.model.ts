import { CheckerModuleBaseModel, CheckerModuleIOTypeOptions, CheckerModuleOutput, CheckerOutput, CheckerModuleType, CheckerModuleTypeOptions, CheckerModuleIOType, CheckerModuleIOTypeValue } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate, Model, GetAllOptions } from 'aurelia-deco';

@model('/three/checker/flow')
export class CheckerModuleOutputModel extends CheckerModuleBaseModel implements CheckerModuleOutput {

  @type.id
  public id: string;

  public flowId: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.select({options: CheckerModuleIOTypeOptions, multiple: true})
  public allowedInputTypes: Array<CheckerModuleIOType> = ['number', 'numbers', 'string', 'strings', 'boolean', 'booleans'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @validate.required
  public moduleType: CheckerModuleType = 'output';

  @type.string
  public name: string = '';

  @type.string
  @validate.required
  public inputVarName?: string;

  @type.string
  @validate.required
  public outputVarName: string;

  @type.select({options: CheckerModuleTypeOptions, multiple: false})
  public outputType: CheckerModuleIOType = 'json';

  public outputValue: CheckerModuleIOTypeValue;

  @type.string
  public outputSummary: string;

  @type.array({type: 'object', options: {
    keys: {
      prefix: {type: 'string'},
      varName: {type: 'string'},
      suffix: {type: 'string'},
      display: {type: 'select', options: ['paragraph', 'blocks']}
    }
  }})
  public outputs: CheckerOutput[] = [];

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
