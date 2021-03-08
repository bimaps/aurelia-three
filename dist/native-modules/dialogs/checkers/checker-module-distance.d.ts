import { CheckerModuleDistanceModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleDistanceElement {
    private modalService;
    module: CheckerModuleDistanceModel;
    inputOptions: Array<string>;
    private opened;
    constructor(modalService: UxModalService);
    toggle(): void;
}
