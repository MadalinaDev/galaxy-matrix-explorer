
export type GraphType =
  | "undirected"
  | "directed"
  | "mixed"
  | "connected"
  | "disconnected"
  | "cyclic"
  | "acyclic"
  | "sparse"
  | "dense"
  | "tree"
  | "complete"
  | "bipartite";

export type Edge = {
  source: number;
  target: number;
  weight: number;
  directed?: boolean;
};

export type Node = {
  id: number;
  x: number;
  y: number;
  group?: number; 
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
  adjacencyMatrix: number[][];
  isDirected: boolean;
  properties: {
    type: GraphType;
    isConnected: boolean;
    isCyclic: boolean;
    isDense: boolean;
    isTree: boolean;
    isComplete: boolean;
    isBipartite: boolean;
  };
};

export function generateRandomGraph(numNodes: number): Graph {
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

  const edges: Edge[] = [];

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

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "undirected",
      isConnected: true,
      isCyclic: hasAnyCycle(edges, numNodes),
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: edges.length === numNodes - 1 && !hasAnyCycle(edges, numNodes),
      isComplete: edges.length === (numNodes * (numNodes - 1)) / 2,
      isBipartite: false, 
    },
  };
}

export function generateDirectedGraph(numNodes: number): Graph {
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

  const edges: Edge[] = [];

  for (let i = 1; i < numNodes; i++) {
    const source = i;
    const target = Math.floor(Math.random() * i); 
    const weight = Math.floor(Math.random() * 9) + 1; 

    if (Math.random() > 0.5) {
      edges.push({ source, target, weight, directed: true });
      adjacencyMatrix[source][target] = weight;
    } else {
      edges.push({ source: target, target: source, weight, directed: true });
      adjacencyMatrix[target][source] = weight;
    }
  }

  const maxEdges = Math.min(numNodes * 3, numNodes * (numNodes - 1)); 
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

      edges.push({ source, target, weight, directed: true });
      adjacencyMatrix[source][target] = weight;
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: true,
    properties: {
      type: "directed",
      isConnected: true, // Weakly connected
      isCyclic: hasDirectedCycle(adjacencyMatrix),
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: false, // Directed graphs aren't trees in the traditional sense
      isComplete: edges.length === numNodes * (numNodes - 1),
      isBipartite: false, // Default, would need proper checking
    },
  };
}

// Generate a mixed graph (some directed, some undirected edges)
export function generateMixedGraph(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges
  const edges: Edge[] = [];

  // Ensure the graph is connected
  for (let i = 1; i < numNodes; i++) {
    const source = i;
    const target = Math.floor(Math.random() * i); // Connect to a previous node
    const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10
    const isDirected = Math.random() > 0.5;

    if (isDirected) {
      edges.push({ source, target, weight, directed: true });
      adjacencyMatrix[source][target] = weight;
    } else {
      edges.push({ source, target, weight, directed: false });
      adjacencyMatrix[source][target] = weight;
      adjacencyMatrix[target][source] = weight;
    }
  }

  // Add some additional random edges
  const maxEdges = Math.min(numNodes * 3, numNodes * (numNodes - 1)); // Limit max edges
  const additionalEdges =
    Math.floor(Math.random() * (maxEdges - numNodes + 1)) + numNodes - 1;

  for (let i = 0; i < additionalEdges - (numNodes - 1); i++) {
    const source = Math.floor(Math.random() * numNodes);
    const target = Math.floor(Math.random() * numNodes);

    // Avoid self-loops and duplicate edges
    if (
      source !== target &&
      adjacencyMatrix[source][target] === Number.POSITIVE_INFINITY
    ) {
      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10
      const isDirected = Math.random() > 0.5;

      if (isDirected) {
        edges.push({ source, target, weight, directed: true });
        adjacencyMatrix[source][target] = weight;
      } else {
        edges.push({ source, target, weight, directed: false });
        adjacencyMatrix[source][target] = weight;
        adjacencyMatrix[target][source] = weight;
      }
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: true, // Mixed has some directed edges
    properties: {
      type: "mixed",
      isConnected: true,
      isCyclic:
        hasAnyCycle(edges, numNodes) || hasDirectedCycle(adjacencyMatrix),
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: false, // Mixed graphs aren't trees
      isComplete: false, // Mixed graphs aren't complete in the traditional sense
      isBipartite: false, // Default, would need proper checking
    },
  };
}

// Generate a tree
export function generateTree(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges - exactly n-1 edges for a tree
  const edges: Edge[] = [];

  // Connect each node (except the first) to a random previous node
  for (let i = 1; i < numNodes; i++) {
    const source = i;
    const target = Math.floor(Math.random() * i); // Connect to a previous node
    const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

    edges.push({ source, target, weight });
    adjacencyMatrix[source][target] = weight;
    adjacencyMatrix[target][source] = weight; // Undirected graph
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "tree",
      isConnected: true,
      isCyclic: false,
      isDense: false,
      isTree: true,
      isComplete: numNodes <= 2, // Only K1 and K2 are both trees and complete
      isBipartite: true, // Trees are always bipartite
    },
  };
}

