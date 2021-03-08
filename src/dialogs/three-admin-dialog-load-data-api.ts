import { inject, bindable, bindingMode } from 'aurelia-framework';

export interface LoadDataApiSettings {
  replaceLightsIfAny: boolean;
  emptySceneBeforeLoad: boolean;
  zoomOnScene: boolean;
}

@inject(Element)
export class ThreeAdminDialogLoadDataApi {  
  @bindable value: LoadDataApiSettings = {
    replaceLightsIfAny: true,
    emptySceneBeforeLoad: true,
    zoomOnScene: true
  };
  
  constructor(private element: Element) {

  }

  bind() {
    this.valueChanged();
  }

  valueChanged() {
    if (typeof this.value !== 'object') {
      this.value = {
        replaceLightsIfAny: true,
        emptySceneBeforeLoad: true,
        zoomOnScene: true
      };
    }
  }
}
