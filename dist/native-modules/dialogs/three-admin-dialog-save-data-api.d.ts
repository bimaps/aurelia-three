export interface SaveDataApiSettings {
    saveLights: boolean;
    clearApiDataBeforeSaving: boolean;
    importId: string;
}
export declare class ThreeAdminDialogSaveDataApi {
    private element;
    value: SaveDataApiSettings;
    constructor(element: Element);
    bind(): void;
    valueChanged(): void;
}
