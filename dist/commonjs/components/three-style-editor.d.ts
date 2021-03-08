export declare class ThreeStyleEditor {
    private element;
    private log;
    private _style;
    private subscriptions;
    constructor(element: Element);
    detatched(): void;
    styleModif(prop: string): void;
    notifyStyleChange(): void;
}
