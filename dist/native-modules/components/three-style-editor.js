var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThreeStyleModel } from './../models/style.model';
import { inject, bindable, Container } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { EventAggregator } from 'aurelia-event-aggregator';
let ThreeStyleEditor = class ThreeStyleEditor {
    constructor(element) {
        this.element = element;
        this.subscriptions = [];
        this.log = getLogger('comp:three-style-editor');
    }
    detatched() {
        for (let sub of this.subscriptions) {
            sub.dispose();
        }
    }
    styleModif(prop) {
        const s = this._style;
        if (!Array.isArray(s.__editedProperties)) {
            s.__editedProperties = [];
        }
        if (!s.__editedProperties.includes(prop))
            s.__editedProperties.push(prop);
        this.notifyStyleChange();
    }
    notifyStyleChange() {
        Container.instance.get(EventAggregator).publish('three-style:update');
    }
};
__decorate([
    bindable,
    __metadata("design:type", ThreeStyleModel)
], ThreeStyleEditor.prototype, "_style", void 0);
ThreeStyleEditor = __decorate([
    inject(Element),
    __metadata("design:paramtypes", [Element])
], ThreeStyleEditor);
export { ThreeStyleEditor };

//# sourceMappingURL=three-style-editor.js.map
