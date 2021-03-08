import { CheckerModuleBaseModel, CheckerModuleIOTypeOptions, CheckerModuleIf, CheckerModuleType, CheckerModuleIOStyleOptions } from './checker-internals';
import { CheckerModuleIfOperations, CheckerModuleIOType, CheckerModuleTypeOptions, CheckerModuleIOStyle } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, validate, Model, GetAllOptions } from 'aurelia-deco';

@model('/three/checker/flow')
export class CheckerModuleIfModel extends CheckerModuleBaseModel implements CheckerModuleIf {

  @type.id
  public id: string;

  public flowId: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.select({options: CheckerModuleIOTypeOptions, multiple: true})
  public allowedInputTypes: Array<CheckerModuleIOType> = ['numbers', 'strings', 'number', 'string'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @validate.required
  public moduleType: CheckerModuleType = 'if';

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

  public outputValue: string[] | string | number[] | number | boolean[] | boolean;

  @type.string
  public outputSummary: string;

  @type.any
  public defaultOutputValue: number | string | boolean;

  @type.select({options: CheckerModuleIOStyleOptions})
  public defaultOutputStyle: CheckerModuleIOStyle;
  
  @type.array({type: 'object', options: {
    keys: {
      conditions: {type: 'array', options: {type: 'object', options: {
        keys: {
          operation: {type: 'string'},
          value: {type: 'any'},
        }
      }}},
      conditionsOperator: {type: 'select', options: ['and', 'or']},
      outputValue: {type: 'any'},
      outputStyle: {type: 'select', options: CheckerModuleIOStyleOptions}
    }
  }})
  public operations: CheckerModuleIfOperations;

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
