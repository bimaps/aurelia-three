import { CheckerModuleMathModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleMathElement {
    private modalService;
    private element;
    module: CheckerModuleMathModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    triggerChange(): void;
    toggle(): void;
}
