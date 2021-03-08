import { Model, Metadata } from 'aurelia-deco';
export declare class ThreeCheckerReportModel extends Model {
    id: string;
    siteId: string;
    name: string;
    description: string;
    flows: Array<string>;
    metadata: Array<Metadata>;
}
