import { Model, Metadata } from 'aurelia-deco';
export declare class ThreeCheckerConfigModel extends Model {
    id: string;
    siteId: string;
    name: string;
    description: string;
    conditions: Array<Condition>;
    operation: 'count' | 'compare-key-value' | 'add-key-value';
    operationSettings: any;
    metadata: Array<Metadata>;
}
export interface Condition {
    key: string;
    operator: '=' | '<' | '>' | '!=' | '*';
    value: string | number | Date;
}
