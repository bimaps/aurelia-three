import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { UxModalService, UxModalServiceResult } from '@aurelia-ux/modal';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
export declare class AdminImportSettingsDialog {
    private modalService;
    name: string;
    importThemes: boolean;
    importStyles: boolean;
    importReports: boolean;
    importFlows: boolean;
    hasRequiredStyles: boolean;
    hasRequiredFlows: boolean;
    private currentThemesNames;
    private currentStylesNames;
    private currentReportsNames;
    private currentFlowsNames;
    private themesIdsByName;
    private stylesIdsByName;
    private reportsIdsByName;
    private flowsIdsByName;
    siteId: string;
    themes: (ThreeThemeModel & {
        import?: boolean;
        alreadyExists?: boolean;
        id?: string;
    })[];
    styles: (ThreeStyleModel & {
        import?: boolean;
        alreadyExists?: boolean;
        id?: string;
        disabled?: boolean;
    })[];
    reports: (ThreeCheckerReportModel & {
        import?: boolean;
        alreadyExists?: boolean;
        id?: string;
    })[];
    flows: (CheckerFlowModel & {
        import?: boolean;
        alreadyExists?: boolean;
        id?: string;
        disabled?: boolean;
    })[];
    constructor(modalService: UxModalService);
    activate(params: any): Promise<void>;
    inputFile(): Promise<unknown>;
    parseDatas(): Promise<void>;
    processThemeImports(): void;
    processReportImports(): void;
    canDeactivate(result: UxModalServiceResult): Promise<boolean>;
    private importing;
    import(): Promise<void>;
}
