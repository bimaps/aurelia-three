import { CheckerModuleReducerModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';
import { DOM } from 'aurelia-pal';

@customElement('checker-module-reducer')
@useView('./checker-module-reducer.html')
@inject(UxModalService, Element)
export class CheckerModuleReducerElement {

  @bindable public module: CheckerModuleReducerModel;
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