// Generate a complete graph
export function generateCompleteGraph(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges - connect every node to every other node
  const edges: Edge[] = [];

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

      edges.push({ source: i, target: j, weight });
      adjacencyMatrix[i][j] = weight;
      adjacencyMatrix[j][i] = weight; // Undirected graph
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "complete",
      isConnected: true,
      isCyclic: numNodes > 2,
      isDense: true,
      isTree: numNodes <= 2, // Only K1 and K2 are both trees and complete
      isComplete: true,
      isBipartite: numNodes <= 2, // Only K1 and K2 are bipartite complete graphs
    },
  };
}

// Generate a bipartite graph
export function generateBipartiteGraph(numNodes: number): Graph {
  // Split nodes into two groups
  const group1Size = Math.floor(numNodes / 2);
  const group2Size = numNodes - group1Size;

  // Create nodes with random positions and group assignments
  const nodes: Node[] = [];

  // Group 1 - position on left side
  for (let i = 0; i < group1Size; i++) {
    nodes.push({
      id: i,
      x: 0.1 + 0.3 * Math.random(),
      y: 0.1 + 0.8 * Math.random(),
      group: 0,
    });
  }

  // Group 2 - position on right side
  for (let i = 0; i < group2Size; i++) {
    nodes.push({
      id: i + group1Size,
      x: 0.6 + 0.3 * Math.random(),
      y: 0.1 + 0.8 * Math.random(),
      group: 1,
    });
  }

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges - only between different groups
  const edges: Edge[] = [];

  // Ensure the graph is connected
  for (let i = 0; i < group1Size; i++) {
    // Connect to at least one node in group 2
    const target = group1Size + Math.floor(Math.random() * group2Size);
    const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

    edges.push({ source: i, target, weight });
    adjacencyMatrix[i][target] = weight;
    adjacencyMatrix[target][i] = weight; // Undirected graph
  }

  // Add some additional random edges between groups
  const edgeDensity = 0.3; // Control how many potential edges are actually created

  for (let i = 0; i < group1Size; i++) {
    for (let j = 0; j < group2Size; j++) {
      const target = j + group1Size;

      // Skip if already connected or random check fails
      if (
        adjacencyMatrix[i][target] !== Number.POSITIVE_INFINITY ||
        Math.random() > edgeDensity
      ) {
        continue;
      }

      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10
      edges.push({ source: i, target, weight });
      adjacencyMatrix[i][target] = weight;
      adjacencyMatrix[target][i] = weight; // Undirected graph
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "bipartite",
      isConnected: true,
      isCyclic: edges.length > numNodes - 1,
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: edges.length === numNodes - 1,
      isComplete: edges.length === group1Size * group2Size, // Complete bipartite = all possible edges between groups
      isBipartite: true,
    },
  };
}

