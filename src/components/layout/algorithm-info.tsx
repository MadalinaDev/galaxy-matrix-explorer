"use client";

import React from "react";
import type { AlgorithmKey } from "./algorithm-visualizer";

interface AlgorithmInfoProps {
  algorithmId: AlgorithmKey;
  detailed?: boolean;
}

interface InfoShape {
  name: string;
  description: string;
  details: string;
  pseudocode: string;
}

const algorithmInfo: Record<AlgorithmKey, InfoShape> = {
  dfs: {
    name: "Depth-First Search (DFS)",
    description:
      "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    details: `
      ## Depth-First Search (DFS)
      
      DFS is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root in the case of a graph) and explores as far as possible along each branch before backtracking.
      
      ### Key Characteristics:
      
      - Uses a stack data structure (or recursion) to keep track of nodes to visit
      - Explores deep into the graph before exploring siblings
      - Can be used to find connected components, topological sorting, and solving puzzles
      
      ### Time Complexity:
      - O(V + E) where V is the number of vertices and E is the number of edges
      
      ### Space Complexity:
      - O(V) for the stack/recursion call stack
    `,
    pseudocode: `
      DFS(graph, start):
        Stack = [start]
        Visited = set()
        
        while Stack is not empty:
          current = Stack.pop()
          
          if current not in Visited:
            Visited.add(current)
            
            for each neighbor of current:
              if neighbor not in Visited:
                Stack.push(neighbor)
        
        return Visited
    `,
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    description:
      "A graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level.",
    details: `
      ## Breadth-First Search (BFS)
      
      BFS is a graph traversal algorithm that explores all the neighbor nodes at the present depth prior to moving on to nodes at the next depth level. It uses a queue data structure to keep track of nodes to visit.
      
      ### Key Characteristics:
      
      - Uses a queue data structure to keep track of nodes to visit
      - Explores all neighbors before moving to the next level
      - Finds the shortest path in an unweighted graph
      - Can be used for connected components, finding levels, and shortest paths
      
      ### Time Complexity:
      - O(V + E) where V is the number of vertices and E is the number of edges
      
      ### Space Complexity:
      - O(V) for the queue
    `,
    pseudocode: `
      BFS(graph, start):
        Queue = [start]
        Visited = set(start)
        
        while Queue is not empty:
          current = Queue.dequeue()
          
          for each neighbor of current:
            if neighbor not in Visited:
              Visited.add(neighbor)
              Queue.enqueue(neighbor)
        
        return Visited
    `,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description:
      "An algorithm for finding the shortest paths between nodes in a weighted graph.",
    details: `
      ## Dijkstra's Algorithm
      
      Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem for a graph with non-negative edge weights, producing a shortest-path tree.
      
      ### Key Characteristics:
      
      - Uses a priority queue to select the next node to process
      - Maintains a distance array to track the shortest known distance to each node
      - Guarantees the shortest path in a graph with non-negative weights
      - Cannot handle negative weights (use Bellman-Ford for that)
      
      ### Time Complexity:
      - O((V + E) log V) with a binary heap implementation
      - O(V²) with an array implementation
      
      ### Space Complexity:
      - O(V) for the distance and visited arrays
    `,
    pseudocode: `
      Dijkstra(graph, start):
        distances = array filled with infinity
        distances[start] = 0
        priority_queue = [(0, start)]
        
        while priority_queue is not empty:
          current_distance, current = priority_queue.pop_min()
          
          if current_distance > distances[current]:
            continue
            
          for each neighbor, weight of current:
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
              distances[neighbor] = distance
              priority_queue.push((distance, neighbor))
        
        return distances
    `,
  },
  floydWarshall: {
    name: "Floyd-Warshall Algorithm",
    description:
      "A dynamic programming algorithm for finding shortest paths in a weighted graph with positive or negative edge weights.",
    details: `
      ## Floyd-Warshall Algorithm
      
      The Floyd-Warshall algorithm is a dynamic programming algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but no negative cycles).
      
      ### Key Characteristics:
      
      - Uses dynamic programming to compute shortest paths
      - Computes the shortest paths between all pairs of vertices
      - Can handle negative edge weights (but not negative cycles)
      - Simple implementation compared to running Dijkstra for each vertex
      
      ### Time Complexity:
      - O(V³) where V is the number of vertices
      
      ### Space Complexity:
      - O(V²) for the distance matrix
    `,
    pseudocode: `
      FloydWarshall(graph):
        distances = copy of the adjacency matrix
        
        for k from 0 to V-1:
          for i from 0 to V-1:
            for j from 0 to V-1:
              if distances[i][j] > distances[i][k] + distances[k][j]:
                distances[i][j] = distances[i][k] + distances[k][j]
        
        return distances
    `,
  },
  prim: {
    name: "Prim's Algorithm",
    description:
      "A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.",
    details: `
      ## Prim's Algorithm
      
      Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. It finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.
      
      ### Key Characteristics:
      
      - Starts from an arbitrary vertex and grows the tree one edge at a time
      - Uses a priority queue to select the next edge to add
      - Always adds the lowest-weight edge that connects a vertex in the tree to a vertex outside the tree
      - Works well for dense graphs
      
      ### Time Complexity:
      - O(E log V) with a binary heap implementation
      
      ### Space Complexity:
      - O(V + E) for the priority queue and MST
    `,
    pseudocode: `
      Prim(graph, start):
        MST = []
        visited = set(start)
        edges = all edges connected to start
        
        while visited.size < V:
          min_edge = find minimum weight edge (u,v) where u is in visited and v is not
          MST.add(min_edge)
          visited.add(v)
          add all edges connected to v to the edge list
        
        return MST
    `,
  },
  kruskal: {
    name: "Kruskal's Algorithm",
    description:
      "A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.",
    details: `
      ## Kruskal's Algorithm
      
      Kruskal's algorithm is a greedy algorithm that finds a minimum spanning tree for a connected weighted graph. It finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.
      
      ### Key Characteristics:
      
      - Sorts all edges by weight and adds them one by one
      - Uses a disjoint-set data structure to detect cycles
      - Adds the next lowest-weight edge that doesn't create a cycle
      - Works well for sparse graphs
      
      ### Time Complexity:
      - O(E log E) or O(E log V) for sorting the edges
      
      ### Space Complexity:
      - O(V + E) for the disjoint-set and MST
    `,
    pseudocode: `
      Kruskal(graph):
        MST = []
        sort edges by weight
        disjoint_set = DisjointSet(V)
        
        for each edge (u, v, weight) in sorted edges:
          if disjoint_set.find(u) != disjoint_set.find(v):
            MST.add(edge)
            disjoint_set.union(u, v)
        
        return MST
    `,
  },
};

export default function AlgorithmInfo({
  algorithmId,
  detailed = false,
}: AlgorithmInfoProps) {
  const info = algorithmInfo[algorithmId];

  if (detailed) {
    return (
      <div className="prose prose-sm max-w-none">
        <h3>{info.name}</h3>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: info.details }}
        />
        <h4 className="mt-4">Pseudocode:</h4>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <code>{info.pseudocode}</code>
        </pre>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold">{info.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{info.description}</p>
    </div>
  );
}
