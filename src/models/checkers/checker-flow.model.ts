import { CheckerModuleBaseModel, CheckerFlow } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, Model, type, validate } from 'aurelia-deco';

@model('/three/checker/flow')
export class CheckerFlowModel extends Model implements CheckerFlow  {

  @type.id
  public id: string;

  @type.model({model: ThreeSiteModel})
  @validate.required
  public siteId: string;
  
  @type.string
  @validate.required
  public name: string = '';

  @type.string
  public description: string = '';

  @type.models({model: CheckerModuleBaseModel})
  public modulesIds: Array<string> = [];

}
