import {inject, bindable} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class SidebarButtons {    

  private log: Logger;
  @bindable align: 'center' | 'left' | 'right' = 'center';
  
  constructor(private element: Element) {
    this.log = getLogger('comp:sidebar-buttons');
  }

  get justify(): string {
    if (this.align === 'center') return 'center';
    else if (this.align === 'left') return 'flex-start';
    else if (this.align === 'right') return 'flex-end';
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}
