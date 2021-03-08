import { ThreeToolsService } from './three-tools-service'
import { ThreeCustomElement } from '../components/three';
import { Container, TaskQueue } from 'aurelia-framework';

export class ThreeTool {

  public name: string;
  public service: ThreeToolsService;
  public active: boolean = false;
  public three: ThreeCustomElement;
  
  constructor(service: ThreeToolsService) {
    (Container.instance.get(TaskQueue) as TaskQueue).queueMicroTask(() => {
      this.service = service;
      if (this.canRegister()) {
        this.service.registerTool(this);
      }
    })
    return this;
  }

  public canRegister() {
    return true;
  }

  public activate(three: ThreeCustomElement) {
    this.three = three;
    this.active = true;
    this.onActivate();
  }

  public deactivate() {
    this.onDeactivate();
    this.active = false;
  }

  public onActivate() {

  }

  public onDeactivate() {

  }
}
