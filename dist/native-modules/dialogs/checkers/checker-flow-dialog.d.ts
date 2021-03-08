import { ThreeCustomElement } from './../../components/three';
import { UxModalService, UxModalServiceResult } from '@aurelia-ux/modal';
import { CheckerFlowModel, CheckerModuleBaseModel } from '../../models/checkers/checker-internals';
export declare class CheckerFlowDialog {
    private modalService;
    mode: 'create' | 'edit';
    siteId: string;
    flow: CheckerFlowModel;
    modules: CheckerModuleBaseModel[];
    three: ThreeCustomElement;
    private keyValues;
    private inputOptions;
    constructor(modalService: UxModalService);
    activate(params: any): Promise<void>;
    canDeactivate(result: UxModalServiceResult): Promise<boolean>;
    remove(): Promise<void>;
    addModule(): Promise<void>;
    private fetchModules;
    fetchKeyValues(): Promise<void>;
    setInputOptions(): void;
    saveModule(mod: CheckerModuleBaseModel): Promise<void>;
    save(): Promise<CheckerFlowModel>;
    saveFlow(): Promise<CheckerFlowModel>;
    removeModule(index: number): Promise<void>;
    moduleOrderChanged(newOrder: CheckerModuleBaseModel[]): Promise<void>;
    flowIsRunning: boolean;
    testFlow(): Promise<void>;
    duplicate(): Promise<void>;
}
