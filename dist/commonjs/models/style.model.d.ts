import { Model } from 'aurelia-deco';
export interface ThreePos {
    x: number;
    y: number;
    z: number;
}
export declare class ThreeStyleModel extends Model {
    id: string;
    siteId: string;
    name: string;
    display?: boolean;
    color?: string;
    material?: 'original' | 'basic' | 'phong' | 'texture';
    image?: any;
    opacity?: number;
    renderOrder?: number;
    displayLabel?: boolean;
    labelKey?: string;
    labelTemplate?: string;
    labelBackgroundColor?: string;
    labelTextColor?: string;
    labelScale?: number;
    labelCentroidMethod?: 'auto' | 'bbox' | 'polylabel';
    labelPosition?: ThreePos;
    labelOpacity?: number;
    icon?: boolean;
    iconKey?: string;
    iconDefault?: string;
    iconBackground?: string;
    iconForeground?: string;
    iconScale?: number;
    iconCentroidMethod?: 'auto' | 'bbox' | 'polylabel';
    iconPosition?: ThreePos;
    iconOpacity?: number;
    replaceGeometry?: boolean;
    geometryShape: 'cone' | 'sphere' | 'cube' | 'cylinder';
    geometryScale?: number;
    geometryPosition?: ThreePos;
    geometryRotation?: ThreePos;
    edgesDisplay?: boolean;
}
