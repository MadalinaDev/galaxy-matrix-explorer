export default function kruskal(adjacencyMatrix: number[][]) {
  const numNodes = adjacencyMatrix.length;
  const edges: { source: number; target: number; weight: number }[] = [];
  const mst: { source: number; target: number; weight: number }[] = [];
  const steps: any[] = [];

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      if (
        adjacencyMatrix[i][j] !== Number.POSITIVE_INFINITY &&
        adjacencyMatrix[i][j] !== 0
      ) {
        edges.push({ source: i, target: j, weight: adjacencyMatrix[i][j] });
      }
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  steps.push({
    edges: [...edges],
    mst: [...mst],
    current: null,
    message: `Starting Kruskal's algorithm with ${edges.length} edges`,
  });

  const parent = Array.from({ length: numNodes }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  for (const edge of edges) {
    const { source, target, weight } = edge;

    steps.push({
      edges: [...edges],
      mst: [...mst],
      current: edge,
      message: `Considering edge ${source} → ${target} with weight ${weight}`,
    });

    if (find(source) !== find(target)) {
      mst.push(edge);
      union(source, target);

      steps.push({
        edges: [...edges],
        mst: [...mst],
        current: edge,
        message: `Added edge ${source} → ${target} with weight ${weight} to MST`,
      });

      if (mst.length === numNodes - 1) {
        steps.push({
          edges: [...edges],
          mst: [...mst],
          current: null,
          message: `Completed Kruskal's algorithm. MST has ${mst.length} edges.`,
        });
        break;
      }
    } else {
      steps.push({
        edges: [...edges],
        mst: [...mst],
        current: edge,
        message: `Skipped edge ${source} → ${target} to avoid cycle`,
      });
    }
  }

  if (mst.length < numNodes - 1) {
    steps.push({
      edges: [...edges],
      mst: [...mst],
      current: null,
      message: `Could not find a complete MST. Graph is disconnected.`,
    });
  }

  return steps;
}
