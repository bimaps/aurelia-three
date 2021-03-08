import { CheckerModuleNormalDistanceModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleNormalDistanceElement {
    private modalService;
    private element;
    module: CheckerModuleNormalDistanceModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService, element: HTMLElement);
    triggerChange(): void;
    toggle(): void;
}
