import { DOM } from 'aurelia-pal';
import { CheckerModuleMathModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';

@customElement('checker-module-math')
@useView('./checker-module-math.html')
@inject(UxModalService, Element)
export class CheckerModuleMathElement {

  @bindable public module: CheckerModuleMathModel;
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public constructor(private modalService: UxModalService, private element: HTMLElement) {

  }

  public triggerChange() {
    const customEvent = DOM.createCustomEvent('change', {bubbles: true});
    this.element.dispatchEvent(customEvent);
  }
  
  public toggle() {
    this.opened = !this.opened;
  }

}
