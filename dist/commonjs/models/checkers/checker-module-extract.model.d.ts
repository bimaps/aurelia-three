import { CheckerModuleBaseModel, CheckerModuleExtract, CheckerModuleType, CheckerModuleIOType, CheckerExtractType } from './checker-internals';
import { Model, GetAllOptions } from 'aurelia-deco';
export declare class CheckerModuleExtractModel extends CheckerModuleBaseModel implements CheckerModuleExtract {
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
    extractType: CheckerExtractType;
    value: any;
    forceOutputAsNumber: boolean;
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions & {
        flowId?: string;
    }): Promise<Array<InstanceType<T>>>;
    getRoute(): string;
    postRoute(): string;
    putRoute(elementId: string): string;
    deleteRoute(elementId: string): string;
}
