import {inject, bindable} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class SidebarSectionHeader {    

  private log: Logger;
  @bindable private opened: boolean = false;
  
  constructor(private element: Element) {
    this.log = getLogger('comp:sidebar-section-header');
  }

  private toggle() {
    this.opened = !this.opened;
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}