// Generate a disconnected graph
export function generateDisconnectedGraph(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges
  const edges: Edge[] = [];

  // Create 2-3 disconnected components
  const numComponents = Math.min(3, Math.floor(numNodes / 3));
  const componentsSize = Math.floor(numNodes / numComponents);

  for (let c = 0; c < numComponents; c++) {
    const start = c * componentsSize;
    const end = c === numComponents - 1 ? numNodes : (c + 1) * componentsSize;

    // Connect nodes within this component
    for (let i = start + 1; i < end; i++) {
      const source = i;
      const target = start + Math.floor(Math.random() * (i - start)); // Connect to a previous node in component
      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

      edges.push({ source, target, weight });
      adjacencyMatrix[source][target] = weight;
      adjacencyMatrix[target][source] = weight; // Undirected graph
    }

    // Add some additional random edges within the component
    const maxComponentEdges = Math.min(
      (end - start) * 2,
      ((end - start) * (end - start - 1)) / 2
    );
    const additionalEdges = Math.floor(Math.random() * maxComponentEdges);

    for (let i = 0; i < additionalEdges; i++) {
      const source = start + Math.floor(Math.random() * (end - start));
      const target = start + Math.floor(Math.random() * (end - start));

      // Avoid self-loops and duplicate edges
      if (
        source !== target &&
        adjacencyMatrix[source][target] === Number.POSITIVE_INFINITY
      ) {
        const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

        edges.push({ source, target, weight });
        adjacencyMatrix[source][target] = weight;
        adjacencyMatrix[target][source] = weight; // Undirected graph
      }
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "disconnected",
      isConnected: false,
      isCyclic: hasAnyCycle(edges, numNodes),
      isDense: false, // Disconnected graphs are typically sparse
      isTree: false, // Disconnected graphs aren't trees
      isComplete: false, // Disconnected graphs aren't complete
      isBipartite: false, // Would need proper checking
    },
  };
}

// Generate a cyclic graph
export function generateCyclicGraph(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges
  const edges: Edge[] = [];

  // Create a cycle through all nodes
  for (let i = 0; i < numNodes; i++) {
    const source = i;
    const target = (i + 1) % numNodes;
    const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

    edges.push({ source, target, weight });
    adjacencyMatrix[source][target] = weight;
    adjacencyMatrix[target][source] = weight; // Undirected graph
  }

  // Add some additional random edges
  const maxEdges = Math.min(numNodes * 2, (numNodes * (numNodes - 1)) / 2);
  const additionalEdges = Math.floor(Math.random() * (maxEdges - numNodes));

  for (let i = 0; i < additionalEdges; i++) {
    const source = Math.floor(Math.random() * numNodes);
    const target = Math.floor(Math.random() * numNodes);

    // Avoid self-loops and duplicate edges
    if (
      source !== target &&
      adjacencyMatrix[source][target] === Number.POSITIVE_INFINITY
    ) {
      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

      edges.push({ source, target, weight });
      adjacencyMatrix[source][target] = weight;
      adjacencyMatrix[target][source] = weight; // Undirected graph
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: false,
    properties: {
      type: "cyclic",
      isConnected: true,
      isCyclic: true,
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: false, // Cyclic graphs aren't trees
      isComplete: edges.length === (numNodes * (numNodes - 1)) / 2,
      isBipartite: numNodes % 2 === 0, // Even cycles are bipartite
    },
  };
}

// Generate an acyclic graph (DAG)
export function generateAcyclicGraph(numNodes: number): Graph {
  // Create nodes with random positions
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
  }));

  // Create adjacency matrix initialized with Infinity
  const adjacencyMatrix = Array.from({ length: numNodes }, () =>
    Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
  );

  // Set diagonal to 0 (distance to self)
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix[i][i] = 0;
  }

  // Generate edges - only from lower to higher indices to ensure acyclicity
  const edges: Edge[] = [];

  // Ensure the graph is connected
  for (let i = 0; i < numNodes - 1; i++) {
    const source = i;
    const target = i + 1;
    const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

    edges.push({ source, target, weight, directed: true });
    adjacencyMatrix[source][target] = weight;
  }

  // Add some additional random edges (maintaining acyclicity)
  const maxEdges = Math.min(numNodes * 2, (numNodes * (numNodes - 1)) / 2);
  const additionalEdges = Math.floor(
    Math.random() * (maxEdges - (numNodes - 1))
  );

  for (let i = 0; i < additionalEdges; i++) {
    const source = Math.floor(Math.random() * (numNodes - 1));
    const target =
      source + 1 + Math.floor(Math.random() * (numNodes - source - 1));

    // Avoid duplicate edges
    if (adjacencyMatrix[source][target] === Number.POSITIVE_INFINITY) {
      const weight = Math.floor(Math.random() * 9) + 1; // Weight between 1-10

      edges.push({ source, target, weight, directed: true });
      adjacencyMatrix[source][target] = weight;
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix,
    isDirected: true,
    properties: {
      type: "acyclic",
      isConnected: true,
      isCyclic: false,
      isDense: edges.length > numNodes * Math.log2(numNodes),
      isTree: edges.length === numNodes - 1,
      isComplete: false, // Acyclic directed graphs can't be complete
      isBipartite: false, // Would need proper checking
    },
  };
}

