import { CheckerModuleProjectionModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleProjectionElement {
    private modalService;
    private element;
    module: CheckerModuleProjectionModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    triggerChange(): void;
    toggle(): void;
}
