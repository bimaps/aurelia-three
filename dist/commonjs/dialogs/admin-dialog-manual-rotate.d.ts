export interface ManualRotateSettings {
    constraint: 'X' | 'Y' | 'Z';
    angle: number;
    unit: 'degree' | 'radian';
}
export declare class AdminDialogManualRotate {
    private element;
    value: ManualRotateSettings;
    constructor(element: Element);
    bind(): void;
    valueChanged(): void;
}
