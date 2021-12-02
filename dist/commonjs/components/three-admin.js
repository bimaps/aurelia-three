"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeAdmin = void 0;
const admin_import_settings_dialog_1 = require("./../dialogs/admin-import-settings-dialog");
const admin_export_settings_dialog_1 = require("./../dialogs/admin-export-settings-dialog");
const checker_config_model_1 = require("./../models/checker-config.model");
const checker_report_model_1 = require("./../models/checker-report.model");
const style_model_1 = require("./../models/style.model");
const theme_model_1 = require("./../models/theme.model");
const three_generator_1 = require("./../helpers/three-generator");
const three_styling_service_1 = require("./../themes/three-styling-service");
const three_selection_tool_1 = require("../tools/three-selection-tool");
const three_translation_tool_1 = require("../tools/three-translation-tool");
const three_rotation_tool_1 = require("../tools/three-rotation-tool");
const three_tools_service_1 = require("../tools/three-tools-service");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_logging_1 = require("aurelia-logging");
const site_model_1 = require("../models/site.model");
const aurelia_resources_1 = require("aurelia-resources");
const THREE = require("three");
const aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
const object_model_1 = require("../models/object.model");
const aurelia_deco_1 = require("aurelia-deco");
const modal_1 = require("@aurelia-ux/modal");
const three_checker_config_dialog_1 = require("../dialogs/three-checker-config-dialog");
const three_checker_report_dialog_1 = require("../dialogs/three-checker-report-dialog");
const checker_internals_1 = require("../models/checkers/checker-internals");
const checker_flow_dialog_1 = require("../dialogs/checkers/checker-flow-dialog");
let ThreeAdmin = class ThreeAdmin {
    constructor(element, modalService) {
        this.element = element;
        this.modalService = modalService;
        this.sites = [];
        this.checkers = [];
        this.reports = [];
        this.flows = [];
        this.themes = [];
        this.styles = [];
        this.currentThemeHasModifications = false;
        this.toolbarCategory = 'navigation';
        this.currentOperation = '';
        this.mouseOnViewer = false;
        this.nbObjectsUnderMouse = 0;
        this.subscriptions = [];
        this.cursorTool = 'select';
        this.uploadingFile = false;
        this.loadingFiles = 0;
        this.log = aurelia_logging_1.getLogger('comp:three-admin');
    }
    attached() {
        this.log.debug('attached', this);
        this.fixSlots();
        this.toolsService = new three_tools_service_1.ThreeToolsService(this.three);
        this.stylingService = new three_styling_service_1.ThreeStylingService(this.three);
        this.select = new three_selection_tool_1.ThreeSelectionTool(this.toolsService);
        this.translate = new three_translation_tool_1.ThreeTranslationTool(this.toolsService);
        this.rotate = new three_rotation_tool_1.ThreeRotationTool(this.toolsService);
        this.getSites();
        const ea = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:hover', (data) => {
            this.handleCursor('hover', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:click', (data) => {
            this.handleCursor('click', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', (data) => {
            this.rotate.handlePlanesIntersects(data);
        }));
        this.subscriptions.push(ea.subscribe('three-style:update', () => {
            if (this.displayedTheme) {
                aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
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
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueTask(() => {
            this.log.debug('elements', this.fakeSlots.querySelectorAll('[name=main-buttons]'));
            this.fakeSlots.querySelectorAll('[slot=main-buttons]').forEach((element) => {
                this.mainButtonsContainer.append(element);
            });
        });
    }
    getSites() {
        site_model_1.ThreeSiteModel.getAll().then((sites) => {
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
        }).catch(aurelia_resources_1.errorify);
    }
    handleError(error) {
        if (this.currentOperation)
            this.currentOperation = '';
        aurelia_resources_1.errorify(error);
    }
    generate(type) {
        let generator = new three_generator_1.ThreeGenerator();
        if (type === 'cube') {
            this.three.getScene().add(generator.centeredCube(10));
        }
        else if (type === 'groundAnd3Cubes') {
            this.three.getScene().add(generator.groundAnd3Cubes());
        }
        else if (type === 'testAllGeometries') {
            this.three.getScene().add(...generator.testAllGeometries());
        }
    }
    deleteSite(site) {
        aurelia_resources_1.arDialog({ title: 'Delete Site ?', content: 'Are you sure that you want to delete this site and all the data related to this site in the API ?', type: 'confirmation' }).whenClosed().then((result) => {
            let deletingCurrentSite = site.id === this.currentSite.id;
            if (!result.dismissed && result.agree) {
                this.currentOperation = 'Clearing Site Data';
                return site_model_1.ThreeSiteModel.clearData(site.id).then(() => {
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
    saveSiteSettings(site) {
        site.updateProperties('', ['name']).then((updatedSite) => {
            site.name = updatedSite.name;
        }).catch(error => this.handleError(error));
    }
    clearSiteData(siteId) {
        if (this.currentOperation)
            return Promise.resolve();
        return aurelia_resources_1.arDialog({ title: 'Clear Data ?', content: 'Are you sure that you want to delete all the data related to this site in the API ?', type: 'confirmation' }).whenClosed().then((result) => {
            if (!result.dismissed && result.agree) {
                this.currentOperation = 'Clearing Site Data';
                return site_model_1.ThreeSiteModel.clearData(siteId).then(() => {
                    this.currentOperation = '';
                }).catch(error => this.handleError(error));
            }
        });
    }
    zoomOnScene(factor = 1, orientation = '3d', animate = true, render = true) {
        this.three.navigation.zoomOnScene(factor, orientation, animate, render);
    }
    createSite() {
        aurelia_resources_1.arDialog({ title: 'Site Name', type: 'prompt' }).whenClosed().then((result) => {
            if (result.value && !result.dismissed) {
                let newSiteId;
                let site = new site_model_1.ThreeSiteModel();
                site.name = result.value;
                site.save().then((site) => {
                    newSiteId = site.id;
                    this.getSites();
                }).then(() => {
                    this.selectSite(newSiteId);
                }).catch(aurelia_resources_1.errorify);
            }
        });
    }
    renameSite(site) {
        let currentName = site.name;
        aurelia_resources_1.arDialog({ title: `Rename site ${currentName}`, type: 'prompt' }).whenClosed().then((result) => {
            if (result.value && !result.dismissed) {
                site.name = result.value;
                site.updateProperties('', ['name']).then((updatedSite) => {
                    site.name = updatedSite.name;
                }).catch(aurelia_resources_1.errorify);
            }
        });
    }
    selectSite(site) {
        if (site instanceof site_model_1.ThreeSiteModel) {
            this.currentSite = site;
            this.arNextMenu.nextTo('main-site');
        }
        else if (typeof site === 'string') {
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
    loadSite(siteId) {
        aurelia_resources_1.arDialog({ title: 'Loading Settings', type: 'prompt', promptCompName: 'three-admin-dialog-load-data-api' }).whenClosed().then((result) => {
            if (!result.dismissed) {
                this.currentOperation = 'Downloading Site Data';
                let resp = result.value;
                if (resp.emptySceneBeforeLoad)
                    this.three.objects.clearScene();
                let filters = {};
                site_model_1.ThreeSiteModel.getSiteJson(siteId, filters).then((json) => {
                    if (resp.replaceLightsIfAny && json.metadata.loadInfos.containsLighting)
                        this.clearAllLights();
                    return this.three.objects.loadJSON(json, { calculateOffsetCenter: 'never' });
                }).then(() => {
                    if (resp.zoomOnScene)
                        this.three.navigation.zoomOnScene(1);
                    this.currentOperation = '';
                }).catch(error => this.handleError(error));
            }
        });
    }
    saveSceneIntoSite() {
        if (!this.currentSite)
            return;
        return aurelia_resources_1.arDialog({ title: 'Saving Settings', type: 'prompt', promptCompName: 'three-admin-dialog-save-data-api' }).whenClosed().then((result) => {
            if (!result.dismissed) {
                let resp = result.value;
                let clearPromise = Promise.resolve();
                if (resp.clearApiDataBeforeSaving) {
                    clearPromise = this.clearSiteData(this.currentSite.id);
                }
                clearPromise.then(() => {
                    this.currentOperation = 'Uploading Site Data';
                    let importId = resp.importId || undefined;
                    let json = this.three.getScene().toJSON();
                    return site_model_1.ThreeSiteModel.addJsonData(this.currentSite.id, json, { importId: importId, saveLights: resp.saveLights });
                }).then((response) => {
                    this.currentOperation = '';
                }).catch(error => this.handleError(error));
            }
        });
    }
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
                    site_model_1.ThreeSiteModel.addIFCData(this.currentSite.id, file).then(() => {
                        aurelia_resources_1.notify('Data successfuly uploaded', { timeout: 0 });
                    }).catch(error => this.handleError(error)).finally(() => {
                        this.uploadingFile = false;
                    });
                }
                else if (file.name.substr(-5) === '.json') {
                    site_model_1.ThreeSiteModel.addJsonData(this.currentSite.id, file).then(() => {
                        aurelia_resources_1.notify('Data successfuly uploaded', { timeout: 0 });
                    }).catch(error => this.handleError(error)).finally(() => {
                        this.uploadingFile = false;
                    });
                }
            }
        });
    }
    loadFile() {
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
            let input = document.createElement('input');
            input.type = 'file';
            input.setAttribute('accept', '.json,.obj,.mtl,.dae,.gltf');
            input.setAttribute('multiple', 'multiple');
            input.click();
            input.addEventListener('change', () => {
                console.dir(input);
                if (input.files && input.files.length) {
                    let mtlFiles = [];
                    let objFiles = [];
                    let jsonFiles = [];
                    let daeFiles = [];
                    let gltfFiles = [];
                    for (let index = 0; index < input.files.length; index++) {
                        let file = input.files.item(index);
                        if (file.name.substr(-4) === '.mtl')
                            mtlFiles.push(file);
                        if (file.name.substr(-4) === '.obj')
                            objFiles.push(file);
                        if (file.name.substr(-5) === '.json')
                            jsonFiles.push(file);
                        if (file.name.substr(-4) === '.dae')
                            daeFiles.push(file);
                        if (file.name.substr(-5) === '.gltf')
                            gltfFiles.push(file);
                    }
                    for (let file of mtlFiles) {
                        this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
                            this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
                        });
                    }
                    for (let file of objFiles) {
                        this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
                            this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
                        });
                    }
                    for (let file of jsonFiles) {
                        this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
                            this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
                        });
                    }
                    for (let file of daeFiles) {
                        this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
                            this.three.objects.loadFile(file).finally(() => this.loadingFiles--);
                        });
                    }
                    for (let file of gltfFiles) {
                        this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
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
            let src = event.srcElement;
            this.log.debug('event', event);
            if (src.tagName === 'INPUT' || src.parentElement.classList.contains('.ux-list-item__action-item') || src.parentElement.parentElement.classList.contains('.ux-list-item__action-item')) {
                return true;
            }
        }
        if (event.detail) {
            let object = event.detail;
            this.selectedObject = object;
            this.arNextMenu.nextTo('object-detail');
        }
    }
    saveObjectProperties(object) {
        this.log.debug('saveObjectProperties', object);
        let obj = object_model_1.ThreeObjectModel.fromThreeObject(object);
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
    removeObject(object) {
        this.three.getScene().remove(object);
    }
    clearAllLights() {
        for (let light of this.three.objects.lights)
            this.three.getScene().remove(light);
    }
    addAmbiantLight() {
        this.three.initLight();
    }
    addLight() {
        let lightTypes = [
            { label: 'Ambiant', value: 'ambiant' },
            { label: 'Spot', value: 'spot' },
        ];
        aurelia_resources_1.arDialog({ type: 'prompt', title: 'What kind of light ?', promptOptions: lightTypes }).whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                if (result.value === 'ambiant') {
                    let light = new THREE.AmbientLight(0x404040, 4);
                    this.three.getScene().add(light);
                }
                else if (result.value === 'spot') {
                    let light = new THREE.SpotLight('#fff', 4);
                    this.three.getScene().add(light);
                }
            }
        });
    }
    mouseEnter(event) {
        this.mouseOnViewer = true;
        this.mouseX = event.x;
        this.mouseY = event.y;
    }
    mouseLeave(event) {
        this.mouseOnViewer = false;
    }
    mouseMove(event) {
        this.mouseX = event.x;
        this.mouseY = event.y;
    }
    handleCursor(type, intersections) {
        if (type === 'hover') {
            this.nbObjectsUnderMouse = intersections.length;
        }
    }
    get hasObjects() {
        this.log.debug('hasObjects');
        if (!this.three)
            return false;
        if (!this.three.objects)
            return false;
        this.log.debug('...', this.three.objects.rootObjects.length > 0);
        return this.three.objects.rootObjects.length > 0;
    }
    get selectedObjects() {
        if (!this.select)
            return [];
        if (!this.select.objects)
            return [];
        return this.select.objects;
    }
    get hasPoints() {
        if (!this.three)
            return false;
        if (!this.three.points)
            return false;
        return this.three.points.rootPoints.length > 0;
    }
    get points() {
        if (!this.three)
            return [];
        if (!this.three.points)
            return [];
        return this.three.points.rootPoints;
    }
    get activeToolName() {
        if (!this.toolsService)
            return '';
        return this.toolsService.currentToolName;
    }
    get cameras() {
        if (!this.three)
            return [];
        if (!this.three.navigation)
            return [];
        let cameras = [this.three.navigation.camera];
        if (this.three.navigation.observationOn) {
            cameras.push(this.three.navigation.observationCamera);
        }
        return cameras;
    }
    manualTranslate() {
    }
    manualRotate() {
        let ad = aurelia_resources_1.arDialog({ title: 'Manual Rotate', type: 'prompt', promptCompName: 'admin-dialog-manual-rotate' });
        ad.whenClosed().then((result) => {
            this.log.debug('result', result);
            if (!result.dismissed && result.value) {
                this.log.debug('has value');
                let response = result.value;
                if (response.angle) {
                    this.log.debug('has angle');
                    this.rotate.rotate(response.angle, response.constraint, response.unit);
                }
            }
        });
    }
    setSelectStyle() {
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
            this.select.setStyle(this.selectionStyle);
        });
    }
    loadPoints() {
        aurelia_resources_1.arDialog({ title: 'Point Clouds Name', type: 'prompt', content: `Enter the name of the Point Clouds project you want to load, such as "sextant", "cossonay", "saanen", ...` }).whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                let project = result.value;
                fetch(`https://pointclouds.example.com/${project}/folders.json`).then((result) => {
                    this.log.debug('result', result);
                    return result.json();
                }).then((result) => {
                    this.log.debug('result', result);
                    if (!Array.isArray(result))
                        throw new Error('Invalid folder file');
                    let bbox;
                    let promises = [];
                    for (let item of result) {
                        promises.push(this.three.points.load(`https://pointclouds.example.com/${project}/${item}/`, 'cloud.js', `${project} - ${item}`).then((pco) => {
                            pco.showBoundingBox = true;
                            if (!bbox) {
                                bbox = new THREE.Box3();
                                bbox.setFromPoints([pco.boundingBox.min, pco.boundingBox.max]);
                            }
                            else {
                                bbox.expandByPoint(pco.boundingBox.min);
                                bbox.expandByPoint(pco.boundingBox.max);
                            }
                            return pco;
                        }));
                    }
                    Promise.all(promises).then((values) => {
                        this.log.debug('big bbox', bbox);
                        this.three.points.zoomOnPco(values[0]);
                    });
                }).catch(aurelia_resources_1.errorify);
            }
        });
    }
    zoomPoints() {
        let objects = this.three.getScene('points').children;
        if (objects.length) {
            let firstObject = objects[0];
            let bbox = firstObject.boundingBox;
            this.log.debug('bbox', bbox);
            this.three.navigation.zoomOnBbox(bbox, '3d', true, true);
        }
    }
    getCheckers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkers = yield checker_config_model_1.ThreeCheckerConfigModel.getAll(`?siteId=${this.currentSite.id}`);
        });
    }
    getFlows() {
        return __awaiter(this, void 0, void 0, function* () {
            this.flows = yield checker_internals_1.CheckerFlowModel.getAll(`?siteId=${this.currentSite.id}`);
        });
    }
    createNewFlow(site) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: checker_flow_dialog_1.CheckerFlowDialog,
                    model: { siteId: site.id, three: this.three },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The new flow has been created');
                    this.getFlows();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    editFlow(flow) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: checker_flow_dialog_1.CheckerFlowDialog,
                    model: { flow, three: this.three },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The flow has been edited');
                    this.getFlows();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    runChecker(event, siteId, checkerId, pdf = false) {
        return __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            let requestUrl = `/three/site/${siteId}/checker/${checkerId}/run`;
            if (pdf) {
                requestUrl += '/pdf';
            }
            try {
                const response = yield site_model_1.ThreeSiteModel.api.get(requestUrl);
                if (response.status !== 200) {
                    const json = yield response.json();
                    if (json.error) {
                        throw new Error(json.error);
                    }
                    else {
                        throw new Error('Unkown error');
                    }
                }
                if (pdf) {
                    const blob = yield response.blob();
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    createNewChecker(site) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: three_checker_config_dialog_1.ThreeCheckerConfigDialog,
                    model: { siteId: site.id, three: this.three },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The new checker has been created');
                    this.getCheckers();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    editChecker(checker) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: three_checker_config_dialog_1.ThreeCheckerConfigDialog,
                    model: { checker, three: this.three },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The checker has been edited');
                    this.getCheckers();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    getReports() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reports = yield checker_report_model_1.ThreeCheckerReportModel.getAll(`?siteId=${this.currentSite.id}`);
        });
    }
    runReport(event, siteId, reportId, pdf = false) {
        return __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            let requestUrl = `/three/checker/report/${reportId}/run`;
            if (pdf) {
                requestUrl += '?pdf=true';
            }
            try {
                const response = yield checker_report_model_1.ThreeCheckerReportModel.api.get(requestUrl);
                if (response.status !== 200) {
                    const json = yield response.json();
                    if (json.error) {
                        throw new Error(json.error);
                    }
                    else {
                        throw new Error('Unkown error');
                    }
                }
                if (pdf) {
                    const blob = yield response.blob();
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    createNewReport(site) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: three_checker_report_dialog_1.ThreeCheckerReportDialog,
                    model: { siteId: site.id, three: this.three, flows: this.flows },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The new report has been created');
                    this.getReports();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    editReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialog = yield this.modalService.open({
                    viewModel: three_checker_report_dialog_1.ThreeCheckerReportDialog,
                    model: { report, three: this.three, flows: this.flows },
                });
                const result = yield dialog.whenClosed();
                if (!result.wasCancelled) {
                    aurelia_resources_1.notify('The report has been edited');
                    this.getReports();
                }
            }
            catch (error) {
                aurelia_resources_1.errorify(error);
            }
        });
    }
    getThemes() {
        theme_model_1.ThreeThemeModel.getAll(`?siteId=${this.currentSite.id}`).then((themes) => {
            this.log.debug('themes', themes);
            this.themes = themes;
        });
    }
    getStyles() {
        return style_model_1.ThreeStyleModel.getAll(`?siteId=${this.currentSite.id}`).then((styles) => {
            this.log.debug('styles', styles);
            this.styles = styles;
            aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator).publish('three-style:update');
        });
    }
    createNewTheme() {
        aurelia_resources_1.arDialog({ title: 'Create a theme', type: 'prompt', content: 'Theme name' }).whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                let theme = new theme_model_1.ThreeThemeModel;
                theme.name = result.value;
                theme.siteId = this.currentSite.id;
                return theme.save().then((createdTheme) => {
                    this.themes.push(createdTheme);
                    this.selectTheme(createdTheme);
                });
            }
        }).catch(aurelia_resources_1.errorify);
    }
    noTheme() {
        this.displayedTheme = undefined;
        this.stylingService.clearTheme();
    }
    displayTheme(theme) {
        this.displayedTheme = theme;
        theme.updateTheme(this.styles);
        this.stylingService.activate(theme.theme);
    }
    selectTheme(theme) {
        this.currentTheme = theme;
        this.currentThemeHasModifications = false;
        if (!this.arNextThemeEditor.classList.contains('current')) {
            this.arNextMenu.nextTo('theme-editor');
        }
        this.displayTheme(this.currentTheme);
    }
    saveTheme(theme) {
        let savingCurrentTheme = theme === this.currentTheme;
        if (theme instanceof theme_model_1.ThreeThemeModel) {
            let keys = Object.keys(theme_model_1.ThreeThemeModel.deco.propertyTypes);
            theme.updateProperties('', keys).then((updatedTheme) => {
                for (let key of keys) {
                    theme[key] = updatedTheme[key];
                }
                if (savingCurrentTheme) {
                    this.currentThemeHasModifications = false;
                }
                aurelia_resources_1.notify('Theme has been saved');
            }).catch(aurelia_resources_1.errorify);
        }
    }
    themeModified(theme) {
        let modifyCurrentTheme = theme === this.currentTheme;
        if (modifyCurrentTheme) {
            this.log.debug('modified current theme');
            theme.updateTheme(this.styles);
            this.currentThemeHasModifications = true;
            this.stylingService.activate(theme.theme);
        }
    }
    editThemeName(theme) {
        aurelia_deco_1.adDialogModel(theme, { title: 'Edit Theme Name' }, ['name']).whenClosed().then((result) => {
        }).catch(error => this.handleError(error));
    }
    deleteTheme(theme) {
        let deletingCurrentTheme = theme === this.currentTheme;
        if (theme instanceof theme_model_1.ThreeThemeModel) {
            theme.remove().then(() => {
                this.getThemes();
                if (deletingCurrentTheme) {
                    this.currentTheme = undefined;
                    this.currentThemeHasModifications = false;
                    if (this.arNextThemeEditor.classList.contains('current')) {
                        this.arNextMenu.prevTo('main-site');
                    }
                }
                aurelia_resources_1.notify('Theme has been deleted');
            }).catch(aurelia_resources_1.errorify);
        }
    }
    selectRule(rule) {
        this.currentRule = rule;
        this.arNextMenu.nextTo('rule-editor');
    }
    addRule(theme) {
        aurelia_resources_1.arDialog({ title: 'Add New Rule', content: 'Rule Name', type: 'prompt' }).whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                if (!Array.isArray(theme.rules))
                    theme.rules = [];
                let rule = new theme_model_1.ThreeThemeModelRule();
                rule.name = result.value;
                theme.rules.push(rule);
                this.themeModified(theme);
            }
        });
    }
    editRuleName(theme, rule) {
        let ruleIndex = theme.rules.indexOf(rule);
        if (ruleIndex === -1) {
            aurelia_resources_1.errorify(new Error('Rule not found'));
            return;
        }
    }
    deleteRule(theme, rule) {
        let ruleIndex = theme.rules.indexOf(rule);
        if (ruleIndex === -1) {
            aurelia_resources_1.errorify(new Error('Rule not found'));
            return;
        }
        theme.rules.splice(ruleIndex, 1);
        this.themeModified(theme);
        this.arNextMenu.autoPrev();
    }
    selectStyle(style) {
        this.currentStyle = style;
        this.arNextMenu.nextTo('style-editor');
    }
    createNewStyle() {
        aurelia_resources_1.arDialog({ title: 'Add New Style', content: 'Style Name', type: 'prompt' }).whenClosed().then((result) => {
            if (!result.dismissed && result.value) {
                let style = new style_model_1.ThreeStyleModel();
                style.siteId = this.currentSite.id;
                style.name = result.value;
                style.save().then(() => this.getStyles()).catch(aurelia_resources_1.errorify);
            }
        });
    }
    saveStyle(style, index) {
        const s = style;
        if (!Array.isArray(s.__editedProperties)) {
            s.__editedProperties = [];
        }
        this.log.debug('prop', s.__editedProperties);
        this.log.debug('style', style);
        style.updateProperties('', s.__editedProperties).then(() => {
            this.getStyles();
            s.__editedProperties = [];
        }).catch(aurelia_resources_1.errorify);
    }
    deleteStyle(style) {
        aurelia_resources_1.arDialog({ title: 'Delete Style', content: 'Do you confirm that you want to permanently delete this style ?', type: 'confirmation' }).whenClosed().then((result) => {
            if (!result.dismissed && result.agree) {
                style.remove().then(() => {
                    this.getStyles();
                }).catch(aurelia_resources_1.errorify);
            }
        });
    }
    openViewer() {
        let win = window.open("/viewer/" + this.currentSite.id, '_blank');
        win.focus();
    }
    exportSettings() {
        this.modalService.open({
            viewModel: admin_export_settings_dialog_1.AdminExportSettingsDialog,
            model: { siteId: this.currentSite.id }
        });
    }
    importSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = yield this.modalService.open({
                viewModel: admin_import_settings_dialog_1.AdminImportSettingsDialog,
                model: { siteId: this.currentSite.id }
            });
            const response = yield dialog.whenClosed();
            if (!response.wasCancelled) {
                this.getCheckers();
                this.getReports();
                this.getStyles();
                this.getThemes();
            }
        });
    }
};
__decorate([
    aurelia_framework_1.bindable,
    __metadata("design:type", String)
], ThreeAdmin.prototype, "initialSiteId", void 0);
__decorate([
    aurelia_framework_1.computedFrom('three', 'three.objects', 'three.objects.rootObjects', 'three.objects.rootObjects.length'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "hasObjects", null);
__decorate([
    aurelia_framework_1.computedFrom('select', 'select.objects', 'select.objects.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "selectedObjects", null);
__decorate([
    aurelia_framework_1.computedFrom('three', 'three.points', 'three.points.rootPoints', 'thre.points.rootPoints.length'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "hasPoints", null);
__decorate([
    aurelia_framework_1.computedFrom('three', 'three.points', 'three.points.rootPoints', 'thre.points.rootPoints.length'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "points", null);
__decorate([
    aurelia_framework_1.computedFrom('toolsService', 'toolsService.currentToolName'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "activeToolName", null);
__decorate([
    aurelia_framework_1.computedFrom('three', 'three.navigation', 'three.navigation.camera', 'three.navigation.observationCamera'),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ThreeAdmin.prototype, "cameras", null);
ThreeAdmin = __decorate([
    aurelia_framework_1.customElement('three-admin-element'),
    aurelia_framework_1.inject(Element, modal_1.UxModalService),
    __metadata("design:paramtypes", [Element, modal_1.UxModalService])
], ThreeAdmin);
exports.ThreeAdmin = ThreeAdmin;

//# sourceMappingURL=three-admin.js.map
