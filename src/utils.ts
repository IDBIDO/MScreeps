import {transformRoadToAdjacentList} from "@/init_mem/computePlanning/planningUtils";

export function getMovementPath(posList:[number, number][]): number[] {
    const adjacentList = transformRoadToAdjacentList(posList);
    const path = findHamiltonianPath(adjacentList);

    let detailPath = [];
    for (let i = 0; i < path.length; i++) {
        //console.log(posList[path[i]])
        detailPath.push(posList[path[i]]);
    }
    detailPath.push(posList[path[0]]);
    console.log(computeMovementVector(detailPath))

    return computeMovementVector(detailPath)
}

function findHamiltonianPath(graph: number[][]): number[] | null {
    const numVertices = graph.length;
    const path: number[] = [];

    function isHamiltonianPath(currentPath: number[]): boolean {
        if (currentPath.length === numVertices) {
            return true; // Found a Hamiltonian path
        }

        const lastVertex = currentPath[currentPath.length - 1];
        for (const neighbor of graph[lastVertex]) {
            if (!currentPath.includes(neighbor)) {
                currentPath.push(neighbor);
                if (isHamiltonianPath(currentPath)) {
                    return true;
                }
                currentPath.pop(); // Backtrack
            }
        }

        return false;
    }

    // Try starting from each vertex as the initial vertex
    for (let startVertex = 0; startVertex < numVertices; startVertex++) {
        path.push(startVertex);
        if (isHamiltonianPath(path)) {
            return path; // Found a Hamiltonian path
        }
        path.pop();
    }

    return null; // No Hamiltonian path found
}

// Helper function to calculate the cross product of three points
function crossProduct(a: [number, number], b: [number, number], c: [number, number]): number {
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return cross;
}

export function computeMovementVector(path: [number, number][]): number[] {
    const movements: number[] = [];
    for (let i = 1; i < path.length; i++) {
        const dx = path[i][0] - path[i - 1][0];
        const dy = path[i][1] - path[i - 1][1];
        let movement: number;

        if (dx === 0 && dy === -1) {
            movement = TOP;
        } else if (dx === 1 && dy === -1) {
            movement = TOP_RIGHT;
        } else if (dx === 1 && dy === 0) {
            movement = RIGHT;
        } else if (dx === 1 && dy === 1) {
            movement = BOTTOM_RIGHT;
        } else if (dx === 0 && dy === 1) {
            movement = BOTTOM;
        } else if (dx === -1 && dy === 1) {
            movement = BOTTOM_LEFT;
        } else if (dx === -1 && dy === 0) {
            movement = LEFT;
        } else if (dx === -1 && dy === -1) {
            movement = TOP_LEFT;
        } else {
            throw new Error('Invalid movement between points.');
        }

        movements.push(movement);
    }
    return movements;
}


export function countStructure(room: string, structureType: StructureConstant): number {
    return Game.rooms[room].find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === structureType;
        }
    }).length;
}

// Function to create an object with all properties set to null
export function createNullObject<T extends Record<string, any>>(type: T): T {
    const nullObject: T = {} as T;
    for (const key in type) {
        if (type.hasOwnProperty(key)) {
            nullObject[key] = null;
        }
    }
    return nullObject;
}
/**
  * 把 obj2 的原型合并到 obj1 的原型上
  * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
  * @param obj1 要挂载到的对象
  * @param obj2 要进行挂载的对象
  */
 export const assignPrototype = function(obj1: {[key: string]: any}, obj2: {[key: string]: any}) {
     Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
         if (key.includes('Getter')) {
             Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                 get: obj2.prototype[key],
                 enumerable: false,
                 configurable: true
             })
         }
         
         else obj1.prototype[key] = obj2.prototype[key]
     })
 }


export function connectedComponents(adj) {
  var numVertices = adj.length
  var visited = new Array(numVertices)
  for(var i=0; i<numVertices; ++i) {
    visited[i] = false
  }
  var components = []
  for(var i=0; i<numVertices; ++i) {
    if(visited[i]) {
      continue
    }
    var toVisit = [i]
    var cc = [i]
    visited[i] = true
    while(toVisit.length > 0) {
      var v = toVisit.pop()
      var nbhd = adj[v]
      for(var j=0; j<nbhd.length; ++j) {
        var u = nbhd[j]
        if(!visited[u]) {
          visited[u] = true
          toVisit.push(u)
          cc.push(u)
        }
      }
    }
    components.push(cc)
  }
  return components
}

export function binarySearch (arr, x, start, end) {
      
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid=Math.floor((start + end)/2);

  // Compare mid with given key x
  if (arr[mid]===x) return true;
       
  // If element at mid is greater than x,
  // search in the left half of mid
  if(arr[mid] > x)
      return binarySearch(arr, x, start, mid-1);
  else

      // If element at mid is smaller than x,
      // search in the right half of mid
      return binarySearch(arr, x, mid+1, end);
}

export function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem);
      }
  }
  return _intersection;
}

export function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}


export function adjacentCanStandPosition(roomName: string, pos: RoomPosition) {
    // @ts-ignore
    let adjPos = pos.getAdjacentPositions();
    let adjCanStandPos = [];
    for (let i = 0; i < adjPos.length; i++) {
        if (adjPos[i].isWalkable()) {
            adjCanStandPos.push(adjPos[i]);
        }
    }
    return adjCanStandPos;
}

