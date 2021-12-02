"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeTool = void 0;
const aurelia_framework_1 = require("aurelia-framework");
class ThreeTool {
    constructor(service) {
        this.active = false;
        aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue).queueMicroTask(() => {
            this.service = service;
            if (this.canRegister()) {
                this.service.registerTool(this);
            }
        });
        return this;
    }
    canRegister() {
        return true;
    }
    activate(three) {
        this.three = three;
        this.active = true;
        this.onActivate();
    }
    deactivate() {
        this.onDeactivate();
        this.active = false;
    }
    onActivate() {
    }
    onDeactivate() {
    }
}
exports.ThreeTool = ThreeTool;

//# sourceMappingURL=three-tool.js.map
