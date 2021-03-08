import { CheckerModuleBase, CheckerModuleIOType, CheckerModuleIOTypeValue, CheckerModuleType } from './checker-internals';
import { CheckerModuleFilterModel, CheckerModuleExtractModel, CheckerModuleMathModel } from './checker-internals';
import { CheckerModuleIORef, CheckerModuleReducerModel, CheckerModuleIfModel, CheckerModuleProjectionModel } from './checker-internals';
import { CheckerModuleDistanceModel, CheckerModuleNormalDistanceModel, CheckerModuleOutputModel } from './checker-internals';
import { Model } from 'aurelia-deco';
export declare type CheckerAnyModule = CheckerModuleFilterModel | CheckerModuleExtractModel | CheckerModuleMathModel | CheckerModuleReducerModel | CheckerModuleIfModel | CheckerModuleProjectionModel | CheckerModuleDistanceModel | CheckerModuleNormalDistanceModel | CheckerModuleOutputModel;
export declare class CheckerModuleBaseModel extends Model implements CheckerModuleBase {
    id: string;
    siteId: string;
    flowId: string;
    moduleType: CheckerModuleType;
    name: string;
    allowedInputTypes?: Array<CheckerModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputSummary: string;
    outputReference: CheckerModuleIORef | CheckerModuleIORef[];
    static getOne(flowId: string, moduleId: string): Promise<CheckerAnyModule>;
    static create(data: {
        [key: string]: any;
        moduleType: string;
        siteId: string;
    }): CheckerAnyModule;
}
