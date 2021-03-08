import { CheckerModuleBase, CheckerModuleIOType, CheckerModuleIOTypeValue, CheckerModuleType } from './checker-internals';
import { CheckerModuleFilterModel, CheckerModuleExtractModel, CheckerModuleMathModel, modelsByType } from './checker-internals';
import { CheckerModuleIORef, CheckerModuleReducerModel, CheckerModuleIfModel, CheckerModuleProjectionModel } from './checker-internals';
import { CheckerModuleDistanceModel, CheckerModuleNormalDistanceModel, CheckerModuleOutputModel } from './checker-internals';
import { Model } from 'aurelia-deco';
import { SwissdataGlobal } from 'aurelia-swissdata';
import { Container } from 'aurelia-framework';

export type CheckerAnyModule = 
CheckerModuleFilterModel
| CheckerModuleExtractModel
| CheckerModuleMathModel
| CheckerModuleReducerModel
| CheckerModuleIfModel
| CheckerModuleProjectionModel
| CheckerModuleDistanceModel
| CheckerModuleNormalDistanceModel
| CheckerModuleOutputModel
;

export class CheckerModuleBaseModel extends Model implements CheckerModuleBase {

  public id: string;
  public siteId: string;
  public flowId: string;
  public moduleType: CheckerModuleType;
  public name: string;
  public allowedInputTypes?: Array<CheckerModuleIOType>;
  public inputVarName?: string;
  public outputVarName: string;
  public outputType: CheckerModuleIOType;
  public outputValue: CheckerModuleIOTypeValue;
  public outputSummary: string;
  public outputReference: CheckerModuleIORef | CheckerModuleIORef[];

  public static async getOne(flowId: string, moduleId: string): Promise<CheckerAnyModule> {
    const global = Container.instance.get('sd-global') as SwissdataGlobal;
    const api = global.swissdataApi;
    const response: Response = await api.get(`/three/checker/flow/${flowId}/module/${moduleId}`);
    const data = await response.json();
    if (!data || !data.moduleType) {
      throw new Error('Module not found');
    }
    const model = modelsByType[data.moduleType];
    if (!model) {
      throw new Error('Invalid module type')
    }
    const instance = model.instanceFromElement(data); // data is not used in called method
    return await instance.updateInstanceFromElement(data);
  }

  public static create(data: {[key: string]: any, moduleType: string, siteId: string}): CheckerAnyModule {
    if (!modelsByType[data.moduleType]) {
      throw new Error('Invalid module type');
    }
    let instance: CheckerAnyModule = new modelsByType[data.moduleType];
    if (instance) {
      for (const key in data) {
        instance.set(key, data[key]);
      }
      return instance;
    }
    return undefined;
  }

}
