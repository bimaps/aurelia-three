import {inject, computedFrom} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class SidebarContent {    

  private log: Logger;
  private parentElement: HTMLElement = document.createElement('div');
  private headerElement: HTMLElement = document.createElement('div');
  private footerElement: HTMLElement = document.createElement('div');

  constructor(private element: Element) {
    this.log = getLogger('comp:sidebar-content');
  }

  attached() {
    // search for headerElement
    this.parentElement = this.element.parentElement;
    let header = this.element.parentElement.querySelector('.sidebar-header');
    if (header instanceof HTMLElement) {
      this.headerElement = header;
    }
    let footer = this.element.parentElement.querySelector('.sidebar-footer');
    if (footer instanceof HTMLElement) {
      this.footerElement = footer;
    }
  }

  @computedFrom('parentElement', 'headerElement', 'footerElement', 'parentElement.offsetHeight', 'headerElement.offsetHeight', 'footerElement.offsetHeight')
  get height(): number {
    return this.parentElement.offsetHeight - this.headerElement.offsetHeight - this.footerElement.offsetHeight;
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}
