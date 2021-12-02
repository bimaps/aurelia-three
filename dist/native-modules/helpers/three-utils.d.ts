import { Box3, Object3D, Vector3, Mesh, Plane, PlaneGeometry } from 'three';
import { Line3, MeshBasicMaterial } from 'three';
export declare class ThreeUtils {
    static bboxFromObject(object: Object3D): Box3;
    static bboxFromObjects(objects: Array<Object3D>): Box3 | null;
    static isBbox000(bbox: Box3): boolean;
    static centroidFromBbox(bbox: Box3): Vector3;
    static centroidFromObject(object: Object3D): Vector3;
    static centroidFromObjects(objects: Array<Object3D>): Vector3 | null;
    static edgesFromObject(object: Mesh): Line3[];
    static textureText(text: string, font?: string, paddingX?: number, paddingY?: number): Mesh<PlaneGeometry, MeshBasicMaterial>;
    static PlaneHelper(plane: Plane, size?: number): Mesh<PlaneGeometry, MeshBasicMaterial>;
    static intersectPlane(p1: any, p2: any, plane: any): {
        vertex: any;
        normal: any;
        uv: any;
    };
    static facePosition(plane: any, points: any): string;
    static vertexPosition(plane: Plane, vertex: any): string;
    static centroidOfPolygon(arr: any): number[];
    static isPointInsidePolygon(point: any, polygon: any): boolean;
    static planeConstantNormalToPositionDirection(constant: number, normal: Vector3): {
        position: Vector3;
        direction: Vector3;
    };
    static planePositionDirectionToConstantNormal(position: Vector3, direction: Vector3): {
        constant: number;
        normal: Vector3;
    };
}
