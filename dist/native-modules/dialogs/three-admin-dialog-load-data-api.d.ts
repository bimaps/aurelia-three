export interface LoadDataApiSettings {
    replaceLightsIfAny: boolean;
    emptySceneBeforeLoad: boolean;
    zoomOnScene: boolean;
}
export declare class ThreeAdminDialogLoadDataApi {
    private element;
    value: LoadDataApiSettings;
    constructor(element: Element);
    bind(): void;
    valueChanged(): void;
}
