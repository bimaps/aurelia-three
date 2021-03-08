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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeAdmin = void 0;
var admin_import_settings_dialog_1 = require("./../dialogs/admin-import-settings-dialog");
var admin_export_settings_dialog_1 = require("./../dialogs/admin-export-settings-dialog");
var checker_config_model_1 = require("./../models/checker-config.model");
var checker_report_model_1 = require("./../models/checker-report.model");
var style_model_1 = require("./../models/style.model");
var theme_model_1 = require("./../models/theme.model");
var three_generator_1 = require("./../helpers/three-generator");
var three_styling_service_1 = require("./../themes/three-styling-service");
var three_selection_tool_1 = require("../tools/three-selection-tool");
var three_translation_tool_1 = require("../tools/three-translation-tool");
var three_rotation_tool_1 = require("../tools/three-rotation-tool");
var three_tools_service_1 = require("../tools/three-tools-service");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_logging_1 = require("aurelia-logging");
var site_model_1 = require("../models/site.model");
var aurelia_resources_1 = require("aurelia-resources");
var THREE = require("three");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var object_model_1 = require("../models/object.model");
var aurelia_deco_1 = require("aurelia-deco");
var modal_1 = require("@aurelia-ux/modal");
var three_checker_config_dialog_1 = require("../dialogs/three-checker-config-dialog");
var three_checker_report_dialog_1 = require("../dialogs/three-checker-report-dialog");
var checker_internals_1 = require("../models/checkers/checker-internals");
var checker_flow_dialog_1 = require("../dialogs/checkers/checker-flow-dialog");
var ThreeAdmin = (function () {
    function ThreeAdmin(element, modalService) {
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
    ThreeAdmin.prototype.attached = function () {
        var _this = this;
        this.log.debug('attached', this);
        this.fixSlots();
        this.toolsService = new three_tools_service_1.ThreeToolsService(this.three);
        this.stylingService = new three_styling_service_1.ThreeStylingService(this.three);
        this.select = new three_selection_tool_1.ThreeSelectionTool(this.toolsService);
        this.translate = new three_translation_tool_1.ThreeTranslationTool(this.toolsService);
        this.rotate = new three_rotation_tool_1.ThreeRotationTool(this.toolsService);
        this.getSites();
        var ea = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
        this.subscriptions.push(ea.subscribe('three-cursor:hover', function (data) {
            _this.handleCursor('hover', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:click', function (data) {
            _this.handleCursor('click', data);
        }));
        this.subscriptions.push(ea.subscribe('three-cursor:plane-intersect', function (data) {
            _this.rotate.handlePlanesIntersects(data);
        }));
        this.subscriptions.push(ea.subscribe('three-style:update', function () {
            if (_this.displayedTheme) {
                aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                    _this.displayedTheme.updateTheme(_this.styles);
                    _this.stylingService.activate(_this.displayedTheme.theme);
                });
            }
        }));
        setTimeout(function () {
            _this.three.addAxis();
        }, 1000);
    };
    ThreeAdmin.prototype.detached = function () {
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.dispose();
        }
    };
    ThreeAdmin.prototype.fixSlots = function () {
        var _this = this;
        this.log.debug('fixSlots');
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueTask(function () {
            _this.log.debug('elements', _this.fakeSlots.querySelectorAll('[name=main-buttons]'));
            _this.fakeSlots.querySelectorAll('[slot=main-buttons]').forEach(function (element) {
                _this.mainButtonsContainer.append(element);
            });
        });
    };
    ThreeAdmin.prototype.getSites = function () {
        var _this = this;
        site_model_1.ThreeSiteModel.getAll().then(function (sites) {
            _this.sites = sites;
            if (_this.initialSiteId) {
                for (var _i = 0, _a = _this.sites; _i < _a.length; _i++) {
                    var site = _a[_i];
                    if (site.id === _this.initialSiteId) {
                        _this.selectSite(site);
                    }
                }
                location.href = location.href.replace("siteId=" + _this.initialSiteId, '');
                _this.initialSiteId = '';
            }
        }).catch(aurelia_resources_1.errorify);
    };
    ThreeAdmin.prototype.handleError = function (error) {
        if (this.currentOperation)
            this.currentOperation = '';
        aurelia_resources_1.errorify(error);
    };
    ThreeAdmin.prototype.generate = function (type) {
        var _a;
        var generator = new three_generator_1.ThreeGenerator();
        if (type === 'cube') {
            this.three.getScene().add(generator.centeredCube(10));
        }
        else if (type === 'groundAnd3Cubes') {
            this.three.getScene().add(generator.groundAnd3Cubes());
        }
        else if (type === 'testAllGeometries') {
            (_a = this.three.getScene()).add.apply(_a, generator.testAllGeometries());
        }
    };
    ThreeAdmin.prototype.deleteSite = function (site) {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Delete Site ?', content: 'Are you sure that you want to delete this site and all the data related to this site in the API ?', type: 'confirmation' }).whenClosed().then(function (result) {
            var deletingCurrentSite = site.id === _this.currentSite.id;
            if (!result.dismissed && result.agree) {
                _this.currentOperation = 'Clearing Site Data';
                return site_model_1.ThreeSiteModel.clearData(site.id).then(function () {
                    _this.currentOperation = 'Deleting Site';
                    return site.remove();
                }).then(function () {
                    return _this.getSites();
                }).then(function () {
                    if (deletingCurrentSite) {
                        _this.arNextMenu.autoFirst();
                    }
                }).catch(function (error) { return _this.handleError(error); });
            }
        });
    };
    ThreeAdmin.prototype.saveSiteSettings = function (site) {
        var _this = this;
        site.updateProperties('', ['name']).then(function (updatedSite) {
            site.name = updatedSite.name;
        }).catch(function (error) { return _this.handleError(error); });
    };
    ThreeAdmin.prototype.clearSiteData = function (siteId) {
        var _this = this;
        if (this.currentOperation)
            return Promise.resolve();
        return aurelia_resources_1.arDialog({ title: 'Clear Data ?', content: 'Are you sure that you want to delete all the data related to this site in the API ?', type: 'confirmation' }).whenClosed().then(function (result) {
            if (!result.dismissed && result.agree) {
                _this.currentOperation = 'Clearing Site Data';
                return site_model_1.ThreeSiteModel.clearData(siteId).then(function () {
                    _this.currentOperation = '';
                }).catch(function (error) { return _this.handleError(error); });
            }
        });
    };
    ThreeAdmin.prototype.zoomOnScene = function (factor, orientation, animate, render) {
        if (factor === void 0) { factor = 1; }
        if (orientation === void 0) { orientation = '3d'; }
        if (animate === void 0) { animate = true; }
        if (render === void 0) { render = true; }
        this.three.navigation.zoomOnScene(factor, orientation, animate, render);
    };
    ThreeAdmin.prototype.createSite = function () {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Site Name', type: 'prompt' }).whenClosed().then(function (result) {
            if (result.value && !result.dismissed) {
                var newSiteId_1;
                var site = new site_model_1.ThreeSiteModel();
                site.name = result.value;
                site.save().then(function (site) {
                    newSiteId_1 = site.id;
                    _this.getSites();
                }).then(function () {
                    _this.selectSite(newSiteId_1);
                }).catch(aurelia_resources_1.errorify);
            }
        });
    };
    ThreeAdmin.prototype.renameSite = function (site) {
        var currentName = site.name;
        aurelia_resources_1.arDialog({ title: "Rename site " + currentName, type: 'prompt' }).whenClosed().then(function (result) {
            if (result.value && !result.dismissed) {
                site.name = result.value;
                site.updateProperties('', ['name']).then(function (updatedSite) {
                    site.name = updatedSite.name;
                }).catch(aurelia_resources_1.errorify);
            }
        });
    };
    ThreeAdmin.prototype.selectSite = function (site) {
        if (site instanceof site_model_1.ThreeSiteModel) {
            this.currentSite = site;
            this.arNextMenu.nextTo('main-site');
        }
        else if (typeof site === 'string') {
            for (var _i = 0, _a = this.sites; _i < _a.length; _i++) {
                var _site = _a[_i];
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
    };
    ThreeAdmin.prototype.loadSite = function (siteId) {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Loading Settings', type: 'prompt', promptCompName: 'three-admin-dialog-load-data-api' }).whenClosed().then(function (result) {
            if (!result.dismissed) {
                _this.currentOperation = 'Downloading Site Data';
                var resp_1 = result.value;
                if (resp_1.emptySceneBeforeLoad)
                    _this.three.objects.clearScene();
                var filters = {};
                site_model_1.ThreeSiteModel.getSiteJson(siteId, filters).then(function (json) {
                    if (resp_1.replaceLightsIfAny && json.metadata.loadInfos.containsLighting)
                        _this.clearAllLights();
                    return _this.three.objects.loadJSON(json, { calculateOffsetCenter: 'never' });
                }).then(function () {
                    if (resp_1.zoomOnScene)
                        _this.three.navigation.zoomOnScene(1);
                    _this.currentOperation = '';
                }).catch(function (error) { return _this.handleError(error); });
            }
        });
    };
    ThreeAdmin.prototype.saveSceneIntoSite = function () {
        var _this = this;
        if (!this.currentSite)
            return;
        return aurelia_resources_1.arDialog({ title: 'Saving Settings', type: 'prompt', promptCompName: 'three-admin-dialog-save-data-api' }).whenClosed().then(function (result) {
            if (!result.dismissed) {
                var resp_2 = result.value;
                var clearPromise = Promise.resolve();
                if (resp_2.clearApiDataBeforeSaving) {
                    clearPromise = _this.clearSiteData(_this.currentSite.id);
                }
                clearPromise.then(function () {
                    _this.currentOperation = 'Uploading Site Data';
                    var importId = resp_2.importId || undefined;
                    var json = _this.three.getScene().toJSON();
                    return site_model_1.ThreeSiteModel.addJsonData(_this.currentSite.id, json, { importId: importId, saveLights: resp_2.saveLights });
                }).then(function (response) {
                    _this.currentOperation = '';
                }).catch(function (error) { return _this.handleError(error); });
            }
        });
    };
    ThreeAdmin.prototype.uploadDataFromFile = function () {
        var _this = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.setAttribute('accept', '.ifc,.json');
        input.click();
        input.addEventListener('change', function () {
            console.dir(input);
            if (input.files && input.files.length === 1) {
                var file = input.files[0];
                if (file.name.substr(-4) === '.ifc') {
                    _this.uploadingFile = true;
                    site_model_1.ThreeSiteModel.addIFCData(_this.currentSite.id, file).then(function () {
                        aurelia_resources_1.notify('Data successfuly uploaded', { timeout: 0 });
                    }).catch(function (error) { return _this.handleError(error); }).finally(function () {
                        _this.uploadingFile = false;
                    });
                }
                else if (file.name.substr(-5) === '.json') {
                    site_model_1.ThreeSiteModel.addJsonData(_this.currentSite.id, file).then(function () {
                        aurelia_resources_1.notify('Data successfuly uploaded', { timeout: 0 });
                    }).catch(function (error) { return _this.handleError(error); }).finally(function () {
                        _this.uploadingFile = false;
                    });
                }
            }
        });
    };
    ThreeAdmin.prototype.loadFile = function () {
        var _this = this;
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
            var input = document.createElement('input');
            input.type = 'file';
            input.setAttribute('accept', '.json,.obj,.mtl,.dae,.gltf');
            input.setAttribute('multiple', 'multiple');
            input.click();
            input.addEventListener('change', function () {
                console.dir(input);
                if (input.files && input.files.length) {
                    var mtlFiles = [];
                    var objFiles = [];
                    var jsonFiles = [];
                    var daeFiles = [];
                    var gltfFiles = [];
                    for (var index = 0; index < input.files.length; index++) {
                        var file = input.files.item(index);
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
                    var _loop_1 = function (file) {
                        _this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                            _this.three.objects.loadFile(file).finally(function () { return _this.loadingFiles--; });
                        });
                    };
                    for (var _i = 0, mtlFiles_1 = mtlFiles; _i < mtlFiles_1.length; _i++) {
                        var file = mtlFiles_1[_i];
                        _loop_1(file);
                    }
                    var _loop_2 = function (file) {
                        _this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                            _this.three.objects.loadFile(file).finally(function () { return _this.loadingFiles--; });
                        });
                    };
                    for (var _a = 0, objFiles_1 = objFiles; _a < objFiles_1.length; _a++) {
                        var file = objFiles_1[_a];
                        _loop_2(file);
                    }
                    var _loop_3 = function (file) {
                        _this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                            _this.three.objects.loadFile(file).finally(function () { return _this.loadingFiles--; });
                        });
                    };
                    for (var _b = 0, jsonFiles_1 = jsonFiles; _b < jsonFiles_1.length; _b++) {
                        var file = jsonFiles_1[_b];
                        _loop_3(file);
                    }
                    var _loop_4 = function (file) {
                        _this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                            _this.three.objects.loadFile(file).finally(function () { return _this.loadingFiles--; });
                        });
                    };
                    for (var _c = 0, daeFiles_1 = daeFiles; _c < daeFiles_1.length; _c++) {
                        var file = daeFiles_1[_c];
                        _loop_4(file);
                    }
                    var _loop_5 = function (file) {
                        _this.loadingFiles++;
                        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
                            _this.three.objects.loadFile(file).finally(function () { return _this.loadingFiles--; });
                        });
                    };
                    for (var _d = 0, gltfFiles_1 = gltfFiles; _d < gltfFiles_1.length; _d++) {
                        var file = gltfFiles_1[_d];
                        _loop_5(file);
                    }
                }
            });
        });
    };
    ThreeAdmin.prototype.selectObject = function (event) {
        this.log.debug('selectObject', event);
        if (event && event.srcElement instanceof HTMLElement) {
            var src = event.srcElement;
            this.log.debug('event', event);
            if (src.tagName === 'INPUT' || src.parentElement.classList.contains('.ux-list-item__action-item') || src.parentElement.parentElement.classList.contains('.ux-list-item__action-item')) {
                return true;
            }
        }
        if (event.detail) {
            var object = event.detail;
            this.selectedObject = object;
            this.arNextMenu.nextTo('object-detail');
        }
    };
    ThreeAdmin.prototype.saveObjectProperties = function (object) {
        var _this = this;
        this.log.debug('saveObjectProperties', object);
        var obj = object_model_1.ThreeObjectModel.fromThreeObject(object);
        this.log.debug('obj', obj);
        this.currentOperation = 'Saving Object';
        obj.updateProperties('', ['uuid', 'name', 'type', 'matrix', 'material', 'geometry', 'userData', '_min', '_max']).then(function () {
            _this.currentOperation = '';
        }).catch(function (error) { return _this.handleError(error); });
    };
    ThreeAdmin.prototype.unselectObject = function () {
        this.arNextMenu.prevTo('main-site');
        this.selectedObject = undefined;
    };
    ThreeAdmin.prototype.removeSelectedObject = function () {
        this.removeObject(this.selectedObject);
        this.unselectObject();
    };
    ThreeAdmin.prototype.removeObject = function (object) {
        this.three.getScene().remove(object);
    };
    ThreeAdmin.prototype.clearAllLights = function () {
        for (var _i = 0, _a = this.three.objects.lights; _i < _a.length; _i++) {
            var light = _a[_i];
            this.three.getScene().remove(light);
        }
    };
    ThreeAdmin.prototype.addAmbiantLight = function () {
        this.three.initLight();
    };
    ThreeAdmin.prototype.addLight = function () {
        var _this = this;
        var lightTypes = [
            { label: 'Ambiant', value: 'ambiant' },
            { label: 'Spot', value: 'spot' },
        ];
        aurelia_resources_1.arDialog({ type: 'prompt', title: 'What kind of light ?', promptOptions: lightTypes }).whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                if (result.value === 'ambiant') {
                    var light = new THREE.AmbientLight(0x404040, 4);
                    _this.three.getScene().add(light);
                }
                else if (result.value === 'spot') {
                    var light = new THREE.SpotLight('#fff', 4);
                    _this.three.getScene().add(light);
                }
            }
        });
    };
    ThreeAdmin.prototype.mouseEnter = function (event) {
        this.mouseOnViewer = true;
        this.mouseX = event.x;
        this.mouseY = event.y;
    };
    ThreeAdmin.prototype.mouseLeave = function (event) {
        this.mouseOnViewer = false;
    };
    ThreeAdmin.prototype.mouseMove = function (event) {
        this.mouseX = event.x;
        this.mouseY = event.y;
    };
    ThreeAdmin.prototype.handleCursor = function (type, intersections) {
        if (type === 'hover') {
            this.nbObjectsUnderMouse = intersections.length;
        }
    };
    Object.defineProperty(ThreeAdmin.prototype, "hasObjects", {
        get: function () {
            this.log.debug('hasObjects');
            if (!this.three)
                return false;
            if (!this.three.objects)
                return false;
            this.log.debug('...', this.three.objects.rootObjects.length > 0);
            return this.three.objects.rootObjects.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeAdmin.prototype, "selectedObjects", {
        get: function () {
            if (!this.select)
                return [];
            if (!this.select.objects)
                return [];
            return this.select.objects;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeAdmin.prototype, "hasPoints", {
        get: function () {
            if (!this.three)
                return false;
            if (!this.three.points)
                return false;
            return this.three.points.rootPoints.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeAdmin.prototype, "points", {
        get: function () {
            if (!this.three)
                return [];
            if (!this.three.points)
                return [];
            return this.three.points.rootPoints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeAdmin.prototype, "activeToolName", {
        get: function () {
            if (!this.toolsService)
                return '';
            return this.toolsService.currentToolName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeAdmin.prototype, "cameras", {
        get: function () {
            if (!this.three)
                return [];
            if (!this.three.navigation)
                return [];
            var cameras = [this.three.navigation.camera];
            if (this.three.navigation.observationOn) {
                cameras.push(this.three.navigation.observationCamera);
            }
            return cameras;
        },
        enumerable: false,
        configurable: true
    });
    ThreeAdmin.prototype.manualTranslate = function () {
    };
    ThreeAdmin.prototype.manualRotate = function () {
        var _this = this;
        var ad = aurelia_resources_1.arDialog({ title: 'Manual Rotate', type: 'prompt', promptCompName: 'admin-dialog-manual-rotate' });
        ad.whenClosed().then(function (result) {
            _this.log.debug('result', result);
            if (!result.dismissed && result.value) {
                _this.log.debug('has value');
                var response = result.value;
                if (response.angle) {
                    _this.log.debug('has angle');
                    _this.rotate.rotate(response.angle, response.constraint, response.unit);
                }
            }
        });
    };
    ThreeAdmin.prototype.setSelectStyle = function () {
        var _this = this;
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(function () {
            _this.select.setStyle(_this.selectionStyle);
        });
    };
    ThreeAdmin.prototype.loadPoints = function () {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Point Clouds Name', type: 'prompt', content: "Enter the name of the Point Clouds project you want to load, such as \"sextant\", \"cossonay\", \"saanen\", ..." }).whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                var project_1 = result.value;
                fetch("https://pointclouds.example.com/" + project_1 + "/folders.json").then(function (result) {
                    _this.log.debug('result', result);
                    return result.json();
                }).then(function (result) {
                    _this.log.debug('result', result);
                    if (!Array.isArray(result))
                        throw new Error('Invalid folder file');
                    var bbox;
                    var promises = [];
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var item = result_1[_i];
                        promises.push(_this.three.points.load("https://pointclouds.example.com/" + project_1 + "/" + item + "/", 'cloud.js', project_1 + " - " + item).then(function (pco) {
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
                    Promise.all(promises).then(function (values) {
                        _this.log.debug('big bbox', bbox);
                        _this.three.points.zoomOnPco(values[0]);
                    });
                }).catch(aurelia_resources_1.errorify);
            }
        });
    };
    ThreeAdmin.prototype.zoomPoints = function () {
        var objects = this.three.getScene('points').children;
        if (objects.length) {
            var firstObject = objects[0];
            var bbox = firstObject.boundingBox;
            this.log.debug('bbox', bbox);
            this.three.navigation.zoomOnBbox(bbox, '3d', true, true);
        }
    };
    ThreeAdmin.prototype.getCheckers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, checker_config_model_1.ThreeCheckerConfigModel.getAll("?siteId=" + this.currentSite.id)];
                    case 1:
                        _a.checkers = _b.sent();
                        return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.getFlows = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, checker_internals_1.CheckerFlowModel.getAll("?siteId=" + this.currentSite.id)];
                    case 1:
                        _a.flows = _b.sent();
                        return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.createNewFlow = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: checker_flow_dialog_1.CheckerFlowDialog,
                                model: { siteId: site.id, three: this.three },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The new flow has been created');
                            this.getFlows();
                        }
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        aurelia_resources_1.errorify(error_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.editFlow = function (flow) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: checker_flow_dialog_1.CheckerFlowDialog,
                                model: { flow: flow, three: this.three },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The flow has been edited');
                            this.getFlows();
                        }
                        return [3, 4];
                    case 3:
                        error_2 = _a.sent();
                        aurelia_resources_1.errorify(error_2);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.runChecker = function (event, siteId, checkerId, pdf) {
        if (pdf === void 0) { pdf = false; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, response, json, blob, url, a, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.stopPropagation();
                        requestUrl = "/three/site/" + siteId + "/checker/" + checkerId + "/run";
                        if (pdf) {
                            requestUrl += '/pdf';
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4, site_model_1.ThreeSiteModel.api.get(requestUrl)];
                    case 2:
                        response = _a.sent();
                        if (!(response.status !== 200)) return [3, 4];
                        return [4, response.json()];
                    case 3:
                        json = _a.sent();
                        if (json.error) {
                            throw new Error(json.error);
                        }
                        else {
                            throw new Error('Unkown error');
                        }
                        _a.label = 4;
                    case 4:
                        if (!pdf) return [3, 6];
                        return [4, response.blob()];
                    case 5:
                        blob = _a.sent();
                        url = window.URL.createObjectURL(blob);
                        a = document.createElement('a');
                        a.href = url;
                        a.download = "filename.pdf";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        _a.label = 6;
                    case 6: return [3, 8];
                    case 7:
                        error_3 = _a.sent();
                        aurelia_resources_1.errorify(error_3);
                        return [3, 8];
                    case 8: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.createNewChecker = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: three_checker_config_dialog_1.ThreeCheckerConfigDialog,
                                model: { siteId: site.id, three: this.three },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The new checker has been created');
                            this.getCheckers();
                        }
                        return [3, 4];
                    case 3:
                        error_4 = _a.sent();
                        aurelia_resources_1.errorify(error_4);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.editChecker = function (checker) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: three_checker_config_dialog_1.ThreeCheckerConfigDialog,
                                model: { checker: checker, three: this.three },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The checker has been edited');
                            this.getCheckers();
                        }
                        return [3, 4];
                    case 3:
                        error_5 = _a.sent();
                        aurelia_resources_1.errorify(error_5);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.getReports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, checker_report_model_1.ThreeCheckerReportModel.getAll("?siteId=" + this.currentSite.id)];
                    case 1:
                        _a.reports = _b.sent();
                        return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.runReport = function (event, siteId, reportId, pdf) {
        if (pdf === void 0) { pdf = false; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, response, json, blob, url, a, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.stopPropagation();
                        requestUrl = "/three/checker/report/" + reportId + "/run";
                        if (pdf) {
                            requestUrl += '?pdf=true';
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4, checker_report_model_1.ThreeCheckerReportModel.api.get(requestUrl)];
                    case 2:
                        response = _a.sent();
                        if (!(response.status !== 200)) return [3, 4];
                        return [4, response.json()];
                    case 3:
                        json = _a.sent();
                        if (json.error) {
                            throw new Error(json.error);
                        }
                        else {
                            throw new Error('Unkown error');
                        }
                        _a.label = 4;
                    case 4:
                        if (!pdf) return [3, 6];
                        return [4, response.blob()];
                    case 5:
                        blob = _a.sent();
                        url = window.URL.createObjectURL(blob);
                        a = document.createElement('a');
                        a.href = url;
                        a.download = "filename.pdf";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        _a.label = 6;
                    case 6: return [3, 8];
                    case 7:
                        error_6 = _a.sent();
                        aurelia_resources_1.errorify(error_6);
                        return [3, 8];
                    case 8: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.createNewReport = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: three_checker_report_dialog_1.ThreeCheckerReportDialog,
                                model: { siteId: site.id, three: this.three, flows: this.flows },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The new report has been created');
                            this.getReports();
                        }
                        return [3, 4];
                    case 3:
                        error_7 = _a.sent();
                        aurelia_resources_1.errorify(error_7);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.editReport = function (report) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.modalService.open({
                                viewModel: three_checker_report_dialog_1.ThreeCheckerReportDialog,
                                model: { report: report, three: this.three, flows: this.flows },
                            })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        result = _a.sent();
                        if (!result.wasCancelled) {
                            aurelia_resources_1.notify('The report has been edited');
                            this.getReports();
                        }
                        return [3, 4];
                    case 3:
                        error_8 = _a.sent();
                        aurelia_resources_1.errorify(error_8);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ThreeAdmin.prototype.getThemes = function () {
        var _this = this;
        theme_model_1.ThreeThemeModel.getAll("?siteId=" + this.currentSite.id).then(function (themes) {
            _this.log.debug('themes', themes);
            _this.themes = themes;
        });
    };
    ThreeAdmin.prototype.getStyles = function () {
        var _this = this;
        return style_model_1.ThreeStyleModel.getAll("?siteId=" + this.currentSite.id).then(function (styles) {
            _this.log.debug('styles', styles);
            _this.styles = styles;
            aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator).publish('three-style:update');
        });
    };
    ThreeAdmin.prototype.createNewTheme = function () {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Create a theme', type: 'prompt', content: 'Theme name' }).whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                var theme = new theme_model_1.ThreeThemeModel;
                theme.name = result.value;
                theme.siteId = _this.currentSite.id;
                return theme.save().then(function (createdTheme) {
                    _this.themes.push(createdTheme);
                    _this.selectTheme(createdTheme);
                });
            }
        }).catch(aurelia_resources_1.errorify);
    };
    ThreeAdmin.prototype.noTheme = function () {
        this.displayedTheme = undefined;
        this.stylingService.clearTheme();
    };
    ThreeAdmin.prototype.displayTheme = function (theme) {
        this.displayedTheme = theme;
        theme.updateTheme(this.styles);
        this.stylingService.activate(theme.theme);
    };
    ThreeAdmin.prototype.selectTheme = function (theme) {
        this.currentTheme = theme;
        this.currentThemeHasModifications = false;
        if (!this.arNextThemeEditor.classList.contains('current')) {
            this.arNextMenu.nextTo('theme-editor');
        }
        this.displayTheme(this.currentTheme);
    };
    ThreeAdmin.prototype.saveTheme = function (theme) {
        var _this = this;
        var savingCurrentTheme = theme === this.currentTheme;
        if (theme instanceof theme_model_1.ThreeThemeModel) {
            var keys_1 = Object.keys(theme_model_1.ThreeThemeModel.deco.propertyTypes);
            theme.updateProperties('', keys_1).then(function (updatedTheme) {
                for (var _i = 0, keys_2 = keys_1; _i < keys_2.length; _i++) {
                    var key = keys_2[_i];
                    theme[key] = updatedTheme[key];
                }
                if (savingCurrentTheme) {
                    _this.currentThemeHasModifications = false;
                }
                aurelia_resources_1.notify('Theme has been saved');
            }).catch(aurelia_resources_1.errorify);
        }
    };
    ThreeAdmin.prototype.themeModified = function (theme) {
        var modifyCurrentTheme = theme === this.currentTheme;
        if (modifyCurrentTheme) {
            this.log.debug('modified current theme');
            theme.updateTheme(this.styles);
            this.currentThemeHasModifications = true;
            this.stylingService.activate(theme.theme);
        }
    };
    ThreeAdmin.prototype.editThemeName = function (theme) {
        var _this = this;
        aurelia_deco_1.adDialogModel(theme, { title: 'Edit Theme Name' }, ['name']).whenClosed().then(function (result) {
        }).catch(function (error) { return _this.handleError(error); });
    };
    ThreeAdmin.prototype.deleteTheme = function (theme) {
        var _this = this;
        var deletingCurrentTheme = theme === this.currentTheme;
        if (theme instanceof theme_model_1.ThreeThemeModel) {
            theme.remove().then(function () {
                _this.getThemes();
                if (deletingCurrentTheme) {
                    _this.currentTheme = undefined;
                    _this.currentThemeHasModifications = false;
                    if (_this.arNextThemeEditor.classList.contains('current')) {
                        _this.arNextMenu.prevTo('main-site');
                    }
                }
                aurelia_resources_1.notify('Theme has been deleted');
            }).catch(aurelia_resources_1.errorify);
        }
    };
    ThreeAdmin.prototype.selectRule = function (rule) {
        this.currentRule = rule;
        this.arNextMenu.nextTo('rule-editor');
    };
    ThreeAdmin.prototype.addRule = function (theme) {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Add New Rule', content: 'Rule Name', type: 'prompt' }).whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                if (!Array.isArray(theme.rules))
                    theme.rules = [];
                var rule = new theme_model_1.ThreeThemeModelRule();
                rule.name = result.value;
                theme.rules.push(rule);
                _this.themeModified(theme);
            }
        });
    };
    ThreeAdmin.prototype.editRuleName = function (theme, rule) {
        var ruleIndex = theme.rules.indexOf(rule);
        if (ruleIndex === -1) {
            aurelia_resources_1.errorify(new Error('Rule not found'));
            return;
        }
    };
    ThreeAdmin.prototype.deleteRule = function (theme, rule) {
        var ruleIndex = theme.rules.indexOf(rule);
        if (ruleIndex === -1) {
            aurelia_resources_1.errorify(new Error('Rule not found'));
            return;
        }
        theme.rules.splice(ruleIndex, 1);
        this.themeModified(theme);
        this.arNextMenu.autoPrev();
    };
    ThreeAdmin.prototype.selectStyle = function (style) {
        this.currentStyle = style;
        this.arNextMenu.nextTo('style-editor');
    };
    ThreeAdmin.prototype.createNewStyle = function () {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Add New Style', content: 'Style Name', type: 'prompt' }).whenClosed().then(function (result) {
            if (!result.dismissed && result.value) {
                var style = new style_model_1.ThreeStyleModel();
                style.siteId = _this.currentSite.id;
                style.name = result.value;
                style.save().then(function () { return _this.getStyles(); }).catch(aurelia_resources_1.errorify);
            }
        });
    };
    ThreeAdmin.prototype.saveStyle = function (style, index) {
        var _this = this;
        var s = style;
        if (!Array.isArray(s.__editedProperties)) {
            s.__editedProperties = [];
        }
        this.log.debug('prop', s.__editedProperties);
        this.log.debug('style', style);
        style.updateProperties('', s.__editedProperties).then(function () {
            _this.getStyles();
            s.__editedProperties = [];
        }).catch(aurelia_resources_1.errorify);
    };
    ThreeAdmin.prototype.deleteStyle = function (style) {
        var _this = this;
        aurelia_resources_1.arDialog({ title: 'Delete Style', content: 'Do you confirm that you want to permanently delete this style ?', type: 'confirmation' }).whenClosed().then(function (result) {
            if (!result.dismissed && result.agree) {
                style.remove().then(function () {
                    _this.getStyles();
                }).catch(aurelia_resources_1.errorify);
            }
        });
    };
    ThreeAdmin.prototype.openViewer = function () {
        var win = window.open("/viewer/" + this.currentSite.id, '_blank');
        win.focus();
    };
    ThreeAdmin.prototype.exportSettings = function () {
        this.modalService.open({
            viewModel: admin_export_settings_dialog_1.AdminExportSettingsDialog,
            model: { siteId: this.currentSite.id }
        });
    };
    ThreeAdmin.prototype.importSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dialog, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.modalService.open({
                            viewModel: admin_import_settings_dialog_1.AdminImportSettingsDialog,
                            model: { siteId: this.currentSite.id }
                        })];
                    case 1:
                        dialog = _a.sent();
                        return [4, dialog.whenClosed()];
                    case 2:
                        response = _a.sent();
                        if (!response.wasCancelled) {
                            this.getCheckers();
                            this.getReports();
                            this.getStyles();
                            this.getThemes();
                        }
                        return [2];
                }
            });
        });
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
    return ThreeAdmin;
}());
exports.ThreeAdmin = ThreeAdmin;

//# sourceMappingURL=three-admin.js.map
