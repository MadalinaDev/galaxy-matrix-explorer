export default function dijkstra(
  adjacencyMatrix: number[][],
  startNode: number,
  endNode: number
) {
  const numNodes = adjacencyMatrix.length;
  const distances: number[] = Array(numNodes).fill(Number.POSITIVE_INFINITY);
  const visited: number[] = [];
  const parent: number[] = Array(numNodes).fill(-1);
  const steps: any[] = [];

  distances[startNode] = 0;

  steps.push({
    visited: [...visited],
    distances: [...distances],
    parent: [...parent],
    current: null,
    message: `Starting Dijkstra's algorithm from node ${startNode}`,
  });

  for (let i = 0; i < numNodes; i++) {
    let minDistance = Number.POSITIVE_INFINITY;
    let current = -1;

    for (let j = 0; j < numNodes; j++) {
      if (!visited.includes(j) && distances[j] < minDistance) {
        minDistance = distances[j];
        current = j;
      }
    }

    if (current === -1) break;

    visited.push(current);

    steps.push({
      visited: [...visited],
      distances: [...distances],
      parent: [...parent],
      current,
      message: `Visiting node ${current} with distance ${distances[current]}`,
    });

    if (current === endNode) {
      steps.push({
        visited: [...visited],
        distances: [...distances],
        parent: [...parent],
        current,
        message: `Reached target node ${endNode} with shortest distance ${distances[endNode]}`,
      });
      break;
    }

    for (let neighbor = 0; neighbor < numNodes; neighbor++) {
      if (
        adjacencyMatrix[current][neighbor] !== Number.POSITIVE_INFINITY &&
        adjacencyMatrix[current][neighbor] !== 0 &&
        !visited.includes(neighbor)
      ) {
        const newDistance =
          distances[current] + adjacencyMatrix[current][neighbor];

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          parent[neighbor] = current;

          steps.push({
            visited: [...visited],
            distances: [...distances],
            parent: [...parent],
            current,
            message: `Updated distance to node ${neighbor} to ${newDistance}`,
          });
        }
      }
    }
  }

  if (distances[endNode] === Number.POSITIVE_INFINITY) {
    steps.push({
      visited: [...visited],
      distances: [...distances],
      parent: [...parent],
      current: null,
      message: `Could not reach target node ${endNode}`,
    });
  }

  return steps;
}
