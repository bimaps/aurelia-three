import * as THREE from 'three';
export declare class ThreeGeometry {
    private static registered;
    private static inited;
    private static init;
    static register(name: string, callback: () => THREE.BufferGeometry): void;
    static get(name: string, context?: any, ...params: any[]): THREE.BufferGeometry;
}
