import { ThreeObjectModel } from './../models/object.model';
import { bindable, TaskQueue, inject } from 'aurelia-framework';
import * as resolvePath from 'object-resolve-path';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
const log = getLogger('three-object-property-explorer');

type PropertiesCallback = (object: THREE.Object3D) => Array<string>;

@inject(TaskQueue)
export class ThreeObjectPropertyExplorer {
  @bindable object: THREE.Object3D;
  @bindable properties: Array<string> | PropertiesCallback = [];
  @bindable canEdit = false;

  private instance: ThreeObjectModel;
  private editDocuments = false;

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
    
    this.getDocuments();
  }

  public async getDocuments() {
    this.instance = await ThreeObjectModel.getOneWithId(this.object.userData.id);
    for (const document of this.instance.documents || []) {
      if (document.type.indexOf('image/') === 0) {
        const preview = await this.instance.getFilePreviewUrl('documents', '30:30', {fileId: document.filename});
        document.preview = preview;
      }
    }
  }

  public documentsUpdated() {
    this.getDocuments();
    this.editDocuments = false;
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

  public async downloadDocument(document: any) {
    const preview = await this.instance.getFilePreview('documents', 'original', {fileId: document.filename});

    const response = await this.instance.api.get(`${this.instance.getOneRoute(this.instance.id)}?download=documents&fileId=${document.filename}`, {etag: document.filename});
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');

  }


}
