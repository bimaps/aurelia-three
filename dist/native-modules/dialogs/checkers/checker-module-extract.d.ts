import { CheckerModuleExtractModel } from './../../models/checkers/checker-internals';
import { UxModalService } from '@aurelia-ux/modal';
export declare class CheckerModuleExtractElement {
    private modalService;
    private element;
    module: CheckerModuleExtractModel;
    keyValues: {
        [key: string]: Array<any>;
    };
    inputOptions: Array<string>;
    private opened;
    extractOptions: {
        value: string;
        label: string;
    }[];
    constructor(modalService: UxModalService, element: HTMLElement);
    bind(): void;
    keyHelperList(destinationObject: any, destinationKey: string): Promise<void>;
    triggerChange(): void;
    toggle(): void;
}
