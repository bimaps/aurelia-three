import { ThreeTool } from "./three-tool";
import { ThreeCustomElement } from '../components/three';
export declare class ThreeToolsService {
    private registeredTools;
    private currentTool;
    three: ThreeCustomElement;
    get currentToolName(): string;
    constructor(three: ThreeCustomElement);
    registerTool(tool: ThreeTool): void;
    deactivateAll(): void;
    activate(tool: ThreeTool | string): void;
    getRegisteredTool(toolName: string): ThreeTool;
}
