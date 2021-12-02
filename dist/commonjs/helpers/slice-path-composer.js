"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlicePathComposer = void 0;
class SlicePathComposer {
    constructor() {
        this.openPaths = [];
        this.closedPaths = [];
    }
    get paths() {
        return this.closedPaths;
    }
    idFromPoints(p1, p2) {
        let onefirst = false;
        if (p1.x < p2.x
            || p1.x === p2.x && p1.y < p2.y
            || p1.x === p2.x && p1.y === p2.y && p1.z < p2.z) {
            onefirst = true;
        }
        return onefirst
            ? `${p1.x},${p1.y},${p1.z}:${p2.x},${p2.y},${p2.z}`
            : `${p2.x},${p2.y},${p2.z}:${p1.x},${p1.y},${p1.z}`;
    }
    addDoublePoints(pointA, A1, A2, pointB, B1, B2) {
        const idA = this.idFromPoints(A1, A2);
        const idB = this.idFromPoints(B1, B2);
        let addedToPath = null;
        for (let path of this.openPaths) {
            if (path.idA === idA) {
                this.addToPath(path, pointB, 'A', idB);
                addedToPath = path;
                break;
            }
            else if (path.idA === idB) {
                this.addToPath(path, pointA, 'A', idA);
                addedToPath = path;
                break;
            }
            else if (path.idB === idA) {
                this.addToPath(path, pointB, 'B', idB);
                addedToPath = path;
                break;
            }
            else if (path.idB === idB) {
                this.addToPath(path, pointA, 'B', idA);
                addedToPath = path;
                break;
            }
        }
        if (addedToPath === null) {
            const newPath = {
                points: [pointA, pointB],
                idA,
                idB
            };
            this.openPaths.push(newPath);
        }
        else {
            this.tryToClosePath(addedToPath);
        }
    }
    addToPath(path, point, position, newId) {
        if (position === 'A') {
            path.points.unshift(point);
            path.idA = newId;
        }
        else if (position === 'B') {
            path.points.push(point);
            path.idB = newId;
        }
    }
    tryToClosePath(path) {
        let joinedToPath = null;
        for (let otherPath of this.openPaths) {
            if (otherPath === path) {
                continue;
            }
            const points = [].concat(...path.points);
            if (otherPath.idA === path.idA) {
                points.shift();
                points.reverse();
                otherPath.points.unshift(...points.reverse());
                otherPath.idA = path.idB;
                joinedToPath = otherPath;
            }
            else if (otherPath.idA === path.idB) {
                points.pop();
                otherPath.points.unshift(...points);
                otherPath.idA = path.idA;
                joinedToPath = otherPath;
            }
            else if (otherPath.idB === path.idA) {
                points.shift();
                otherPath.points.push(...points);
                otherPath.idB = path.idB;
                joinedToPath = otherPath;
            }
            else if (otherPath.idB === path.idB) {
                points.pop();
                otherPath.points.push(...points.reverse());
                otherPath.idB = path.idA;
                joinedToPath = otherPath;
            }
        }
        if (joinedToPath) {
            const index = this.openPaths.indexOf(path);
            if (index !== -1) {
                this.openPaths.splice(index, 1);
            }
            return this.tryToClosePath(joinedToPath);
        }
        if (path.idA === path.idB) {
            const index = this.openPaths.indexOf(path);
            if (index !== -1) {
                this.openPaths.splice(index, 1);
                this.closedPaths.push(path.points);
            }
        }
    }
}
exports.SlicePathComposer = SlicePathComposer;

//# sourceMappingURL=slice-path-composer.js.map
