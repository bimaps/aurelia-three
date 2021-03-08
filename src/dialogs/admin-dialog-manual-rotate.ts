import { inject, bindable } from 'aurelia-framework';

export interface ManualRotateSettings {
  constraint: 'X' | 'Y' | 'Z';
  angle: number;
  unit: 'degree' | 'radian';
}

@inject(Element)
export class AdminDialogManualRotate {  
  @bindable value: ManualRotateSettings = {
    constraint: 'X',
    angle: 0,
    unit: 'degree'
  };
  
  constructor(private element: Element) {

  }

  bind() {
    this.valueChanged();
  }

  valueChanged() {
    if (typeof this.value !== 'object') {
      this.value = {
        constraint: 'X',
        angle: 0,
        unit: 'degree'
      };
    }
  }
}
