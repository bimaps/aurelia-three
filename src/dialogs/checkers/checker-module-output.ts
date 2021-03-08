import { CheckerModuleOutputModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';

@customElement('checker-module-output')
@useView('./checker-module-output.html')
@inject(UxModalService, Element)
export class CheckerModuleOutputElement {

  @bindable public module: CheckerModuleOutputModel;
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public constructor(private modalService: UxModalService, private element: HTMLElement) {

  }

  public addOutput() {
    this.module.outputs.push({
      prefix: '',
      varName: '',
      display: 'paragraph',
      suffix: ''
    });
    this.triggerChange();
  }

  public removeOutput(index: string) {
    const i = parseInt(index, 10);
    this.module.outputs.splice(i, 1);
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
