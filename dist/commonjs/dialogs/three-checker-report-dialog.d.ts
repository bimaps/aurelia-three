import { ThreeCustomElement } from './../components/three';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult } from '@aurelia-ux/modal';
export declare class ThreeCheckerReportDialog {
    private modalService;
    mode: 'create' | 'edit';
    siteId: string;
    flows: CheckerFlowModel[];
    report: ThreeCheckerReportModel;
    name: string;
    three: ThreeCustomElement;
    includedFlows: CheckerFlowModel[];
    constructor(modalService: UxModalService);
    activate(params: any): void;
    canDeactivate(result: UxModalServiceResult): Promise<boolean>;
    save(): Promise<ThreeCheckerReportModel>;
    remove(): Promise<void>;
    addFlow(flow: CheckerFlowModel): void;
    removeFlow(index: number): void;
    get availableFlows(): CheckerFlowModel[];
}
