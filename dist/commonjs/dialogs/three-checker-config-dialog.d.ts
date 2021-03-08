import { ThreeCustomElement } from './../components/three';
import { ThreeCheckerConfigModel, Condition } from './../models/checker-config.model';
import { UxModalService, UxModalServiceResult } from '@aurelia-ux/modal';
export declare class ThreeCheckerConfigDialog {
    private modalService;
    mode: 'create' | 'edit';
    siteId: string;
    checker: ThreeCheckerConfigModel;
    name: string;
    three: ThreeCustomElement;
    constructor(modalService: UxModalService);
    activate(params: any): void;
    canDeactivate(result: UxModalServiceResult): Promise<boolean>;
    save(): Promise<ThreeCheckerConfigModel>;
    remove(): Promise<void>;
    addCondition(): void;
    removeCondition(index: string): void;
    setConditionType(condition: Condition, operator: '<' | '>' | '=' | '!='): void;
    keyHelperList(destinationObject: any, destinationKey: string): Promise<void>;
    valueHelperList(key: string, destinationObject: any, destinationKey: string): Promise<void>;
    expressionBuilder(): Promise<void>;
}
