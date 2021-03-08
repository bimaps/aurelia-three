import * as THREE from 'three';
// ObjectId

export type CheckerModuleType = 'filter' | 'extract' | 'math' | 'reducer' | 'if' | 'projection' | 'distance' | 'normal-distance' | 'output';
export const CheckerModuleTypeOptions = ['filter', 'extract', 'math', 'reducer', 'if', 'projection', 'distance', 'normal-distance', 'output'];

export type CheckerModuleIOType = 'scene' | 'three-objects' | 'three-object' | 'triangles' | 'triangle' | 'line3s' | 'line3' | 'vector3s' | 'vector3' | 'vector2s' | 'vector2' | 'box3s' | 'box3' | 'strings' | 'string' | 'numbers' | 'number' | 'booleans' | 'boolean' | 'json';
export const CheckerModuleIOTypeOptions = ['scene', 'three-objects', 'three-object', 'triangles', 'triangle', 'line3s', 'line3', 'vector3s', 'vector3', 'vector2s', 'vector2', 'box3s', 'box3', 'strings', 'string', 'numbers', 'number', 'booleans', 'boolean', 'json'];
export type CheckerModuleIOTypeValue = THREE.Scene | THREE.Object3D[] | THREE.Object3D | THREE.Triangle | THREE.Triangle[] | THREE.Line3 | THREE.Line3[] | THREE.Vector3 | THREE.Vector3[] | THREE.Vector2 | THREE.Vector2[] | THREE.Box3 | THREE.Box3[] | string[] | string | number[] | number | boolean[] | boolean | CheckerJsonOutput[];

export type CheckerModuleIOStyle = 'default' | 'correct' | 'incorrect' | 'danger';
export const CheckerModuleIOStyleOptions = ['default', 'correct', 'incorrect', 'danger'];
export interface CheckerJsonOutput {
    prefix: string;
    value: any;
    type: CheckerModuleIOType;
    ref: CheckerModuleIORef | CheckerModuleIORef[];
    style?: CheckerModuleIOStyle | CheckerModuleIOStyle[];
    suffix: string;
    display: 'paragraph' | 'blocks';
}

export type ReportOutput = {
  name: string;
  description: string;
  flows: FlowOutput[]
};

export type FlowOutput = {
  name: string;
  description: string;
  summaries: string[],
  outputs: {name: string, outputs: CheckerJsonOutput[]}[]
};

export type CheckerConditionOperator = 'or' | 'and';

export type CheckerExtractType = 'faces' | 'edges' | 'vertices' | 'wireframe' | 'property';
export const CheckerExtractTypeOptions = ['faces', 'edges', 'vertices', 'wireframe', 'property'];

export interface CheckerObjectCondition {
    key: string;
    operation: string;
    value: string | Date;
}

export interface CheckerValueCondition {
    operation: string;
    value: string | Date;
}

export abstract class CheckerModule {
    public abstract async process(): Promise<void>;
}


export type CheckerModuleIORef = THREE.Object3D | THREE.Object3D[] | undefined;

export interface CheckerModuleBase {
    moduleType: CheckerModuleType;
    name: string;
    allowedInputTypes?: Array<CheckerModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputReference: CheckerModuleIORef | CheckerModuleIORef[];
    outputSummary?: string;
}

export interface CheckerModuleFilter extends CheckerModuleBase {
    // allowedInputType = ['three-objects'];
    conditions: Array<CheckerObjectCondition>;
    conditionsOperator: CheckerConditionOperator;
    // outputType = 'three-objects';
}

export interface CheckerModuleExtract extends CheckerModuleBase {
    // allowedInputType = ['three-objects', 'three-object'];
    extractType: CheckerExtractType;
    value: any;
    forceOutputAsNumber: boolean;
    // outputType = 'numbers' | 'strings' | 'booleans';
}

export interface CheckerModuleMath extends CheckerModuleBase {
    // allowedInputType = ['numbers', 'number'];
    expression: string;
    // outputType = 'numbers' | 'number';
}

export type CheckerModuleReducerOperation = 'min' | 'max' | 'average' | 'count' | 'sum';
export const CheckerModuleReducerOperationOptions = ['min', 'max', 'average', 'count', 'sum'];
export interface CheckerModuleReducer extends CheckerModuleBase {
    // allowedInputType = ['numbers', 'number'];
    operation: CheckerModuleReducerOperation;
    // outputType = 'numbers' | 'number';
}

export type CheckerModuleIfOperation = {
    conditions: Array<CheckerValueCondition>;
    conditionsOperator: CheckerConditionOperator;
    outputValue: number | string | boolean;
    outputStyle: CheckerModuleIOStyle;
}
export type CheckerModuleIfOperations = Array<CheckerModuleIfOperation>;
export interface CheckerModuleIf extends CheckerModuleBase {
    // allowedInputType = ['numbers', 'number'];
    defaultOutputValue: number | string | boolean;
    defaultOutputStyle: CheckerModuleIOStyle;
    operations: CheckerModuleIfOperations;
    // outputType = 'numbers' | 'strings' | 'booleans';
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
