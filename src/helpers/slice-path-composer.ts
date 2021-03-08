export interface OpenPath {
  points: Array<THREE.Vector3>;
  idA: string;
  idB: string;
}

export class SlicePathComposer {
  
  private openPaths: Array<OpenPath> = [];
  private closedPaths: Array<Array<THREE.Vector3>> = [];

  public get paths(): Array<Array<THREE.Vector3>> {
    return this.closedPaths;
  }

  private idFromPoints(p1: THREE.Vector3, p2: THREE.Vector3) {
    let onefirst: boolean = false;
    if (p1.x < p2.x 
        || p1.x === p2.x && p1.y < p2.y
        || p1.x === p2.x && p1.y === p2.y && p1.z < p2.z) {
          onefirst = true;
    }
    return onefirst
            ? `${p1.x},${p1.y},${p1.z}:${p2.x},${p2.y},${p2.z}`
            : `${p2.x},${p2.y},${p2.z}:${p1.x},${p1.y},${p1.z}`;
  }

  public addDoublePoints(pointA: THREE.Vector3, A1: THREE.Vector3, A2: THREE.Vector3, pointB: THREE.Vector3, B1: THREE.Vector3, B2: THREE.Vector3) {
    const idA = this.idFromPoints(A1, A2);
    const idB = this.idFromPoints(B1, B2);

    let addedToPath: OpenPath | null = null;
    for (let path of this.openPaths) {
      if (path.idA === idA) {
        // add the point B at the beginning
        this.addToPath(path, pointB, 'A', idB);
        addedToPath = path;
        break;
      } else if (path.idA === idB) {
        // add the point A at the beginning
        this.addToPath(path, pointA, 'A', idA);
        addedToPath = path;
        break;
      } else if (path.idB === idA) {
        // add the point B at the end
        this.addToPath(path, pointB, 'B', idB);
        addedToPath = path;
        break;
      } else if (path.idB === idB) {
        // add the point A at the end
        this.addToPath(path, pointA, 'B', idA);
        addedToPath = path;
        break;
      }
    }
    if (addedToPath === null) {
      // create a new OpenPath with these points
      const newPath: OpenPath = {
        points: [pointA, pointB],
        idA,
        idB
      };
      this.openPaths.push(newPath);
    } else {
      // try to close the path
      this.tryToClosePath(addedToPath);
    }
  }

  private addToPath(path: OpenPath, point: THREE.Vector3, position: 'A' | 'B', newId: string) {
    if (position === 'A') {
      path.points.unshift(point);
      path.idA = newId;
    } else if (position === 'B') {
      path.points.push(point);
      path.idB = newId;
    }
  }

  private tryToClosePath(path: OpenPath) {

    // first we try to join this path with another from the openPaths array
    let joinedToPath: OpenPath | null = null;
    for (let otherPath of this.openPaths) {
      if (otherPath === path) {
        continue;
      }
      const points = [].concat(...path.points);
      if (otherPath.idA === path.idA) {
        // add a reversed path to the begining of otherPath
        points.shift();
        points.reverse();
        otherPath.points.unshift(...points.reverse());
        otherPath.idA = path.idB;
        joinedToPath = otherPath;
      } else if (otherPath.idA === path.idB) {
        // add path to the beginning of otherPath
        points.pop();
        otherPath.points.unshift(...points);
        otherPath.idA = path.idA;
        joinedToPath = otherPath;
      } else if (otherPath.idB === path.idA) {
        // add path to the end of otherPath
        points.shift();
        otherPath.points.push(...points);
        otherPath.idB = path.idB;
        joinedToPath = otherPath;
      } else if (otherPath.idB === path.idB) {
        // add a reversed path to the end of otherPath
        points.pop();
        otherPath.points.push(...points.reverse());
        otherPath.idB = path.idA;
        joinedToPath = otherPath;
      }
    }

    if (joinedToPath) {
      // remove the joined path
      const index = this.openPaths.indexOf(path);
      if (index !== -1) {
        this.openPaths.splice(index, 1);
      }
      // try to join the otherPath
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
