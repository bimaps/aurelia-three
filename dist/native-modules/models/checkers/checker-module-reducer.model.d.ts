import { CheckerModuleBaseModel, CheckerModuleReducer, CheckerModuleType } from './checker-internals';
import { CheckerModuleIOType, CheckerModuleReducerOperation } from './checker-internals';
import { Model, GetAllOptions } from 'aurelia-deco';
export declare class CheckerModuleReducerModel extends CheckerModuleBaseModel implements CheckerModuleReducer {
    id: string;
    flowId: string;
    siteId: string;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: string[] | string | number[] | number | boolean[] | boolean;
    outputSummary: string;
    operation: CheckerModuleReducerOperation;
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions & {
        flowId?: string;
    }): Promise<Array<InstanceType<T>>>;
    getRoute(): string;
    postRoute(): string;
    putRoute(elementId: string): string;
    deleteRoute(elementId: string): string;
}
