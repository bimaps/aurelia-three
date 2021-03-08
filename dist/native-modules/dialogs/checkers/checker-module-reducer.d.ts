import { CheckerModuleReducerModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleReducerElement {
    private modalService;
    private element;
    module: CheckerModuleReducerModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    triggerChange(): void;
    toggle(): void;
}
