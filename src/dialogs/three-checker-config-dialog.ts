import { ThreeCustomElement } from './../components/three';
import { ThreeCheckerConfigModel, Condition } from './../models/checker-config.model';
import { UxModalService, UxModalServiceResult} from '@aurelia-ux/modal'
import { errorify, ConfirmDialog } from 'aurelia-resources';
import { inject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { PromptSelectDialog } from 'aurelia-resources';
import * as resolvePath from 'object-resolve-path';
const log = getLogger('category-dialog');

@inject(UxModalService)
export class ThreeCheckerConfigDialog {

  public mode: 'create' | 'edit' = 'create';
  public siteId: string;
  public checker: ThreeCheckerConfigModel;
  public name: string;
  public three: ThreeCustomElement;

  constructor(private modalService: UxModalService) {
    
  }

  public activate(params: any) {
    if (params.siteId) {
      this.siteId = params.siteId;
    }
    if (params.three && params.three instanceof ThreeCustomElement) {
      this.three = params.three;
    }
    if (params.checker && params.checker instanceof ThreeCheckerConfigModel) {
      this.checker = params.checker;
      this.siteId = this.checker.siteId;
      this.mode = 'edit';
    } else {
      this.checker = new ThreeCheckerConfigModel();
      this.checker.siteId = this.siteId;
      this.mode = 'create';
    }
  }

  public async canDeactivate(result: UxModalServiceResult) {
    if (result.wasCancelled) {
      return true;
    }
    if (result.output === 'remove') {
      const confirm = await this.modalService.open({
        viewModel: ConfirmDialog,
        model: {title: 'Are you sure ?', text: `Remove the checker ${this.checker.name} ?`}
      })
      const confirmResult = await confirm.whenClosed();
      if (!confirmResult.wasCancelled) {
        this.remove();
      }
      return;
    }
    const validationResult = await this.checker.validationController.validate();
    if (!validationResult.valid) {
      for (let result of validationResult.results) {
        if (!result.valid) {
          errorify(new Error(result.message));
        }
      }
      return false;
    }
    try {
      const category = await this.save();
      result.output = category;
    } catch (error) {
      errorify(error);
      return false;
    }
  }

  public async save(): Promise<ThreeCheckerConfigModel> {
    let checker: ThreeCheckerConfigModel;
    if (this.mode === 'create') {
      checker = await this.checker.save();
    } else {
      checker = await this.checker.updateProperties('', Object.keys(this.checker));
    }
    return checker;
  }

  public async remove(): Promise<void> {
    if (this.mode === 'edit') {
      await this.checker.remove();
    }
  }

  public addCondition() {
    this.checker.conditions.push({
      key: '',
      operator: '=',
      value: ''
    });
  }

  public removeCondition(index: string) {
    const i = parseInt(index, 10);
    this.checker.conditions.splice(i, 1);
  }

  public setConditionType(condition: Condition, operator: '<' | '>' | '=' | '!=') {
    condition.operator = operator;
  }

  public async keyHelperList(destinationObject: any, destinationKey: string) {
    const currentValue = destinationObject[destinationKey];
    let options: Array<{value: string, label: string}> = [];
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
    const dialog = await this.modalService.open({
      viewModel: PromptSelectDialog,
      model: {
        options: options,
        autoClose: true,
        required: false,
        mode: 'single',
        labelKey: 'label',
        valueKey: 'value',
        value: currentValue
      }
    });
    const result = await dialog.whenClosed();
    if (!result.wasCancelled && result.output) {
      destinationObject[destinationKey] = result.output;
    }
  }

  public async valueHelperList(key: string, destinationObject: any, destinationKey: string) {
    if (!key) return;
    const currentValue = destinationObject[destinationKey];
    let options: Array<{value: string, label: string}> = [];
    
    if (this.three && this.three instanceof ThreeCustomElement) {
      let values: Array<string> = [];
      this.three.getScene().traverse((obj) => {
        let value = resolvePath(obj, key);
        if (values.indexOf(value) === -1) {
          values.push(value);
        }
      });
      for (let value of values) {
        options.push({value: `${value}`, label: `${value}`});
      }
    }

    const dialog = await this.modalService.open({
      viewModel: PromptSelectDialog,
      model: {
        options: options,
        autoClose: true,
        required: false,
        mode: 'single',
        labelKey: 'label',
        valueKey: 'value',
        value: currentValue
      }
    });
    const result = await dialog.whenClosed();
    if (!result.wasCancelled && result.output) {
      destinationObject[destinationKey] = result.output;
    }
  }

  public async expressionBuilder() {
    const options: Array<{value: string, label: string}> = [
      {label: 'Average', value: 'average'},
      {label: 'Percent', value: 'percent'},
    ];
    const dialog = await this.modalService.open({
      viewModel: PromptSelectDialog,
      model: {
        options: options,
        autoClose: true,
        required: false,
        mode: 'single',
        labelKey: 'label',
        valueKey: 'value',
        value: ''
      }
    });
    const result = await dialog.whenClosed();
    if (!result.wasCancelled && result.output) {
      if (result.output === 'average') {
        this.checker.operationSettings.expression = `value / nbItems`;
      } else if (result.output === 'percent') {
        this.checker.operationSettings.expression = `value * 0.5`;
      }
    }
  }
}
