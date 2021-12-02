var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { modelsByType } from './checker-internals';
import { Model } from 'aurelia-deco';
import { Container } from 'aurelia-framework';
export class CheckerModuleBaseModel extends Model {
    static getOne(flowId, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = Container.instance.get('sd-global');
            const api = global.swissdataApi;
            const response = yield api.get(`/three/checker/flow/${flowId}/module/${moduleId}`);
            const data = yield response.json();
            if (!data || !data.moduleType) {
                throw new Error('Module not found');
            }
            const model = modelsByType[data.moduleType];
            if (!model) {
                throw new Error('Invalid module type');
            }
            const instance = model.instanceFromElement(data);
            return yield instance.updateInstanceFromElement(data);
        });
    }
    static create(data) {
        if (!modelsByType[data.moduleType]) {
            throw new Error('Invalid module type');
        }
        let instance = new modelsByType[data.moduleType];
        if (instance) {
            for (const key in data) {
                instance.set(key, data[key]);
            }
            return instance;
        }
        return undefined;
    }
}

//# sourceMappingURL=checker-module-base.model.js.map
