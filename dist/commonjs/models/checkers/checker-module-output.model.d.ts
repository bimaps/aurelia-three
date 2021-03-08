import { CheckerModuleBaseModel, CheckerModuleOutput, CheckerOutput, CheckerModuleType, CheckerModuleIOType, CheckerModuleIOTypeValue } from './checker-internals';
import { Model, GetAllOptions } from 'aurelia-deco';
export declare class CheckerModuleOutputModel extends CheckerModuleBaseModel implements CheckerModuleOutput {
    id: string;
    flowId: string;
    siteId: string;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputSummary: string;
    outputs: CheckerOutput[];
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions & {
        flowId?: string;
    }): Promise<Array<InstanceType<T>>>;
    getRoute(): string;
    postRoute(): string;
    putRoute(elementId: string): string;
    deleteRoute(elementId: string): string;
}
