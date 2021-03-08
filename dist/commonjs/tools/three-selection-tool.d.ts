import { ThreeTool } from './three-tool';
import * as THREE from 'three';
export interface SelectionMaterial {
    material: THREE.Material | 'original';
    overlay?: THREE.MeshBasicMaterial;
    wireframe?: THREE.MeshBasicMaterial;
}
export interface SelectionStyle {
    excluded: SelectionMaterial;
    unselected: SelectionMaterial;
    hover: SelectionMaterial;
    selected: SelectionMaterial;
    ghost: SelectionMaterial;
}
export interface THREESelectedObject extends THREE.Object3D {
    __selectGhost?: THREESelectionGhost;
}
export interface THREESelectionGhost extends THREE.LineSegments {
    __isGhost: boolean;
}
export declare type ThreeSelectionTypes = 'select' | 'add' | 'remove';
export declare class ThreeSelectionTool extends ThreeTool {
    name: string;
    type: ThreeSelectionTypes;
    rootObject: THREE.Object3D;
    selectableObjects: THREE.Object3D[];
    objects: Array<THREESelectedObject>;
    private subscriptions;
    private style;
    private keydowns;
    onActivate(): void;
    onDeactivate(): void;
    handleEvent(event: KeyboardEvent): void;
    setStyle(style: string): void;
    setRootStyles(): void;
    clearSelectionStyle(): void;
    applySelectionStyle(object: THREE.Object3D, style: SelectionStyle, type: 'excluded' | 'unselected' | 'hover' | 'selected' | 'ghost' | 'auto', force?: boolean): void;
    get isRoot(): boolean;
    all(type?: ThreeSelectionTypes): void;
    none(type?: ThreeSelectionTypes): boolean;
    get selectionHasChildren(): boolean;
    getFirstObjectWithChildren(): THREESelectedObject;
    selectChildren(): void;
    toggleType(type: 'add' | 'remove'): void;
    setType(type?: ThreeSelectionTypes): void;
    filterObjects?: (type: 'hover' | 'click', intersections: THREE.Intersection[]) => THREE.Intersection[];
    handleCursor(type: 'hover' | 'click', intersections: THREE.Intersection[]): void;
    private setSelectedObjects;
    addObjectsToSelection(objects: Array<THREE.Object3D>): void;
    removeObjectsFromSelection(objects: Array<THREE.Object3D>): void;
    get hasSelection(): boolean;
    get box(): THREE.Box3;
    get center(): THREE.Vector3;
    clearSelectionStyles(): void;
    applySelectionStyles(): void;
}
