import {inject} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class SidebarSection {    

  private log: Logger;
  
  constructor(private element: Element) {
    this.log = getLogger('comp:sidebar-section');
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}