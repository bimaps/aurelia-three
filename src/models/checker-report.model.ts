import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate, Metadata } from 'aurelia-deco';
import { CheckerFlowModel } from './checkers/checker-internals';

@model('/three/checker/report')
export class ThreeCheckerReportModel extends Model {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;

  @type.string
  @validate.required
  public name: string;

  @type.string
  public description: string;

  @type.models({model: CheckerFlowModel})
  public flows: Array<string> = [];

  @type.metadata
  public metadata: Array<Metadata> = [];
  
}
