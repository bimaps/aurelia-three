import { ThreeTool } from './three-tool';
import { CursorPlanesIntersects } from '../components/three';
import * as THREE from 'three';
export declare class ThreeTranslationTool extends ThreeTool {
    name: string;
    translating: boolean;
    axisConstraint: 'X' | 'Y' | 'Z' | 'XY' | 'XZ' | 'YZ' | null;
    translateVector: THREE.Vector3 | null;
    private translationStart;
    private objectsOriginalPositions;
    private overlayTool;
    private subscriptions;
    private log;
    private select;
    activeTranslationTool(): void;
    canRegister(): boolean;
    onActivate(): void;
    onDeactivate(): void;
    toggleTranslationTool(): void;
    private setConstraint;
    handlePlanesIntersects(data: CursorPlanesIntersects): void;
    private updateGhostPosition;
    private displayTranslateOverlayTool;
    private hideTranslateOverlayTool;
    private createOverlayTool;
    private adjustOverlayToolPosition;
    private adjustOverlayToolZoom;
    private adjustActiveTool;
}
