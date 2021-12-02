var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { computedFrom } from "aurelia-binding";
export class ThreeToolsService {
    constructor(three) {
        this.registeredTools = {};
        this.three = three;
    }
    get currentToolName() {
        if (!this.currentTool)
            return '';
        return this.currentTool.name;
    }
    registerTool(tool) {
        if (!tool.name)
            throw new Error('Tool must have a name');
        if (this.registeredTools[tool.name])
            throw new Error('Another tool with the same name is already registered');
        this.registeredTools[tool.name] = tool;
    }
    deactivateAll() {
        if (this.currentTool) {
            this.currentTool.deactivate();
        }
        this.currentTool = null;
    }
    activate(tool) {
        let toolToActivate;
        if (typeof tool === 'string' && this.registeredTools[tool]) {
            toolToActivate = this.registeredTools[tool];
        }
        else {
            for (let toolName in this.registeredTools) {
                if (this.registeredTools[toolName] === tool) {
                    toolToActivate = this.registeredTools[toolName];
                }
            }
        }
        if (!toolToActivate)
            throw new Error('Tool not registered');
        if (toolToActivate === this.currentTool)
            return;
        if (this.currentTool) {
            this.currentTool.deactivate();
        }
        toolToActivate.activate(this.three);
        this.currentTool = toolToActivate;
    }
    getRegisteredTool(toolName) {
        return this.registeredTools[toolName];
    }
}
__decorate([
    computedFrom('currentTool', 'currentTool.name'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ThreeToolsService.prototype, "currentToolName", null);

//# sourceMappingURL=three-tools-service.js.map
