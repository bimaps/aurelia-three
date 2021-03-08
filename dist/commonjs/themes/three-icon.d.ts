import * as THREE from 'three';
export declare class ThreeIcon {
    private static icons;
    static getTexture(input: string, backgroundColor: string, foregroundColor: string, text?: string): Promise<THREE.Texture>;
    private static getSvgFromUrl;
    private static textureFromStringOrUrlSvg;
    private static colorizeSvg;
}
