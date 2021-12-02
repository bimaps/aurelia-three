"use strict";
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
exports.CheckerModuleBaseModel = void 0;
const checker_internals_1 = require("./checker-internals");
const aurelia_deco_1 = require("aurelia-deco");
const aurelia_framework_1 = require("aurelia-framework");
class CheckerModuleBaseModel extends aurelia_deco_1.Model {
    static getOne(flowId, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = aurelia_framework_1.Container.instance.get('sd-global');
            const api = global.swissdataApi;
            const response = yield api.get(`/three/checker/flow/${flowId}/module/${moduleId}`);
            const data = yield response.json();
            if (!data || !data.moduleType) {
                throw new Error('Module not found');
            }
            const model = checker_internals_1.modelsByType[data.moduleType];
            if (!model) {
                throw new Error('Invalid module type');
            }
            const instance = model.instanceFromElement(data);
            return yield instance.updateInstanceFromElement(data);
        });
    }
    static create(data) {
        if (!checker_internals_1.modelsByType[data.moduleType]) {
            throw new Error('Invalid module type');
        }
        let instance = new checker_internals_1.modelsByType[data.moduleType];
        if (instance) {
            for (const key in data) {
                instance.set(key, data[key]);
            }
            return instance;
        }
        return undefined;
    }
}
exports.CheckerModuleBaseModel = CheckerModuleBaseModel;

//# sourceMappingURL=checker-module-base.model.js.map
