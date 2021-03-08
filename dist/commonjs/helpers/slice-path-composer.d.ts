export interface OpenPath {
    points: Array<THREE.Vector3>;
    idA: string;
    idB: string;
}
export declare class SlicePathComposer {
    private openPaths;
    private closedPaths;
    get paths(): Array<Array<THREE.Vector3>>;
    private idFromPoints;
    addDoublePoints(pointA: THREE.Vector3, A1: THREE.Vector3, A2: THREE.Vector3, pointB: THREE.Vector3, B1: THREE.Vector3, B2: THREE.Vector3): void;
    private addToPath;
    private tryToClosePath;
}
