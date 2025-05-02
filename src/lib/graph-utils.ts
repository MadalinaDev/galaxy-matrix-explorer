export function generateRandomGraph(numNodes: number) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8, 
    y: 0.1 + Math.random() * 0.8,
  }));

  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  const edges = [];

  for (let i = 1; i < numNodes; i++) {
    const source = i;
    const target = Math.floor(Math.random() * i); 
    const weight = Math.floor(Math.random() * 9) + 1; 

    edges.push({ source, target, weight });
    adjacencyMatrix[source][target] = weight;
    adjacencyMatrix[target][source] = weight; 
  }

  const maxEdges = Math.min(numNodes * 3, (numNodes * (numNodes - 1)) / 2); 
  const additionalEdges =
    Math.floor(Math.random() * (maxEdges - numNodes + 1)) + numNodes - 1;

  for (let i = 0; i < additionalEdges - (numNodes - 1); i++) {
    const source = Math.floor(Math.random() * numNodes);
    const target = Math.floor(Math.random() * numNodes);

    if (
      source !== target &&
      adjacencyMatrix[source][target] === Number.POSITIVE_INFINITY
    ) {
      const weight = Math.floor(Math.random() * 9) + 1;

      edges.push({ source, target, weight });
      adjacencyMatrix[source][target] = weight;
      adjacencyMatrix[target][source] = weight; 
    }
  }

  return { nodes, edges, adjacencyMatrix };
}
