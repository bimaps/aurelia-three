import { bindable, TaskQueue, inject } from 'aurelia-framework';
import * as resolvePath from 'object-resolve-path';
import { getLogger } from 'aurelia-logging';
const log = getLogger('three-object-property-explorer');

type PropertiesCallback = (object: THREE.Object3D) => Array<string>;

@inject(TaskQueue)
export class ThreeObjectPropertyExplorer {
  @bindable object: THREE.Object3D;
  @bindable properties: Array<string> | PropertiesCallback = [];

  private ready: boolean = false;
  private props: Array<string> = [];

  constructor(private taskQueue: TaskQueue) {

  }

  public bind() {
    this.objectChanged();
    this.propertiesChanged();
  }

  public objectChanged() {
    this.ready = false;
    this.taskQueue.queueTask(() => {
      this.ready = true;
    });
    log.debug('object', this.object);
  }

  public propertiesChanged() {
    const props = [];

    const properties = Array.isArray(this.properties) ? this.properties : this.properties(this.object);

    for (let prop of properties) {
      if (prop.substr(-2) === '.*') {
        const key = prop.substr(0, prop.length - 2);
        const value = resolvePath(this.object, key);
        if (typeof value !== 'object') {
          continue;
        }
        const subKeys = Object.keys(value);
        for (let subKey of subKeys) {
          props.push(`${key}["${subKey}"]`);
        }
      } else {
        props.push(prop);
      }
    }
    this.props = props;
  }

  public value(prop: string) {
    const anyValue = resolvePath(this.object, prop);
    if (typeof anyValue === 'string' || typeof anyValue === 'number') {
      return anyValue;
    } else if (typeof anyValue === 'boolean') {
      return anyValue ? 'Yes' : 'No';
    } else {
      return typeof anyValue;
    }
  }

  public label(prop: string) {
    return prop.replace('["', '.').replace('"]', '').split('.').join(' ');
  }


}
