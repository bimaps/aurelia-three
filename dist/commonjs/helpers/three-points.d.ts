import { ThreeCustomElement } from './../components/three';
import { PointCloudOctree, Potree } from '@pnext/three-loader';
export declare class ThreePoints {
    private log;
    potree: Potree;
    private pointsBudgets;
    pointClouds: PointCloudOctree[];
    private scene;
    private pointsScene;
    private overlayScene;
    private subscriptions;
    private three;
    constructor(three: ThreeCustomElement);
    subscribe(event: string, callback: any): void;
    clearScene(): void;
    load(baseUrl: string, filename?: string, name?: string): Promise<PointCloudOctree>;
    showPcoBbox(pco: PointCloudOctree): void;
    get rootPoints(): Array<PointCloudOctree>;
    zoomOnPco(pco: PointCloudOctree): void;
}
