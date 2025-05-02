export default function bfs(
  adjacencyMatrix: number[][],
  startNode: number,
  endNode: number
) {
  const numNodes = adjacencyMatrix.length;
  const visited: number[] = [startNode];
  const queue: number[] = [startNode];
  const steps: any[] = [];

  steps.push({
    visited: [...visited],
    queue: [...queue],
    current: null,
    message: `Starting BFS from node ${startNode}`,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      visited: [...visited],
      queue: [...queue],
      current,
      message: `Processing node ${current}`,
    });

    if (current === endNode) {
      steps.push({
        visited: [...visited],
        queue: [...queue],
        current,
        message: `Reached target node ${endNode}`,
      });
      break;
    }

    for (let neighbor = 0; neighbor < numNodes; neighbor++) {
      if (
        adjacencyMatrix[current][neighbor] !== Number.POSITIVE_INFINITY &&
        adjacencyMatrix[current][neighbor] !== 0 &&
        !visited.includes(neighbor)
      ) {
        visited.push(neighbor);
        queue.push(neighbor);

        steps.push({
          visited: [...visited],
          queue: [...queue],
          current,
          message: `Adding node ${neighbor} to queue`,
        });
      }
    }
  }

  if (!visited.includes(endNode)) {
    steps.push({
      visited: [...visited],
      queue: [...queue],
      current: null,
      message: `Could not reach target node ${endNode}`,
    });
  }

  return steps;
}
