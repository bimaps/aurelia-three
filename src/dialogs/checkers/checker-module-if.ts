import { CheckerModuleIfModel, CheckerValueCondition } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';

@customElement('checker-module-if')
@useView('./checker-module-if.html')
@inject(UxModalService, Element)
export class CheckerModuleIfElement {

  @bindable public module: CheckerModuleIfModel;
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public constructor(private modalService: UxModalService, private element: HTMLElement) {

  }

  public bind() {
    if (!Array.isArray(this.module.operations)) {
      this.module.operations = [];
    }
  }

  public setConditionType(condition: CheckerValueCondition, operation: '<' | '>' | '=' | '!=') {
    condition.operation = operation;
    this.triggerChange();
  }

  public addOperation() {
    this.module.operations.push({
      outputValue: '',
      conditions: [],
      conditionsOperator: 'and',
      outputStyle: 'default'
    });
    this.triggerChange();
  }

  public removeOperation(index: string) {
    const i = parseInt(index, 10);
    this.module.operations.splice(i, 1);
    this.triggerChange();
  }
  
  public addCondition(operationIndex: string) {
    const oi = parseInt(operationIndex, 10);
    this.module.operations[oi].conditions.push({
      operation: '=',
      value: ''
    });
    this.triggerChange();
  }

  public removeCondition(operationIndex: string, conditionIndex: string) {
    const oi = parseInt(operationIndex, 10);
    const ci = parseInt(conditionIndex, 10);
    this.module.operations[oi].conditions.splice(ci, 1);
    this.triggerChange();
  }

  public triggerChange() {
    const customEvent = DOM.createCustomEvent('change', {bubbles: true});
    this.element.dispatchEvent(customEvent);
  }
  
  public toggle() {
    this.opened = !this.opened;
  }

}
