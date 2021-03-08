import { ThreeStyleModel } from './../models/style.model';
import { inject, bindable, Container} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
//import { DOM } from 'aurelia-pal';

@inject(Element)
export class ThreeStyleEditor {    

  private log: Logger;
  @bindable private _style: ThreeStyleModel;
  private subscriptions: Array<Subscription> = [];
  
  constructor(private element: Element) {
    this.log = getLogger('comp:three-style-editor');
  }

  detatched() {
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
  }

  styleModif(prop: string) {
    const s: any = this._style;
    if (!Array.isArray(s.__editedProperties)) {
      s.__editedProperties = [];
    }
    if (!s.__editedProperties.includes(prop)) s.__editedProperties.push(prop);
    this.notifyStyleChange();
  }

  notifyStyleChange() {
    Container.instance.get(EventAggregator).publish('three-style:update');
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}
