import { CheckerModuleOutputModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleOutputElement {
    private modalService;
    private element;
    module: CheckerModuleOutputModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    addOutput(): void;
    removeOutput(index: string): void;
    triggerChange(): void;
    toggle(): void;
}
