import { CheckerModuleBaseModel, CheckerModuleDistance, CheckerModuleType, CheckerModuleIOType } from './checker-internals';
import { Model, GetAllOptions } from 'aurelia-deco';
export declare class CheckerModuleDistanceModel extends CheckerModuleBaseModel implements CheckerModuleDistance {
    id: string;
    flowId: string;
    siteId: string;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    input2VarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: string[] | string | number[] | number | boolean[] | boolean;
    outputSummary: string;
    distanceType: '2d-2d' | '3d-3d';
    static getAll<T extends typeof Model>(this: T, suffix?: string, options?: GetAllOptions & {
        flowId?: string;
    }): Promise<Array<InstanceType<T>>>;
    getRoute(): string;
    postRoute(): string;
    putRoute(elementId: string): string;
    deleteRoute(elementId: string): string;
}
