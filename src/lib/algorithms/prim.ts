export default function prim(adjacencyMatrix: number[][], startNode: number) {
  const numNodes = adjacencyMatrix.length;
  const visited: number[] = [startNode];
  const mst: { source: number; target: number; weight: number }[] = [];
  const steps: any[] = [];

  steps.push({
    visited: [...visited],
    mst: [...mst],
    current: startNode,
    message: `Starting Prim's algorithm from node ${startNode}`,
  });

  while (visited.length < numNodes) {
    let minWeight = Number.POSITIVE_INFINITY;
    let minSource = -1;
    let minTarget = -1;

    for (const source of visited) {
      for (let target = 0; target < numNodes; target++) {
        if (
          !visited.includes(target) &&
          adjacencyMatrix[source][target] !== Number.POSITIVE_INFINITY &&
          adjacencyMatrix[source][target] !== 0 &&
          adjacencyMatrix[source][target] < minWeight
        ) {
          minWeight = adjacencyMatrix[source][target];
          minSource = source;
          minTarget = target;
        }
      }
    }

    if (minSource !== -1 && minTarget !== -1) {
      visited.push(minTarget);
      mst.push({ source: minSource, target: minTarget, weight: minWeight });

      steps.push({
        visited: [...visited],
        mst: [...mst],
        current: minTarget,
        message: `Added edge ${minSource} → ${minTarget} with weight ${minWeight} to MST`,
      });
    } else {
      steps.push({
        visited: [...visited],
        mst: [...mst],
        current: null,
        message: `Could not find an edge to add. Graph is disconnected.`,
      });
      break;
    }
  }

  steps.push({
    visited: [...visited],
    mst: [...mst],
    current: null,
    message: `Completed Prim's algorithm. MST has ${mst.length} edges.`,
  });

  return steps;
}
