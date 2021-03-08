import { ThreeThemeRuleCondition } from './../themes/three-theme-rule';
import { ThreeCustomElement } from './three';
import { ThreeThemeModelRule } from './../models/theme.model';
import {inject, bindable, DOM} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
import { ThreeStyleModel } from '../models/style.model';
import { arDialog } from 'aurelia-resources';
import { ArDialogPromptOption } from 'aurelia-resources/dist/commonjs/elements/ar-dialog-prompt';
import * as resolvePath from 'object-resolve-path';

@inject(Element)
export class ThreeRuleEditor {    

  private log: Logger;
  @bindable private rule: ThreeThemeModelRule;
  @bindable private styles: Array<ThreeStyleModel> = [];
  @bindable private three: ThreeCustomElement;
  
  constructor(private element: Element) {
    this.log = getLogger('comp:three-theme-editor');
  }

  addStyleToRule(styleId: string) {
    if (!Array.isArray(this.rule.styles)) {
      this.rule.styles = [];
    }
    this.rule.styles.push(styleId);
    this.notifyModification();
  }

  addStyleToRule2() {
    if (!Array.isArray(this.rule.styles)) {
      this.rule.styles = [];
    }
    let options: ArDialogPromptOption[] = this.styles.filter(i => !this.rule.styles.includes(i.id)).map(i => {return {value: i.id, label: i.name}});
    let dialog = arDialog({title: 'Select a style to add', type: 'prompt', promptOptions: options});
    dialog.whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        this.rule.styles.push(result.value);
        this.notifyModification();
      }
    })
  }

  removeStyleFromRule(styleId: string) {
    if (!Array.isArray(this.rule.styles)) {
      this.rule.styles = [];
      return;
    }
    let index = this.rule.styles.indexOf(styleId);
    if (index !== -1) this.rule.styles.splice(index, 1);
    this.notifyModification();
  }

  addConditionToRule(e) {
    if (!Array.isArray(this.rule.conditions)) {
      this.rule.conditions = [];
    }
    this.rule.conditions.push({key: '', type: '=', value: ''});
    this.notifyModification();
  }

  removeConditionFromRule(index: number) {
    if (!Array.isArray(this.rule.conditions)) {
      this.rule.conditions = [];
      return;
    }
    this.rule.conditions.splice(index, 1);
    this.notifyModification();
  }

  setConditionType(condition: ThreeThemeRuleCondition, type: '<' | '>' | '=' | '!=') {
    condition.type = type;
    this.notifyModification();
  }

  styleNameFromId(styleId) {
    for (let style of this.styles) {
      if (style.id === styleId) return style.name
    }
    return '';
  }

  notifyModification() {
    let event = DOM.createCustomEvent('rule-updated', {detail: this.rule, bubbles: true});
    this.element.dispatchEvent(event);
  }

  conditionKeyHelpList(condition: ThreeThemeRuleCondition) {
    let options: ArDialogPromptOption[] = [];
    options.push({value: 'uuid', label: 'uuid'});
    options.push({value: 'name', label: 'name'});
    options.push({value: 'type', label: 'type'});
    options.push({value: 'parent.uuid', label: 'parent.uuid'});
    options.push({value: 'parent.type', label: 'parent.type'});
    options.push({value: 'parent.name', label: 'parent.name'});
    options.push({value: 'position.x', label: 'position.x'});
    options.push({value: 'position.y', label: 'position.y'});
    options.push({value: 'position.z', label: 'position.z'});
    options.push({value: 'visible', label: 'visible'});
    options.push({value: 'geometry.uuid', label: 'geometry.uuid'});
    options.push({value: 'geometry.type', label: 'geometry.type'});
    options.push({value: 'geometry.name', label: 'geometry.name'});
    options.push({value: 'material.uuid', label: 'material.uuid'});
    options.push({value: 'material.type', label: 'material.type'});
    options.push({value: 'material.name', label: 'material.name'});
    options.push({value: '__clicked', label: '__clicked'});

    if (this.three && this.three instanceof ThreeCustomElement) {
      let userDataKeys: Array<string> = [];
      let userDataKeys2: {
        [key: string]: Array<string>
      } = {};
      this.three.getScene().traverse((obj) => {
        let newKeys = Object.keys(obj.userData).filter(i => !userDataKeys.includes(i));
        let keysToAdd: Array<string> = [];
        for (let key of newKeys) {
          const value = obj.userData[key];
          if (typeof value === 'string' || typeof value === 'number') {
            keysToAdd.push(key);
          }
          if (typeof value === 'object' && !Array.isArray(value) && value !== undefined) {
            if (!userDataKeys2[key]) {
              userDataKeys2[key] = [];
            }
            let newKeys2 = Object.keys(obj.userData[key]).filter(i => !userDataKeys2[key].includes(i));
            for (let key2 of newKeys2) {
              const value2 = obj.userData[key][key2];
              if (typeof value2 === 'string' || typeof value2 === 'number') {
                userDataKeys2[key].push(key2);
              }
            }
          }
        }
        userDataKeys.push(...keysToAdd);
      });
      for (let key of userDataKeys) {
        options.push({value: `userData.${key}`, label: `userData.${key}`});
      }
      for (let key in userDataKeys2) {
        for (let key2 of userDataKeys2[key]) {
          options.push({value: `userData.${key}.${key2}`, label: `userData.${key}.${key2}`});
        }
      }
    }

    let dialog = arDialog({title: 'Key List', type: 'prompt', promptOptions: options});
    dialog.whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        condition.key = result.value;
        this.notifyModification();
      }
    })
  }

  conditionValueHelpList(condition: ThreeThemeRuleCondition) {
    let options: ArDialogPromptOption[] = [];
    
    if (this.three && this.three instanceof ThreeCustomElement) {
      let values: Array<string> = [];
      this.three.getScene().traverse((obj) => {
        let value = resolvePath(obj, condition.key);
        if (values.indexOf(value) === -1) {
          values.push(value);
        }
      });
      for (let value of values) {
        options.push({value: `${value}`, label: `${value}`});
      }
    }

    let dialog = arDialog({title: 'Value List', type: 'prompt', promptOptions: options});
    dialog.whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        condition.value = result.value;
        this.notifyModification();
      }
    })
  }
}



export class filterOutSelectedValueConverter {
  toView(array: Array<ThreeStyleModel>, selected: Array<string>, length: number): Array<ThreeStyleModel> {
    if (!selected) return array;
    return array.filter((item) => {
      return !selected.includes(item.id);
    });
  }
}
