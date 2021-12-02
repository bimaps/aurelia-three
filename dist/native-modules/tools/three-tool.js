import { Container, TaskQueue } from 'aurelia-framework';
export class ThreeTool {
    constructor(service) {
        this.active = false;
        Container.instance.get(TaskQueue).queueMicroTask(() => {
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

//# sourceMappingURL=three-tool.js.map
