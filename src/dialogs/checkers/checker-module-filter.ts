import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerModuleFilterModel, CheckerObjectCondition } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';

@customElement('checker-module-filter')
@useView('./checker-module-filter.html')
@inject(UxModalService, Element)
export class CheckerModuleFilterElement {

  @bindable public module: CheckerModuleFilterModel;
  @bindable public keyValues: {[key: string]: Array<any>} = {};
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public constructor(private modalService: UxModalService, private element: HTMLElement) {

  }

  public bind() {
    if (!Array.isArray(this.module.conditions)) {
      this.module.conditions = [];
    }
    if (this.module.conditionsOperator !== 'and' && this.module.conditionsOperator !== 'or') {
      this.module.conditionsOperator = 'and';
    }
  }

  public addCondition() {
    this.module.conditions.push({
      key: '',
      operation: '=',
      value: ''
    });
    this.triggerChange();
  }

  public removeCondition(index: string) {
    const i = parseInt(index, 10);
    this.module.conditions.splice(i, 1);
    this.triggerChange();
  }
  
  public setConditionType(condition: CheckerObjectCondition, operation: '<' | '>' | '=' | '!=') {
    condition.operation = operation;
    this.triggerChange();
  }

  public async keyHelperList(destinationObject: any, destinationKey: string) {
    const currentValue = destinationObject[destinationKey];
    let options: Array<string> = [];
    for (const key in this.keyValues) {
      options.push(key);
    }

    const dialog = await this.modalService.open({
      viewModel: PromptSelectDialog,
      model: {
        options: options,
        autoClose: true,
        required: false,
        mode: 'single',
        value: currentValue
      }
    });
    const result = await dialog.whenClosed();
    if (!result.wasCancelled && result.output) {
      destinationObject[destinationKey] = result.output;
    }
  }

  public async valueHelperList(key: string, destinationObject: any, destinationKey: string) {
    if (!key) return;
    const currentValue = destinationObject[destinationKey];
    let options: Array<string> = this.keyValues[key] || [];

    const dialog = await this.modalService.open({
      viewModel: PromptSelectDialog,
      model: {
        options: options,
        autoClose: true,
        required: false,
        mode: 'single',
        value: currentValue
      }
    });
    const result = await dialog.whenClosed();
    if (!result.wasCancelled && result.output) {
      destinationObject[destinationKey] = result.output;
    }
  }

  public triggerChange() {
    const customEvent = DOM.createCustomEvent('change', {bubbles: true});
    this.element.dispatchEvent(customEvent);
  }
  
  public toggle() {
    this.opened = !this.opened;
  }
}
