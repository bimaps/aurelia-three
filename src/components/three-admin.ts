import { AdminImportSettingsDialog } from './../dialogs/admin-import-settings-dialog';
import { AdminExportSettingsDialog } from './../dialogs/admin-export-settings-dialog';
import { ThreeObjectPrepareFiltersOptions } from './../models/object.model';
import { PointCloudOctree } from '@pnext/three-loader';
import { ThreeCheckerConfigModel } from './../models/checker-config.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel, ThreeThemeModelRule } from './../models/theme.model';
import { ThreeGenerator } from './../helpers/three-generator';
import { ThreeStylingService } from './../themes/three-styling-service';
import { ManualRotateSettings } from './../dialogs/admin-dialog-manual-rotate';
import { ThreeSelectionTool } from '../tools/three-selection-tool';
import { ThreeTranslationTool } from '../tools/three-translation-tool';
import { ThreeRotationTool } from '../tools/three-rotation-tool';
import { ThreeToolsService } from '../tools/three-tools-service';
import { SaveDataApiSettings } from '../dialogs/three-admin-dialog-save-data-api';
import { LoadDataApiSettings } from '../dialogs/three-admin-dialog-load-data-api';
import { inject, bindable, customElement, computedFrom, Container, TaskQueue} from 'aurelia-framework';
import { getLogger, Logger } from 'aurelia-logging';
import { ThreeSiteModel } from '../models/site.model';
import { ThreeCustomElement, CursorPlanesIntersects } from './three';
import { errorify, arDialog, ArNext, notify } from 'aurelia-resources';
import * as THREE from 'three';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { ThreeObjectModel } from '../models/object.model';
import { ArDialogPromptOption } from 'aurelia-resources/dist/commonjs/elements/ar-dialog-prompt';
import { adDialogModel } from 'aurelia-deco';
import { UxModalService } from '@aurelia-ux/modal';
import { ThreeCheckerConfigDialog } from '../dialogs/three-checker-config-dialog';
import { ThreeCheckerReportDialog } from '../dialogs/three-checker-report-dialog';
import { CheckerFlowModel } from '../models/checkers/checker-internals';
import { CheckerFlowDialog } from '../dialogs/checkers/checker-flow-dialog';

@customElement('three-admin-element')
@inject(Element,  UxModalService)
export class ThreeAdmin {    

  @bindable public initialSiteId: string;

  private log: Logger;
  private sites: Array<ThreeSiteModel> = []
  private currentSite: ThreeSiteModel;
  private checkers: Array<ThreeCheckerConfigModel> = [];
  private reports: Array<ThreeCheckerReportModel> = [];
  private flows: Array<CheckerFlowModel> = [];
  private themes: Array<ThreeThemeModel> = [];
  private styles: Array<ThreeStyleModel> = [];
  private displayedTheme: ThreeThemeModel; // theme used for styling the scene
  private currentTheme: ThreeThemeModel; // current theme in editor
  private currentThemeHasModifications: boolean = false;
  private currentRule: ThreeThemeModelRule;
  private currentStyle: ThreeStyleModel;
  private selectedObject: THREE.Object3D;
  private fakeSlots: HTMLElement;
  private mainButtonsContainer: HTMLElement;

  public three: ThreeCustomElement;
  private arNextMenu: ArNext;

  public toolbarCategory: 'navigation' | 'selection' | 'transform' | 'display' = 'navigation';

  private currentOperation: string = '';
  
  private mouseOnViewer: boolean = false;
  private mouseX: number | null;
  private mouseY: number | null;
  private nbObjectsUnderMouse: number = 0;

  private select: ThreeSelectionTool;
  private translate: ThreeTranslationTool;
  private rotate: ThreeRotationTool;
  private subscriptions: Array<Subscription> = [];

  /* CURSOR TOOLS */
  public cursorTool: 'select' | 'translate' | 'rotate' = 'select';
  public toolsService: ThreeToolsService;
  public stylingService: ThreeStylingService;
  
