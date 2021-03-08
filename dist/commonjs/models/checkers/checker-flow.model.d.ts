import { CheckerFlow } from './checker-internals';
import { Model } from 'aurelia-deco';
export declare class CheckerFlowModel extends Model implements CheckerFlow {
    id: string;
    siteId: string;
    name: string;
    description: string;
    modulesIds: Array<string>;
}
