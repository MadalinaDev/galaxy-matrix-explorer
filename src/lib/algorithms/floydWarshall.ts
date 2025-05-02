export default function floydWarshall(
  adjacencyMatrix: number[][],
  startNode: number,
  endNode: number
) {
  const numNodes = adjacencyMatrix.length;
  const steps: any[] = [];

  const distances: number[][] = adjacencyMatrix.map((row) => [...row]);

  steps.push({
    distances: distances.map((row) => [...row]),
    current: null,
    k: -1,
    message: `Starting Floyd-Warshall algorithm`,
  });

  for (let k = 0; k < numNodes; k++) {
    steps.push({
      distances: distances.map((row) => [...row]),
      current: null,
      k,
      message: `Using node ${k} as intermediate node`,
    });

    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (
          distances[i][k] !== Number.POSITIVE_INFINITY &&
          distances[k][j] !== Number.POSITIVE_INFINITY &&
          distances[i][k] + distances[k][j] < distances[i][j]
        ) {
          const oldDistance = distances[i][j];
          distances[i][j] = distances[i][k] + distances[k][j];

          steps.push({
            distances: distances.map((row) => [...row]),
            current: null,
            i,
            j,
            k,
            message: `Updated distance from ${i} to ${j} via ${k}: ${oldDistance} → ${distances[i][j]}`,
          });
        }
      }
    }
  }

  steps.push({
    distances: distances.map((row) => [...row]),
    current: null,
    message: `Completed Floyd-Warshall algorithm. Shortest distance from ${startNode} to ${endNode} is ${distances[startNode][endNode]}`,
  });

  return steps;
}
