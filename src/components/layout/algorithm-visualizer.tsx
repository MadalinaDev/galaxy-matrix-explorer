"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, SkipForward, RotateCcw, Info } from "lucide-react";
import GalaxyVisualization from "@/components/layout/galaxy-visualizer";
import AdjacencyMatrix from "@/components/layout/adjacency-matrix";
import AlgorithmInfo from "@/components/layout/algorithm-info";
import { generateRandomGraph } from "@/lib/graph-utils";

import dfs from "@/lib/algorithms/dfs";
import bfsAlgorithm from "@/lib/algorithms/bfs";
import dijkstraAlgorithm from "@/lib/algorithms/dijkstra";
import floydWarshallAlgorithm from "@/lib/algorithms/floydWarshall";
import primAlgorithm from "@/lib/algorithms/prim";
import kruskalAlgorithm from "@/lib/algorithms/kruskal";

interface NodeType {
  id: number;
  x: number;
  y: number;
}
interface EdgeType {
  source: number;
  target: number;
  weight: number;
}
interface GraphType {
  nodes: NodeType[];
  edges: EdgeType[];
  adjacencyMatrix: number[][];
}
interface AlgorithmStep {
  visited?: number[];
  queue?: number[];
  stack?: number[];
  distances?: number[];
  parent?: number[];
  mst?: EdgeType[];
  current?: number | null;
  message: string;
}

export type AlgorithmKey =
  | "dfs"
  | "bfs"
  | "dijkstra"
  | "floydWarshall"
  | "prim"
  | "kruskal";

const algorithms = [
  { id: "dfs", name: "Depth-First Search (DFS)" },
  { id: "bfs", name: "Breadth-First Search (BFS)" },
  { id: "dijkstra", name: "Dijkstra's Algorithm" },
  { id: "floydWarshall", name: "Floyd-Warshall Algorithm" },
  { id: "prim", name: "Prim's Algorithm" },
  { id: "kruskal", name: "Kruskal's Algorithm" },
];

const algorithmFunctions: Record<
  AlgorithmKey,
  (matrix: number[][], start: number, end: number) => AlgorithmStep[]
> = {
  dfs,
  bfs: bfsAlgorithm,
  dijkstra: dijkstraAlgorithm,
  floydWarshall: floydWarshallAlgorithm,
  prim: primAlgorithm,
  kruskal: kruskalAlgorithm,
};

export default function AlgorithmVisualizer() {
  const [nodes, setNodes] = useState<number>(10);
  const [graph, setGraph] = useState<GraphType>({
    nodes: [],
    edges: [],
    adjacencyMatrix: [],
  });
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmKey>("dfs");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number[]>([50]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [startNode, setStartNode] = useState<number>(0);
  const [endNode, setEndNode] = useState<number>(nodes - 1);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const newGraph = generateRandomGraph(nodes);
    setGraph(newGraph);
    setStartNode(0);
    setEndNode((prev) => Math.min(nodes - 1, prev));
    resetAlgorithm();
  }, [nodes]);

  useEffect(() => {
    resetAlgorithm();
  }, [selectedAlgorithm, startNode, endNode, graph]);

  useEffect(() => {
    if (
      isPlaying &&
      algorithmSteps.length > 0 &&
      currentStep < algorithmSteps.length - 1
    ) {
      const timeoutDuration = 1000 - speed[0] * 9;
      animationRef.current = window.setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, timeoutDuration);
    } else if (currentStep >= algorithmSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, algorithmSteps, speed]);

  const resetAlgorithm = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const fn = algorithmFunctions[selectedAlgorithm];
      const steps = fn(graph.adjacencyMatrix, startNode, endNode);
      setAlgorithmSteps(steps);
    } catch (err) {
      console.error("Failed to execute algorithm:", err);
      setAlgorithmSteps([]);
    }
  };

  const currentState: AlgorithmStep = algorithmSteps[currentStep] || {
    message: "Algorithm not started",
  };

  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as AlgorithmKey);
  };
  const handleSliderChange = (vals: number[]) => {
    setSpeed(vals);
  };

  return (
    <div className="w-full max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Galaxy Visualization</CardTitle>
            <CardDescription>
              Visual representation of the graph as a galaxy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] relative bg-black rounded-md overflow-hidden">
              <GalaxyVisualization
                graph={graph}
                currentState={currentState}
                startNode={startNode}
                endNode={endNode}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adjacency Matrix</CardTitle>
            <CardDescription>
              Matrix representation of the graph
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] overflow-auto">
              <AdjacencyMatrix
                matrix={graph.adjacencyMatrix}
                currentState={currentState}
                startNode={startNode}
                endNode={endNode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Algorithm Controls</CardTitle>
            <CardDescription>
              Control the algorithm visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Algorithm
                  </label>
                  <Select
                    value={selectedAlgorithm}
                    onValueChange={handleAlgorithmChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((algo) => (
                        <SelectItem key={algo.id} value={algo.id}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Nodes
                  </label>
                  <Select
                    value={nodes.toString()}
                    onValueChange={(value) => setNodes(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Number of nodes" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} nodes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Start Node
                  </label>
                  <Select
                    value={startNode.toString()}
                    onValueChange={(value) => setStartNode(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Start node" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: nodes }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          Node {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    End Node
                  </label>
                  <Select
                    value={endNode.toString()}
                    onValueChange={(value) => setEndNode(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="End node" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: nodes }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          Node {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Animation Speed
                </label>
                <Slider
                  value={speed}
                  onValueChange={handleSliderChange}
                  min={1}
                  max={100}
                  step={1}
                  className="my-4"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      currentStep < algorithmSteps.length - 1 &&
                      setCurrentStep((prev) => prev + 1)
                    }
                    disabled={currentStep >= algorithmSteps.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetAlgorithm}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="font-medium">
                  Current Step: {currentStep + 1} / {algorithmSteps.length}
                </p>
                <p className="text-sm mt-2">{currentState.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Information</CardTitle>
            <CardDescription>
              Learn about the selected algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlgorithmInfo algorithmId={selectedAlgorithm} detailed={false} />
          </CardContent>
        </Card>
      </div>
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>
                {algorithms.find((a) => a.id === selectedAlgorithm)?.name}
              </CardTitle>
              <CardDescription>
                Detailed information about the algorithm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlgorithmInfo algorithmId={selectedAlgorithm} detailed={true} />
            </CardContent>
            <div className="p-4 flex justify-end">
              <Button onClick={() => setShowInfo(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
