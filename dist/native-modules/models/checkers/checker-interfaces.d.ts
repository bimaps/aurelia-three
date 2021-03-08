import * as THREE from 'three';
export declare type CheckerModuleType = 'filter' | 'extract' | 'math' | 'reducer' | 'if' | 'projection' | 'distance' | 'normal-distance' | 'output';
export declare const CheckerModuleTypeOptions: string[];
export declare type CheckerModuleIOType = 'scene' | 'three-objects' | 'three-object' | 'triangles' | 'triangle' | 'line3s' | 'line3' | 'vector3s' | 'vector3' | 'vector2s' | 'vector2' | 'box3s' | 'box3' | 'strings' | 'string' | 'numbers' | 'number' | 'booleans' | 'boolean' | 'json';
export declare const CheckerModuleIOTypeOptions: string[];
export declare type CheckerModuleIOTypeValue = THREE.Scene | THREE.Object3D[] | THREE.Object3D | THREE.Triangle | THREE.Triangle[] | THREE.Line3 | THREE.Line3[] | THREE.Vector3 | THREE.Vector3[] | THREE.Vector2 | THREE.Vector2[] | THREE.Box3 | THREE.Box3[] | string[] | string | number[] | number | boolean[] | boolean | CheckerJsonOutput[];
export declare type CheckerModuleIOStyle = 'default' | 'correct' | 'incorrect' | 'danger';
export declare const CheckerModuleIOStyleOptions: string[];
export interface CheckerJsonOutput {
    prefix: string;
    value: any;
    type: CheckerModuleIOType;
    ref: CheckerModuleIORef | CheckerModuleIORef[];
    style?: CheckerModuleIOStyle | CheckerModuleIOStyle[];
    suffix: string;
    display: 'paragraph' | 'blocks';
}
export declare type ReportOutput = {
    name: string;
    description: string;
    flows: FlowOutput[];
};
export declare type FlowOutput = {
    name: string;
    description: string;
    summaries: string[];
    outputs: {
        name: string;
        outputs: CheckerJsonOutput[];
    }[];
};
export declare type CheckerConditionOperator = 'or' | 'and';
export declare type CheckerExtractType = 'faces' | 'edges' | 'vertices' | 'wireframe' | 'property';
export declare const CheckerExtractTypeOptions: string[];
export interface CheckerObjectCondition {
    key: string;
    operation: string;
    value: string | Date;
}
export interface CheckerValueCondition {
    operation: string;
    value: string | Date;
}
export declare abstract class CheckerModule {
    abstract process(): Promise<void>;
}
export declare type CheckerModuleIORef = THREE.Object3D | THREE.Object3D[] | undefined;
export interface CheckerModuleBase {
    moduleType: CheckerModuleType;
    name: string;
    allowedInputTypes?: Array<CheckerModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputReference: CheckerModuleIORef | CheckerModuleIORef[];
    outputSummary?: string;
}
export interface CheckerModuleFilter extends CheckerModuleBase {
    conditions: Array<CheckerObjectCondition>;
    conditionsOperator: CheckerConditionOperator;
}
export interface CheckerModuleExtract extends CheckerModuleBase {
    extractType: CheckerExtractType;
    value: any;
    forceOutputAsNumber: boolean;
}
export interface CheckerModuleMath extends CheckerModuleBase {
    expression: string;
}
export declare type CheckerModuleReducerOperation = 'min' | 'max' | 'average' | 'count' | 'sum';
export declare const CheckerModuleReducerOperationOptions: string[];
export interface CheckerModuleReducer extends CheckerModuleBase {
    operation: CheckerModuleReducerOperation;
}
export declare type CheckerModuleIfOperation = {
    conditions: Array<CheckerValueCondition>;
    conditionsOperator: CheckerConditionOperator;
    outputValue: number | string | boolean;
    outputStyle: CheckerModuleIOStyle;
};
export declare type CheckerModuleIfOperations = Array<CheckerModuleIfOperation>;
export interface CheckerModuleIf extends CheckerModuleBase {
    defaultOutputValue: number | string | boolean;
    defaultOutputStyle: CheckerModuleIOStyle;
    operations: CheckerModuleIfOperations;
}
export interface CheckerModuleBbbox extends CheckerModuleBase {
}
export interface CheckerModuleProjection extends CheckerModuleBase {
    projectionAxis: 'x' | 'y' | 'z';
}
export interface CheckerModuleDistance extends CheckerModuleBase {
    distanceType: '2d-2d' | '3d-3d';
}
export interface CheckerModuleNormalDistance extends CheckerModuleBase {
    operation: 'min' | 'max';
}
export interface CheckerOutput {
    prefix: string;
    varName: string;
    suffix: string;
    display: 'paragraph' | 'blocks';
}
export interface CheckerModuleOutput extends CheckerModuleBase {
    outputs: CheckerOutput[];
}
export interface CheckerFlow {
    name: string;
    description: string;
    modulesIds: Array<string>;
}
