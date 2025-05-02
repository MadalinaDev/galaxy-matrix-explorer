export default function dfs(
  adjacencyMatrix: number[][],
  startNode: number,
  endNode: number
) {
  const numNodes = adjacencyMatrix.length;
  const visited: number[] = [];
  const stack: number[] = [startNode];
  const steps: any[] = [];

  steps.push({
    visited: [...visited],
    stack: [...stack],
    current: null,
    message: `Starting DFS from node ${startNode}`,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.includes(current)) {
      visited.push(current);

      steps.push({
        visited: [...visited],
        stack: [...stack],
        current,
        message: `Visiting node ${current}`,
      });

      if (current === endNode) {
        steps.push({
          visited: [...visited],
          stack: [...stack],
          current,
          message: `Reached target node ${endNode}`,
        });
        break;
      }

      for (let neighbor = numNodes - 1; neighbor >= 0; neighbor--) {
        if (
          adjacencyMatrix[current][neighbor] !== Number.POSITIVE_INFINITY &&
          adjacencyMatrix[current][neighbor] !== 0 &&
          !visited.includes(neighbor)
        ) {
          stack.push(neighbor);

          steps.push({
            visited: [...visited],
            stack: [...stack],
            current,
            message: `Adding node ${neighbor} to stack`,
          });
        }
      }
    }
  }

  if (!visited.includes(endNode)) {
    steps.push({
      visited: [...visited],
      stack: [...stack],
      current: null,
      message: `Could not reach target node ${endNode}`,
    });
  }

  return steps;
}
