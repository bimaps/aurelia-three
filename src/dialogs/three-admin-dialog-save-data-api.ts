import { inject, bindable } from 'aurelia-framework';

export interface SaveDataApiSettings {
  saveLights: boolean;
  clearApiDataBeforeSaving: boolean;
  importId: string;
}

@inject(Element)
export class ThreeAdminDialogSaveDataApi {  
  @bindable value: SaveDataApiSettings = {
    saveLights: false,
    clearApiDataBeforeSaving: false,
    importId: ''
  };
  
  constructor(private element: Element) {

  }

  bind() {
    this.valueChanged();
  }

  valueChanged() {
    if (typeof this.value !== 'object') {
      this.value = {
        saveLights: false,
        clearApiDataBeforeSaving: false,
        importId: ''
      };
    }
  }
}
