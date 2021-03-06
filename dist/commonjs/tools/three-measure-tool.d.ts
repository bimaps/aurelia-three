import { ThreeToolsService } from './three-tools-service';
import { ThreeTool } from './three-tool';
import { CursorRawProcessingData } from '../components/three';
import * as THREE from 'three';
import { SpriteText2D } from 'three-text2d';
export declare type ThreeMeasureType = 'distance' | 'horizontal' | 'surface' | 'volume';
export declare type ThreeMeasureSnapping = 'summit' | 'edge';
export interface ThreeMeasure {
    coords: Array<THREE.Vector3>;
    volumeLastCoord?: THREE.Vector3;
    type: ThreeMeasureType;
    value: number;
    display?: {
        points?: THREE.Mesh[];
        lines?: THREE.Line[];
        labels?: SpriteText2D[];
    };
}
export declare class ThreeMeasureTool extends ThreeTool {
    name: string;
    private measures;
    type: ThreeMeasureType;
    volumeStep: 'surface' | 'height';
    snapping: ThreeMeasureSnapping;
    snappingThreshold: number;
    private computedSnappingThreshold;
    private subscriptions;
    private overlayTool;
    private currentMeasure;
    private currentPoint;
    private currentMeasureCoordinates;
    filterObjects?: (type: 'up' | 'down' | 'move', objects: THREE.Intersection[]) => THREE.Intersection[];
    constructor(service: ThreeToolsService);
    onActivate(): void;
    onDeactivate(): void;
    toggleMeasureTool(toggleWith?: ThreeTool): void;
    isMeasuring: boolean;
    setType(type: ThreeMeasureType): void;
    volumeNextStep(): void;
    handleCursor(data: CursorRawProcessingData): void;
    private findClosestSummit;
    private displayCurrentClosestPoint;
    private hideCurrentClosestPoint;
    private displayCurrentMeasureCoordinates;
    private hideCurrentMeasureCoordinates;
    private displayMeasures;
    private hideMeasures;
    private generateMeasureObject;
    private addCoordinate;
    endMeasuring(): void;
    private clearMeasuring;
    private clearMeasures;
    removeMeasure(measure: ThreeMeasure): void;
    private displayMeasureOverlayTool;
    private hideMeasureOverlayTool;
    private createOverlayTool;
    private adjustOverlayToolPosition;
    private adjustOverlayToolZoom;
    private adjustActiveTool;
    private generateEdges;
    private removeEdges;
}
