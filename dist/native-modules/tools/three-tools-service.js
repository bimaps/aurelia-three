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
var ThreeToolsService = (function () {
    function ThreeToolsService(three) {
        this.registeredTools = {};
        this.three = three;
    }
    Object.defineProperty(ThreeToolsService.prototype, "currentToolName", {
        get: function () {
            if (!this.currentTool)
                return '';
            return this.currentTool.name;
        },
        enumerable: false,
        configurable: true
    });
    ThreeToolsService.prototype.registerTool = function (tool) {
        if (!tool.name)
            throw new Error('Tool must have a name');
        if (this.registeredTools[tool.name])
            throw new Error('Another tool with the same name is already registered');
        this.registeredTools[tool.name] = tool;
    };
    ThreeToolsService.prototype.deactivateAll = function () {
        if (this.currentTool) {
            this.currentTool.deactivate();
        }
        this.currentTool = null;
    };
    ThreeToolsService.prototype.activate = function (tool) {
        var toolToActivate;
        if (typeof tool === 'string' && this.registeredTools[tool]) {
            toolToActivate = this.registeredTools[tool];
        }
        else {
            for (var toolName in this.registeredTools) {
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
    };
    ThreeToolsService.prototype.getRegisteredTool = function (toolName) {
        return this.registeredTools[toolName];
    };
    __decorate([
        computedFrom('currentTool', 'currentTool.name'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ThreeToolsService.prototype, "currentToolName", null);
    return ThreeToolsService;
}());
export { ThreeToolsService };

//# sourceMappingURL=three-tools-service.js.map
