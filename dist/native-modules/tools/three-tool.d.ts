import { ThreeToolsService } from './three-tools-service';
import { ThreeCustomElement } from '../components/three';
export declare class ThreeTool {
    name: string;
    service: ThreeToolsService;
    active: boolean;
    three: ThreeCustomElement;
    constructor(service: ThreeToolsService);
    canRegister(): boolean;
    activate(three: ThreeCustomElement): void;
    deactivate(): void;
    onActivate(): void;
    onDeactivate(): void;
}
