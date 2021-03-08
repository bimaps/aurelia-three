import {inject, bindable} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class SidebarHeader {    

  private log: Logger;
  @bindable prev: string;
  @bindable back: boolean;
  @bindable icon: string;
  
  constructor(private element: Element) {
    this.log = getLogger('comp:sidebar-header');
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}