// Helper function to check if a graph has any cycle
function hasAnyCycle(edges: Edge[], numNodes: number): boolean {
  // Use disjoint set to detect cycles in undirected graph
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
    if (!edge.directed) {
      // Only check undirected edges
      const sourceRoot = find(edge.source);
      const targetRoot = find(edge.target);

      if (sourceRoot === targetRoot) {
        return true; // Cycle detected
      }

      union(edge.source, edge.target);
    }
  }

  return false;
}

// Helper function to check if a directed graph has a cycle
function hasDirectedCycle(adjacencyMatrix: number[][]): boolean {
  const numNodes = adjacencyMatrix.length;
  const visited = new Set<number>();
  const recursionStack = new Set<number>();

  function dfs(node: number): boolean {
    visited.add(node);
    recursionStack.add(node);

    for (let neighbor = 0; neighbor < numNodes; neighbor++) {
      if (
        adjacencyMatrix[node][neighbor] !== Number.POSITIVE_INFINITY &&
        adjacencyMatrix[node][neighbor] !== 0
      ) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          return true; // Cycle detected
        }
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i)) {
      if (dfs(i)) {
        return true;
      }
    }
  }

  return false;
}

// Factory function to generate a graph of the specified type
export function generateGraph(type: GraphType, numNodes: number): Graph {
  switch (type) {
    case "undirected":
      return generateRandomGraph(numNodes);
    case "directed":
      return generateDirectedGraph(numNodes);
    case "mixed":
      return generateMixedGraph(numNodes);
    case "connected":
      return generateRandomGraph(numNodes); // Already connected
    case "disconnected":
      return generateDisconnectedGraph(numNodes);
    case "cyclic":
      return generateCyclicGraph(numNodes);
    case "acyclic":
      return generateAcyclicGraph(numNodes);
    case "sparse":
      const sparseGraph = generateRandomGraph(numNodes);
      // Keep only n*log(n) edges
      const maxSparseEdges = Math.ceil(numNodes * Math.log2(numNodes));
      if (sparseGraph.edges.length > maxSparseEdges) {
        sparseGraph.edges = sparseGraph.edges.slice(0, maxSparseEdges);
        // Rebuild adjacency matrix
        sparseGraph.adjacencyMatrix = Array.from({ length: numNodes }, () =>
          Array.from({ length: numNodes }, () => Number.POSITIVE_INFINITY)
        );
        for (let i = 0; i < numNodes; i++) {
          sparseGraph.adjacencyMatrix[i][i] = 0;
        }
        for (const edge of sparseGraph.edges) {
          sparseGraph.adjacencyMatrix[edge.source][edge.target] = edge.weight;
          if (!edge.directed) {
            sparseGraph.adjacencyMatrix[edge.target][edge.source] = edge.weight;
          }
        }
        sparseGraph.properties.isDense = false;
      }
      return sparseGraph;
    case "dense":
      return generateCompleteGraph(numNodes);
    case "tree":
      return generateTree(numNodes);
    case "complete":
      return generateCompleteGraph(numNodes);
    case "bipartite":
      return generateBipartiteGraph(numNodes);
    default:
      return generateRandomGraph(numNodes);
  }
}
