import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult } from '@aurelia-ux/modal';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
export declare class AdminExportSettingsDialog {
    private modalService;
    name: string;
    exportThemes: boolean;
    exportStyles: boolean;
    exportReports: boolean;
    exportFlows: boolean;
    hasRequiredStyles: boolean;
    hasRequiredFlows: boolean;
    siteId: string;
    themes: (ThreeThemeModel & {
        export?: boolean;
    })[];
    styles: (ThreeStyleModel & {
        export?: boolean;
        disabled?: boolean;
    })[];
    reports: (ThreeCheckerReportModel & {
        export?: boolean;
    })[];
    flows: (CheckerFlowModel & {
        export?: boolean;
        disabled?: boolean;
    })[];
    constructor(modalService: UxModalService);
    activate(params: any): Promise<void>;
    loadDatas(): Promise<void>;
    canDeactivate(result: UxModalServiceResult): Promise<boolean>;
    processThemeExports(): void;
    processReportExports(): void;
    export(): Promise<void>;
}
