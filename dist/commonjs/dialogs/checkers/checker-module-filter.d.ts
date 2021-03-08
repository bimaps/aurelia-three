import { CheckerModuleFilterModel, CheckerObjectCondition } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleFilterElement {
    private modalService;
    private element;
    module: CheckerModuleFilterModel;
    keyValues: {
        [key: string]: Array<any>;
    };
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    bind(): void;
    addCondition(): void;
    removeCondition(index: string): void;
    setConditionType(condition: CheckerObjectCondition, operation: '<' | '>' | '=' | '!='): void;
    keyHelperList(destinationObject: any, destinationKey: string): Promise<void>;
    valueHelperList(key: string, destinationObject: any, destinationKey: string): Promise<void>;
    triggerChange(): void;
    toggle(): void;
}
