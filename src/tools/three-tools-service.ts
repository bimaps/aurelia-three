import { ThreeTool } from "./three-tool";
import { StringTMap } from "aurelia-resources";
import { ThreeCustomElement, CursorPlanesIntersects } from '../components/three';
import { computedFrom } from "aurelia-binding";

export class ThreeToolsService {

  private registeredTools: StringTMap<ThreeTool> = {};
  private currentTool: ThreeTool | null;
  public three: ThreeCustomElement;

  @computedFrom('currentTool', 'currentTool.name')
  get currentToolName(): string {
    if (!this.currentTool) return '';
    return this.currentTool.name;
  }

  constructor(three: ThreeCustomElement) {
    this.three = three;
  }

  public registerTool(tool: ThreeTool) {
    if (!tool.name) throw new Error('Tool must have a name');
    if (this.registeredTools[tool.name]) throw new Error('Another tool with the same name is already registered');
    this.registeredTools[tool.name] = tool;
  }

  public deactivateAll() {
    if (this.currentTool) {
      this.currentTool.deactivate();
    }
    this.currentTool = null;
  }

  public activate(tool: ThreeTool | string) {
    let toolToActivate: ThreeTool;
    if (typeof tool === 'string' && this.registeredTools[tool]) {
      toolToActivate = this.registeredTools[tool];
    } else {
      for (let toolName in this.registeredTools) {
        if (this.registeredTools[toolName] === tool) {
          toolToActivate = this.registeredTools[toolName];
        }
      }
    }
    if (!toolToActivate) throw new Error('Tool not registered');

    if (toolToActivate === this.currentTool) return;

    if (this.currentTool) {
      this.currentTool.deactivate();
    }
    toolToActivate.activate(this.three);
    this.currentTool = toolToActivate;
  }

  getRegisteredTool(toolName: string) {
    return this.registeredTools[toolName];
  }

}