  constructor(private element: Element, private modalService: UxModalService) {
    this.log = getLogger('comp:three-admin');
  }

  attached() {
    this.log.debug('attached', this);
    this.fixSlots();
    this.toolsService = new ThreeToolsService(this.three);
    this.stylingService = new ThreeStylingService(this.three);
    this.select = new ThreeSelectionTool(this.toolsService);
    this.translate = new ThreeTranslationTool(this.toolsService);
    this.rotate = new ThreeRotationTool(this.toolsService);
    this.getSites();
    const ea = Container.instance.get(EventAggregator);
    this.subscriptions.push(ea.subscribe('three-cursor:hover', (data: THREE.Intersection[]) => {
      this.handleCursor('hover', data);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:click', (data: THREE.Intersection[]) => {
      this.handleCursor('click', data);
    }));
    this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', (data: CursorPlanesIntersects) => {
      this.rotate.handlePlanesIntersects(data);
    }));
    this.subscriptions.push(ea.subscribe('three-style:update', () => {
      if (this.displayedTheme) {
        Container.instance.get(TaskQueue).queueMicroTask(() => {
          this.displayedTheme.updateTheme(this.styles);
          this.stylingService.activate(this.displayedTheme.theme);
        });
      }
    }));
    setTimeout(() => {
      this.three.addAxis();
    }, 1000);
    
  }

  detached() {
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
  }

  fixSlots() {
    this.log.debug('fixSlots');
    Container.instance.get(TaskQueue).queueTask(() => {
      this.log.debug('elements', this.fakeSlots.querySelectorAll('[name=main-buttons]'));
      this.fakeSlots.querySelectorAll('[slot=main-buttons]').forEach((element) => {
        this.mainButtonsContainer.append(element);
      });
    });
  }

  getSites() {
    ThreeSiteModel.getAll().then((sites) => {
      this.sites = sites;
      if (this.initialSiteId) {
        for (let site of this.sites) {
          if (site.id === this.initialSiteId) {
            this.selectSite(site);
          }
        }
        location.href = location.href.replace(`siteId=${this.initialSiteId}`, '');
        this.initialSiteId = '';
      }
    }).catch(errorify);
  }

  handleError(error: Error) {
    if (this.currentOperation) this.currentOperation = '';
    errorify(error);
  }

  generate(type: 'cube' | 'groundAnd3Cubes' | 'testAllGeometries') {
    let generator = new ThreeGenerator();
    if (type === 'cube') {
      this.three.getScene().add(generator.centeredCube(10));
    } else if (type === 'groundAnd3Cubes') {
      this.three.getScene().add(generator.groundAnd3Cubes());
    } else if (type === 'testAllGeometries') {
      this.three.getScene().add(...generator.testAllGeometries());
    }
  }

  deleteSite(site: ThreeSiteModel) {
    arDialog({title: 'Delete Site ?', content: 'Are you sure that you want to delete this site and all the data related to this site in the API ?', type: 'confirmation'}).whenClosed().then((result) => {
      let deletingCurrentSite = site.id === this.currentSite.id;
      if (!result.dismissed && result.agree) {
        this.currentOperation = 'Clearing Site Data';
        return ThreeSiteModel.clearData(site.id).then(() => {
          this.currentOperation = 'Deleting Site';
          return site.remove();
        }).then(() => {
          return this.getSites();
        }).then(() => {
          if (deletingCurrentSite) {
            this.arNextMenu.autoFirst();
          }
        }).catch(error => this.handleError(error));
      }
    });
  }

  saveSiteSettings(site: ThreeSiteModel) {
    site.updateProperties('', ['name']).then((updatedSite) => {
      site.name = updatedSite.name;
    }).catch(error => this.handleError(error));
  }

  clearSiteData(siteId: string): Promise<any> {
    if (this.currentOperation) return Promise.resolve();
    return arDialog({title: 'Clear Data ?', content: 'Are you sure that you want to delete all the data related to this site in the API ?', type: 'confirmation'}).whenClosed().then((result) => {
      if (!result.dismissed && result.agree) {
        this.currentOperation = 'Clearing Site Data';
        return ThreeSiteModel.clearData(siteId).then(() => {
          this.currentOperation = '';
        }).catch(error => this.handleError(error));
      }
    });
  }

  zoomOnScene(factor: number = 1, orientation: '3d' | 'top' = '3d', animate: boolean = true, render: boolean = true) {
    this.three.navigation.zoomOnScene(factor, orientation, animate, render);
  }

  createSite() {
    arDialog({title: 'Site Name', type: 'prompt'}).whenClosed().then((result) => {
      if (result.value && !result.dismissed) {
        let newSiteId: string;
        let site = new ThreeSiteModel();
        site.name = result.value;
        site.save().then((site) => {
          newSiteId = site.id;
          this.getSites();
        }).then(() => {
          this.selectSite(newSiteId);
        }).catch(errorify);
      }
    });
  }

  renameSite(site: ThreeSiteModel) {
    let currentName = site.name;
    arDialog({title: `Rename site ${currentName}`, type: 'prompt'}).whenClosed().then((result) => {
      if (result.value && !result.dismissed) {
        site.name = result.value;
        site.updateProperties('', ['name']).then((updatedSite) => {
          site.name = updatedSite.name;
        }).catch(errorify);
      }
    });
  }

  selectSite(site: string | ThreeSiteModel) {
    if (site instanceof ThreeSiteModel) {
      this.currentSite = site;
      this.arNextMenu.nextTo('main-site');
    } else if (typeof site === 'string') {
      for (let _site of this.sites) {
        if (_site.id === site) {
          this.currentSite = _site;
          this.arNextMenu.nextTo('main-site');
        }
      }
    }
    this.getCheckers();
    this.getFlows();
    this.getReports();
    this.getStyles();
    this.getThemes();
  }

  loadSite(siteId: string) {

    arDialog({title: 'Loading Settings', type: 'prompt', promptCompName: 'three-admin-dialog-load-data-api'}).whenClosed().then((result) => {
      if (!result.dismissed) {
        this.currentOperation = 'Downloading Site Data';
        let resp: LoadDataApiSettings = result.value;
        if (resp.emptySceneBeforeLoad) this.three.objects.clearScene();
        let filters: ThreeObjectPrepareFiltersOptions = {
          // userData: {
          //   type: 'IfcWallStandardCase'
          // }
        };
        ThreeSiteModel.getSiteJson(siteId, filters).then((json) => {
          if (resp.replaceLightsIfAny && json.metadata.loadInfos.containsLighting) this.clearAllLights();
          return this.three.objects.loadJSON(json, {calculateOffsetCenter: 'never'});
        }).then(() => {
          if (resp.zoomOnScene) this.three.navigation.zoomOnScene(1);
          this.currentOperation = '';
        }).catch(error => this.handleError(error));
      }
    });
  }

  saveSceneIntoSite() {
    if (!this.currentSite) return;

    return arDialog({title: 'Saving Settings', type: 'prompt', promptCompName: 'three-admin-dialog-save-data-api'}).whenClosed().then((result) => {
      if (!result.dismissed) {
        
        let resp: SaveDataApiSettings = result.value;
        let clearPromise: Promise<any> = Promise.resolve();
        if (resp.clearApiDataBeforeSaving) {
          clearPromise = this.clearSiteData(this.currentSite.id);
        }
        clearPromise.then(() => {
          this.currentOperation = 'Uploading Site Data';
          let importId = resp.importId || undefined;
          let json = this.three.getScene().toJSON();
          return ThreeSiteModel.addJsonData(this.currentSite.id, json, {importId: importId, saveLights: resp.saveLights});
        }).then((response) => {
          this.currentOperation = '';
        }).catch(error => this.handleError(error));
      }
    });
  }

  uploadingFile: boolean = false;
  uploadDataFromFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('accept', '.ifc,.json');
    input.click();
    input.addEventListener('change', () => {
      console.dir(input);

      if (input.files && input.files.length === 1) {
        const file = input.files[0];
        if (file.name.substr(-4) === '.ifc') {
          this.uploadingFile = true;
          ThreeSiteModel.addIFCData(this.currentSite.id, file).then(() => {
            notify('Data successfuly uploaded', {timeout: 0});
          }).catch(error => this.handleError(error)).finally(() => {
            this.uploadingFile = false;
          });
        } else if (file.name.substr(-5) === '.json') {
          ThreeSiteModel.addJsonData(this.currentSite.id, file).then(() => {
            notify('Data successfuly uploaded', {timeout: 0});
          }).catch(error => this.handleError(error)).finally(() => {
            this.uploadingFile = false;
          });
        }
      }
    });
  }

  public loadingFiles: number = 0;
  loadFile() {
    Container.instance.get(TaskQueue).queueMicroTask(() => {
      let input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('accept', '.json,.obj,.mtl,.dae,.gltf');

      input.setAttribute('multiple', 'multiple');
      input.click();
      input.addEventListener('change', () => {
        console.dir(input);

        if (input.files && input.files.length) {
          let mtlFiles: Array<File> = [];
          let objFiles: Array<File> = [];
          let jsonFiles: Array<File> = [];
          let daeFiles: Array<File> = [];
          let gltfFiles: Array<File> = [];
          for (let index = 0; index < input.files.length; index++) {
            let file = input.files.item(index);
            if (file.name.substr(-4) === '.mtl') mtlFiles.push(file);
            if (file.name.substr(-4) === '.obj') objFiles.push(file);
            if (file.name.substr(-5) === '.json') jsonFiles.push(file);
            if (file.name.substr(-4) === '.dae') daeFiles.push(file);
            if (file.name.substr(-5) === '.gltf') gltfFiles.push(file);
          }



          for (let file of mtlFiles) {
            this.loadingFiles++;
            Container.instance.get(TaskQueue).queueMicroTask(() => {
              this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
            });
          }
          for (let file of objFiles) {
            this.loadingFiles++;
            Container.instance.get(TaskQueue).queueMicroTask(() => {
              this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
            });
          }
          for (let file of jsonFiles) {
            this.loadingFiles++;
            Container.instance.get(TaskQueue).queueMicroTask(() => {
              this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
            });
          }
          for (let file of daeFiles) {
            this.loadingFiles++;
            Container.instance.get(TaskQueue).queueMicroTask(() => {
              this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
            });
          }
          for (let file of gltfFiles) {
            this.loadingFiles++;
            Container.instance.get(TaskQueue).queueMicroTask(() => {
              this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
            });
          }
        }
      });
    });
  }

  selectObject(event) {
    this.log.debug('selectObject', event);
    if (event && event.srcElement instanceof HTMLElement) {
      let src: HTMLElement = event.srcElement;
      this.log.debug('event', event);
      if (src.tagName === 'INPUT' || src.parentElement.classList.contains('.ux-list-item__action-item') || src.parentElement.parentElement.classList.contains('.ux-list-item__action-item')) {
        return true;
      }
    }
    if (event.detail) {
      let object = event.detail;
      this.selectedObject = object;
      this.arNextMenu.nextTo('object-detail');
    }
  }

  saveObjectProperties(object: THREE.Object3D) {
    this.log.debug('saveObjectProperties', object);
    let obj = ThreeObjectModel.fromThreeObject(object);
    this.log.debug('obj', obj);
    this.currentOperation = 'Saving Object';
    obj.updateProperties('', ['uuid', 'name', 'type', 'matrix', 'material', 'geometry', 'userData', '_min', '_max']).then(() => {
      this.currentOperation = '';
    }).catch(error => this.handleError(error));
  }

  unselectObject() {
    this.arNextMenu.prevTo('main-site');
    this.selectedObject = undefined;
  }

  removeSelectedObject() {
    this.removeObject(this.selectedObject);
    this.unselectObject();
  }

  removeObject(object: THREE.Object3D) {
    this.three.getScene().remove(object);
  }

  clearAllLights() {
    for (let light of this.three.objects.lights) this.three.getScene().remove(light);
  }

  addAmbiantLight() {
    this.three.initLight();
  }

  addLight() {
    let lightTypes: Array<ArDialogPromptOption> = [
      {label: 'Ambiant', value: 'ambiant'},
      {label: 'Spot', value: 'spot'},
    ];
    arDialog({type: 'prompt', title: 'What kind of light ?', promptOptions: lightTypes}).whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        if (result.value === 'ambiant') {
          let light = new THREE.AmbientLight( 0x404040, 4 ); // soft white light
          this.three.getScene().add(light);
        } else if (result.value === 'spot') {
          let light = new THREE.SpotLight('#fff', 4);
          this.three.getScene().add(light);
        }
      }
    });
  }

  mouseEnter(event: MouseEvent) {
    this.mouseOnViewer = true;
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  mouseLeave(event: MouseEvent) {
    this.mouseOnViewer = false;
  }

  mouseMove(event: MouseEvent) {
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  handleCursor(type: 'hover' | 'click', intersections: THREE.Intersection[]) {
    if (type === 'hover') {
      this.nbObjectsUnderMouse = intersections.length;
    }
  }

  @computedFrom('three', 'three.objects', 'three.objects.rootObjects', 'three.objects.rootObjects.length')
  get hasObjects(): boolean {
    this.log.debug('hasObjects');
    if (!this.three) return false;
    if (!this.three.objects) return false;
    this.log.debug('...', this.three.objects.rootObjects.length > 0);
    return this.three.objects.rootObjects.length > 0;
  }

  @computedFrom('select', 'select.objects', 'select.objects.length')
  get selectedObjects(): Array<THREE.Object3D> {
    if (!this.select) return [];
    if (!this.select.objects) return [];
    return this.select.objects;
  }

  @computedFrom('three', 'three.points', 'three.points.rootPoints', 'thre.points.rootPoints.length')
  get hasPoints(): boolean {
    if (!this.three) return false;
    if (!this.three.points) return false;
    return this.three.points.rootPoints.length > 0;
  }

  @computedFrom('three', 'three.points', 'three.points.rootPoints', 'thre.points.rootPoints.length')
  get points(): Array<PointCloudOctree> {
    if (!this.three) return [];
    if (!this.three.points) return [];
    return this.three.points.rootPoints;
  }

  @computedFrom('toolsService', 'toolsService.currentToolName')
  get activeToolName(): string {
    if (!this.toolsService) return '';
    return this.toolsService.currentToolName;
  }

  @computedFrom('three', 'three.navigation', 'three.navigation.camera', 'three.navigation.observationCamera')
  get cameras(): THREE.Camera[] {
    if (!this.three) return [];
    if (!this.three.navigation) return [];
    let cameras: THREE.Camera[] = [this.three.navigation.camera];
    if (this.three.navigation.observationOn) {
      cameras.push(this.three.navigation.observationCamera);
    }
    return cameras;
  }

  manualTranslate() {

  }

  manualRotate() {
    let ad = arDialog({title: 'Manual Rotate', type: 'prompt', promptCompName: 'admin-dialog-manual-rotate'});
    ad.whenClosed().then((result) => {
      this.log.debug('result', result);
      if (!result.dismissed && result.value) {
        this.log.debug('has value');
        let response: ManualRotateSettings = result.value;
        if (response.angle) {
          this.log.debug('has angle');
          this.rotate.rotate(response.angle, response.constraint, response.unit);
        }
      }
    });
  }
  
  public selectionStyle: 'default';
  setSelectStyle() {
    Container.instance.get(TaskQueue).queueMicroTask(() => {
      this.select.setStyle(this.selectionStyle);
    });
  }

  /* POINTS SECTION */

  loadPoints() {

    arDialog({title: 'Point Clouds Name', type: 'prompt', content: `Enter the name of the Point Clouds project you want to load, such as "sextant", "cossonay", "saanen", ...`}).whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        let project = result.value;
        fetch(`https://pointclouds.example.com/${project}/folders.json`).then((result) => {
          this.log.debug('result', result);
          return result.json();
        }).then((result) => {
          this.log.debug('result', result);
          if (!Array.isArray(result)) throw new Error('Invalid folder file');
          let bbox: THREE.Box3;
          let promises: Array<Promise<any>> = [];
          for (let item of result) {
            promises.push(this.three.points.load(`https://pointclouds.example.com/${project}/${item}/`, 'cloud.js', `${project} - ${item}`).then((pco) => {
              pco.showBoundingBox = true;
              if (!bbox) {
                bbox = new THREE.Box3();
                bbox.setFromPoints([pco.boundingBox.min, pco.boundingBox.max]);
              } else {
                bbox.expandByPoint(pco.boundingBox.min);
                bbox.expandByPoint(pco.boundingBox.max);
              }
              return pco;
            }));
          }
          Promise.all(promises).then((values) => {
            this.log.debug('big bbox', bbox);
            //this.three.navigation.zoomOnBbox(bbox, 'top', true);
            this.three.points.zoomOnPco(values[0]);
          });
        }).catch(errorify);
      }
    });

  }

  zoomPoints() {
    let objects = this.three.getScene('points').children;
    if (objects.length) {
      let firstObject = objects[0] as PointCloudOctree;
      let bbox = firstObject.boundingBox;
      this.log.debug('bbox', bbox);
      this.three.navigation.zoomOnBbox(bbox, '3d', true, true);
    }
  }

  private async getCheckers() {
    this.checkers = await ThreeCheckerConfigModel.getAll(`?siteId=${this.currentSite.id}`);
  }

  private async getFlows() {
    this.flows = await CheckerFlowModel.getAll(`?siteId=${this.currentSite.id}`);
  }

  public async createNewFlow(site: ThreeSiteModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: CheckerFlowDialog,
        model: {siteId: site.id, three: this.three},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The new flow has been created');
        this.getFlows();
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async editFlow(flow: CheckerFlowModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: CheckerFlowDialog,
        model: {flow, three: this.three},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The flow has been edited');
        this.getFlows();
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async runChecker(event: MouseEvent, siteId: string, checkerId: string, pdf: boolean = false) {
    event.stopPropagation();
    let requestUrl = `/three/site/${siteId}/checker/${checkerId}/run`;
    if (pdf) {
      requestUrl += '/pdf';
    }
    try {
      const response = await ThreeSiteModel.api.get(requestUrl);
      if (response.status !== 200) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        } else {
          throw new Error('Unkown error');
        }
      }
      if (pdf) {
        const blob = await response.blob();
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "filename.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async createNewChecker(site: ThreeSiteModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: ThreeCheckerConfigDialog,
        model: {siteId: site.id, three: this.three},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The new checker has been created');
        this.getCheckers();
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async editChecker(checker: ThreeCheckerConfigModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: ThreeCheckerConfigDialog,
        model: {checker, three: this.three},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The checker has been edited');
        this.getCheckers();
      }
    } catch (error) {
      errorify(error);
    }
  }

  private async getReports() {
    this.reports = await ThreeCheckerReportModel.getAll(`?siteId=${this.currentSite.id}`);
  }

  public async runReport(event: MouseEvent, siteId: string, reportId: string, pdf: boolean = false) {
    event.stopPropagation();
    let requestUrl = `/three/checker/report/${reportId}/run`;
    if (pdf) {
      requestUrl += '?pdf=true';
    }
    try {
      const response = await ThreeCheckerReportModel.api.get(requestUrl);
      if (response.status !== 200) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        } else {
          throw new Error('Unkown error');
        }
      }
      if (pdf) {
        const blob = await response.blob();
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "filename.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async createNewReport(site: ThreeSiteModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: ThreeCheckerReportDialog,
        model: {siteId: site.id, three: this.three, flows: this.flows},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The new report has been created');
        this.getReports();
      }
    } catch (error) {
      errorify(error);
    }
  }

  public async editReport(report: ThreeCheckerReportModel) {
    try { 
      const dialog = await this.modalService.open({
        viewModel: ThreeCheckerReportDialog,
        model: {report, three: this.three, flows: this.flows},
      });
      const result = await dialog.whenClosed();
      if (!result.wasCancelled) {
        notify('The report has been edited');
        this.getReports();
      }
    } catch (error) {
      errorify(error);
    }
  }

  /* THEMES SECTION */
  arNextStyleEditor: HTMLElement;

  getThemes() {
    ThreeThemeModel.getAll(`?siteId=${this.currentSite.id}`).then((themes) => {
      this.log.debug('themes', themes);
      this.themes = themes;
    });
  }

  getStyles() {
    return ThreeStyleModel.getAll(`?siteId=${this.currentSite.id}`).then((styles) => {
      this.log.debug('styles', styles);
      this.styles = styles;
      Container.instance.get(EventAggregator).publish('three-style:update');
    });
  }

  createNewTheme() {
    arDialog({title: 'Create a theme', type: 'prompt', content: 'Theme name'}).whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        let theme = new ThreeThemeModel;
        theme.name = result.value;
        theme.siteId = this.currentSite.id;
        return theme.save().then((createdTheme) => {
          this.themes.push(createdTheme);
          this.selectTheme(createdTheme);
        });
      }
    }).catch(errorify);
  }

  arNextThemeEditor: HTMLElement;

  noTheme() {
    this.displayedTheme = undefined;
    this.stylingService.clearTheme();
  }

  displayTheme(theme: ThreeThemeModel) {
    this.displayedTheme = theme;
    theme.updateTheme(this.styles);
    this.stylingService.activate(theme.theme);
  }

  selectTheme(theme: ThreeThemeModel) {
    this.currentTheme = theme;
    this.currentThemeHasModifications = false;
    if (!this.arNextThemeEditor.classList.contains('current')) {
      this.arNextMenu.nextTo('theme-editor');
    }
    this.displayTheme(this.currentTheme);
  }

  saveTheme(theme: ThreeThemeModel) {
    let savingCurrentTheme = theme === this.currentTheme;
    if (theme instanceof ThreeThemeModel) {
      let keys = Object.keys(ThreeThemeModel.deco.propertyTypes)
      theme.updateProperties('', keys).then((updatedTheme) => {
        for (let key of keys) {
          theme[key] = updatedTheme[key];
        }
        if (savingCurrentTheme) {
          this.currentThemeHasModifications = false;
        }
        notify('Theme has been saved');
      }).catch(errorify);
    }
  }

  themeModified(theme: ThreeThemeModel) {
    let modifyCurrentTheme = theme === this.currentTheme;
    if (modifyCurrentTheme) {
      this.log.debug('modified current theme');
      theme.updateTheme(this.styles);
      this.currentThemeHasModifications = true;
      this.stylingService.activate(theme.theme);
    }
  }

  editThemeName(theme: ThreeThemeModel) {
    adDialogModel(theme, {title: 'Edit Theme Name'}, ['name']).whenClosed().then((result) => {

    }).catch(error => this.handleError(error));
  }

  deleteTheme(theme: ThreeThemeModel) {
    let deletingCurrentTheme = theme === this.currentTheme;
    if (theme instanceof ThreeThemeModel) {
      theme.remove().then(() => {
        this.getThemes();
        if (deletingCurrentTheme) {
          this.currentTheme = undefined;
          this.currentThemeHasModifications = false;
          if (this.arNextThemeEditor.classList.contains('current')) {
            this.arNextMenu.prevTo('main-site');
          }
        }
        notify('Theme has been deleted');
      }).catch(errorify);
    }
  }

  
  selectRule(rule: ThreeThemeModelRule) {
    this.currentRule = rule;
    this.arNextMenu.nextTo('rule-editor');
  }

  addRule(theme: ThreeThemeModel) {
    arDialog({title: 'Add New Rule', content: 'Rule Name', type: 'prompt'}).whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        if (!Array.isArray(theme.rules)) theme.rules = [];
        let rule = new ThreeThemeModelRule();
        rule.name = result.value;
        theme.rules.push(rule);
        this.themeModified(theme);
      }
    });
  }

  editRuleName(theme: ThreeThemeModel, rule: ThreeThemeModelRule) {
    let ruleIndex = theme.rules.indexOf(rule);
    if (ruleIndex === -1) {
      errorify(new Error('Rule not found'));
      return;
    }
    // todo: rule name editor
    // maybe we can place the rule name inside the rule editor
  }

  deleteRule(theme: ThreeThemeModel, rule: ThreeThemeModelRule) {
    let ruleIndex = theme.rules.indexOf(rule);
    if (ruleIndex === -1) {
      errorify(new Error('Rule not found'));
      return;
    }
    theme.rules.splice(ruleIndex, 1);
    this.themeModified(theme);    
    this.arNextMenu.autoPrev();
  }

  selectStyle(style: ThreeStyleModel) {
    this.currentStyle = style;
    this.arNextMenu.nextTo('style-editor');
  }

  createNewStyle() {
    arDialog({title: 'Add New Style', content: 'Style Name', type: 'prompt'}).whenClosed().then((result) => {
      if (!result.dismissed && result.value) {
        let style = new ThreeStyleModel();
        style.siteId = this.currentSite.id;
        style.name = result.value;
        style.save().then(() => this.getStyles()).catch(errorify);
      }
    });
  }

  saveStyle(style: ThreeStyleModel, index: number) {
    const s: any = style;
    if (!Array.isArray(s.__editedProperties)) {
      s.__editedProperties = [];
    }
    this.log.debug('prop', s.__editedProperties);
    this.log.debug('style', style);
    style.updateProperties('', s.__editedProperties).then(() => {
      this.getStyles();
      s.__editedProperties = [];
    }).catch(errorify);
  }

  deleteStyle(style: ThreeStyleModel) {
    arDialog({title: 'Delete Style', content: 'Do you confirm that you want to permanently delete this style ?', type: 'confirmation'}).whenClosed().then((result) => {
      if (!result.dismissed && result.agree) {
        style.remove().then(() => {
          this.getStyles();
          // this.getStyles();
        }).catch(errorify);
      }
    })
  }

  public openViewer(){
    let win = window.open("/viewer/" + this.currentSite.id , '_blank');
    win.focus();
  }

  public exportSettings() {
    this.modalService.open({
      viewModel: AdminExportSettingsDialog,
      model: {siteId: this.currentSite.id}
    });
  }

  public async importSettings() {
    const dialog = await this.modalService.open({
      viewModel: AdminImportSettingsDialog,
      model: {siteId: this.currentSite.id}
    });
    const response = await dialog.whenClosed();
    if (!response.wasCancelled) {
      this.getCheckers();
      this.getReports();
      this.getStyles();
      this.getThemes();
    }
  }

  

}
