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
import { ThreeObjectModel } from './../models/object.model';
import { bindable, TaskQueue, inject } from 'aurelia-framework';
import * as resolvePath from 'object-resolve-path';
import { getLogger } from 'aurelia-logging';
import * as THREE from 'three';
var log = getLogger('three-object-property-explorer');
var ThreeObjectPropertyExplorer = (function () {
    function ThreeObjectPropertyExplorer(taskQueue) {
        this.taskQueue = taskQueue;
        this.properties = [];
        this.canEdit = false;
        this.editDocuments = false;
        this.ready = false;
        this.props = [];
    }
    ThreeObjectPropertyExplorer.prototype.bind = function () {
        this.objectChanged();
        this.propertiesChanged();
    };
    ThreeObjectPropertyExplorer.prototype.objectChanged = function () {
        var _this = this;
        this.ready = false;
        this.taskQueue.queueTask(function () {
            _this.ready = true;
        });
        log.debug('object', this.object);
        this.getDocuments();
    };
    ThreeObjectPropertyExplorer.prototype.getDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _i, _b, document_1, preview;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4, ThreeObjectModel.getOneWithId(this.object.userData.id)];
                    case 1:
                        _a.instance = _c.sent();
                        _i = 0, _b = this.instance.documents || [];
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3, 5];
                        document_1 = _b[_i];
                        if (!(document_1.type.indexOf('image/') === 0)) return [3, 4];
                        return [4, this.instance.getFilePreviewUrl('documents', '30:30', { fileId: document_1.filename })];
                    case 3:
                        preview = _c.sent();
                        document_1.preview = preview;
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5: return [2];
                }
            });
        });
    };
    ThreeObjectPropertyExplorer.prototype.documentsUpdated = function () {
        this.getDocuments();
        this.editDocuments = false;
    };
    ThreeObjectPropertyExplorer.prototype.propertiesChanged = function () {
        var props = [];
        var properties = Array.isArray(this.properties) ? this.properties : this.properties(this.object);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            if (prop.substr(-2) === '.*') {
                var key = prop.substr(0, prop.length - 2);
                var value = resolvePath(this.object, key);
                if (typeof value !== 'object') {
                    continue;
                }
                var subKeys = Object.keys(value);
                for (var _a = 0, subKeys_1 = subKeys; _a < subKeys_1.length; _a++) {
                    var subKey = subKeys_1[_a];
                    props.push(key + "[\"" + subKey + "\"]");
                }
            }
            else {
                props.push(prop);
            }
        }
        this.props = props;
    };
    ThreeObjectPropertyExplorer.prototype.value = function (prop) {
        var anyValue = resolvePath(this.object, prop);
        if (typeof anyValue === 'string' || typeof anyValue === 'number') {
            return anyValue;
        }
        else if (typeof anyValue === 'boolean') {
            return anyValue ? 'Yes' : 'No';
        }
        else {
            return typeof anyValue;
        }
    };
    ThreeObjectPropertyExplorer.prototype.label = function (prop) {
        return prop.replace('["', '.').replace('"]', '').split('.').join(' ');
    };
    ThreeObjectPropertyExplorer.prototype.downloadDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var preview, response, blob, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.instance.getFilePreview('documents', 'original', { fileId: document.filename })];
                    case 1:
                        preview = _a.sent();
                        return [4, this.instance.api.get(this.instance.getOneRoute(this.instance.id) + "?download=documents&fileId=" + document.filename, { etag: document.filename })];
                    case 2:
                        response = _a.sent();
                        return [4, response.blob()];
                    case 3:
                        blob = _a.sent();
                        url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                        return [2];
                }
            });
        });
    };
    __decorate([
        bindable,
        __metadata("design:type", THREE.Object3D)
    ], ThreeObjectPropertyExplorer.prototype, "object", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], ThreeObjectPropertyExplorer.prototype, "properties", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], ThreeObjectPropertyExplorer.prototype, "canEdit", void 0);
    ThreeObjectPropertyExplorer = __decorate([
        inject(TaskQueue),
        __metadata("design:paramtypes", [TaskQueue])
    ], ThreeObjectPropertyExplorer);
    return ThreeObjectPropertyExplorer;
}());
export { ThreeObjectPropertyExplorer };

//# sourceMappingURL=three-object-property-explorer.js.map
