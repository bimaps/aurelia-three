import { CheckerModuleBaseModel, CheckerModuleFilter, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleType, CheckerObjectCondition, CheckerConditionOperator } from './checker-internals';
import { Model, GetAllOptions } from 'aurelia-deco';
export declare class CheckerModuleFilterModel extends CheckerModuleBaseModel implements CheckerModuleFilter {
    id: string;
    flowId: string;
    siteId: string;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputSummary: string;
    conditions: Array<CheckerObjectCondition>;
    conditionsOperator: CheckerConditionOperator;
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions & {
        flowId?: string;
    }): Promise<Array<InstanceType<T>>>;
    getRoute(): string;
    postRoute(): string;
    putRoute(elementId: string): string;
    deleteRoute(elementId: string): string;
}
