import { CheckerModuleDistanceModel } from './../../models/checkers/checker-internals';
import { inject, useView, bindable, customElement, bindingMode } from 'aurelia-framework'
import { UxModalService } from '@aurelia-ux/modal';

@customElement('checker-module-distance')
@useView('./checker-module-distance.html')
@inject(UxModalService)
export class CheckerModuleDistanceElement {

  @bindable public module: CheckerModuleDistanceModel;
  @bindable public inputOptions: Array<string> = [];

  @bindable({defaultBindingMode: bindingMode.twoWay}) private opened = true;

  public constructor(private modalService: UxModalService) {

  }
  
  public toggle() {
    this.opened = !this.opened;
  }

}
