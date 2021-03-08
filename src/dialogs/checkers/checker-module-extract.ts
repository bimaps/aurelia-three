import { PromptSelectDialog } from 'aurelia-resources';
import { CheckerModuleExtractModel, CheckerExtractTypeOptions } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';

@customElement('checker-module-extract')
@useView('./checker-module-extract.html')
@inject(UxModalService, Element)
export class CheckerModuleExtractElement {

  @bindable public module: CheckerModuleExtractModel;
  @bindable public keyValues: {[key: string]: Array<any>} = {};
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public extractOptions = CheckerExtractTypeOptions.map(v => {return {value: v, label: v}});

  public constructor(private modalService: UxModalService, private element: HTMLElement) {

  }

  public bind() {
    if (!this.module.extractType) {
      this.module.extractType = 'property';
    }
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
      const keyValue = `#{${result.output}}`;
      let dest = destinationObject[destinationKey].trim();
      destinationObject[destinationKey] = dest
        ? `${dest} / ${keyValue}`
        : keyValue;
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
