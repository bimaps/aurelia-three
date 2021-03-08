import * as THREE from 'three';
export declare class ThreeGeometry {
    private static registered;
    private static inited;
    private static init;
    static register(name: string, callback: () => THREE.Geometry | THREE.BufferGeometry): void;
    static get(name: string, context?: any, ...params: any[]): THREE.Geometry | THREE.BufferGeometry;
}
