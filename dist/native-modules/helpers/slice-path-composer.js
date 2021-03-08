var SlicePathComposer = (function () {
    function SlicePathComposer() {
        this.openPaths = [];
        this.closedPaths = [];
    }
    Object.defineProperty(SlicePathComposer.prototype, "paths", {
        get: function () {
            return this.closedPaths;
        },
        enumerable: false,
        configurable: true
    });
    SlicePathComposer.prototype.idFromPoints = function (p1, p2) {
        var onefirst = false;
        if (p1.x < p2.x
            || p1.x === p2.x && p1.y < p2.y
            || p1.x === p2.x && p1.y === p2.y && p1.z < p2.z) {
            onefirst = true;
        }
        return onefirst
            ? p1.x + "," + p1.y + "," + p1.z + ":" + p2.x + "," + p2.y + "," + p2.z
            : p2.x + "," + p2.y + "," + p2.z + ":" + p1.x + "," + p1.y + "," + p1.z;
    };
    SlicePathComposer.prototype.addDoublePoints = function (pointA, A1, A2, pointB, B1, B2) {
        var idA = this.idFromPoints(A1, A2);
        var idB = this.idFromPoints(B1, B2);
        var addedToPath = null;
        for (var _i = 0, _a = this.openPaths; _i < _a.length; _i++) {
            var path = _a[_i];
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
            var newPath = {
                points: [pointA, pointB],
                idA: idA,
                idB: idB
            };
            this.openPaths.push(newPath);
        }
        else {
            this.tryToClosePath(addedToPath);
        }
    };
    SlicePathComposer.prototype.addToPath = function (path, point, position, newId) {
        if (position === 'A') {
            path.points.unshift(point);
            path.idA = newId;
        }
        else if (position === 'B') {
            path.points.push(point);
            path.idB = newId;
        }
    };
    SlicePathComposer.prototype.tryToClosePath = function (path) {
        var _a, _b, _c, _d;
        var joinedToPath = null;
        for (var _i = 0, _e = this.openPaths; _i < _e.length; _i++) {
            var otherPath = _e[_i];
            if (otherPath === path) {
                continue;
            }
            var points = [].concat.apply([], path.points);
            if (otherPath.idA === path.idA) {
                points.shift();
                points.reverse();
                (_a = otherPath.points).unshift.apply(_a, points.reverse());
                otherPath.idA = path.idB;
                joinedToPath = otherPath;
            }
            else if (otherPath.idA === path.idB) {
                points.pop();
                (_b = otherPath.points).unshift.apply(_b, points);
                otherPath.idA = path.idA;
                joinedToPath = otherPath;
            }
            else if (otherPath.idB === path.idA) {
                points.shift();
                (_c = otherPath.points).push.apply(_c, points);
                otherPath.idB = path.idB;
                joinedToPath = otherPath;
            }
            else if (otherPath.idB === path.idB) {
                points.pop();
                (_d = otherPath.points).push.apply(_d, points.reverse());
                otherPath.idB = path.idA;
                joinedToPath = otherPath;
            }
        }
        if (joinedToPath) {
            var index = this.openPaths.indexOf(path);
            if (index !== -1) {
                this.openPaths.splice(index, 1);
            }
            return this.tryToClosePath(joinedToPath);
        }
        if (path.idA === path.idB) {
            var index = this.openPaths.indexOf(path);
            if (index !== -1) {
                this.openPaths.splice(index, 1);
                this.closedPaths.push(path.points);
            }
        }
    };
    return SlicePathComposer;
}());
export { SlicePathComposer };

//# sourceMappingURL=slice-path-composer.js.map
