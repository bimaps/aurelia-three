import { ThreeSiteModel } from './site.model';
import { model, Model, type, validate, Metadata } from 'aurelia-deco';

@model('/three/checker')
export class ThreeCheckerConfigModel extends Model {

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

  @type.array({type: 'object', options: {keys: {
    key: {type: 'string'},
    operator: {type: 'select', options: ['=', '<', '>', '!=', '*']},
    value: {type: 'any'}
  }}})
  public conditions: Array<Condition> = [];

  @type.select({options: ['count' ,'compare-key-value', 'add-key-value']})
  public operation: 'count' | 'compare-key-value' | 'add-key-value';

  @type.any
  public operationSettings: any = {}

  @type.metadata
  public metadata: Array<Metadata> = [];
  
}

export interface Condition {
  key: string;
  operator: '=' | '<' | '>' | '!=' | '*';
  value: string | number | Date;
}
