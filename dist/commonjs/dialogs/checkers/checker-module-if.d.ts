import { CheckerModuleIfModel, CheckerValueCondition } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleIfElement {
    private modalService;
    private element;
    module: CheckerModuleIfModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    bind(): void;
    setConditionType(condition: CheckerValueCondition, operation: '<' | '>' | '=' | '!='): void;
    addOperation(): void;
    removeOperation(index: string): void;
    addCondition(operationIndex: string): void;
    removeCondition(operationIndex: string, conditionIndex: string): void;
    triggerChange(): void;
    toggle(): void;
}
