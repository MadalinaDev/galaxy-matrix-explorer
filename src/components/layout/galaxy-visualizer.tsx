"use client";

import { useRef, useEffect } from "react";

export default function GalaxyVisualization({
  graph,
  currentState,
  startNode,
  endNode,
}: {
  graph: any;
  currentState: any;
  startNode: number;
  endNode: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graph.nodes || graph.nodes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    drawStars(ctx, width, height);

    drawEdges(ctx, graph, currentState, width, height);

    drawNodes(ctx, graph, currentState, startNode, endNode, width, height);
  }, [graph, currentState, startNode, endNode]);

  function drawStars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawEdges(
    ctx: CanvasRenderingContext2D,
    graph: { edges: any[]; nodes: { x: number; y: number }[] },
    currentState: {
      visited?: number[];
      mst?: { source: number; target: number }[];
    },
    width: number,
    height: number
  ) {
    const { edges, nodes } = graph;
    const { visited = [], mst = [] } = currentState;

    edges.forEach((edge) => {
      const source = nodes[edge.source];
      const target = nodes[edge.target];

      const sourceX = source.x * width;
      const sourceY = source.y * height;
      const targetX = target.x * width;
      const targetY = target.y * height;

      const isMSTEdge = mst.some(
        (e) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
      );

      const isVisitedEdge =
        visited.includes(edge.source) && visited.includes(edge.target);

      if (isMSTEdge) {
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 3;
      } else if (isVisitedEdge) {
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      if (edge.weight !== undefined) {
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.beginPath();
        ctx.arc(midX, midY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });
  }

  function drawNodes(
    ctx: CanvasRenderingContext2D,
    graph: { nodes: { x: number; y: number }[] },
    currentState: {
      visited?: number[];
      current?: number | null;
      queue?: number[];
      stack?: number[];
    },
    startNode: number,
    endNode: number,
    width: number,
    height: number
  ) {
    const { nodes } = graph;
    const {
      visited = [],
      current = null,
      queue = [],
      stack = [],
    } = currentState;

    nodes.forEach((node, index) => {
      const x = node.x * width;
      const y = node.y * height;
      const radius = 15;

      let fillColor = "#6b7280"; 

      if (index === startNode) {
        fillColor = "#10b981"; 
      } else if (index === endNode) {
        fillColor = "#ef4444"; 
      } else if (index === current) {
        fillColor = "#f59e0b";
      } else if (visited.includes(index)) {
        fillColor = "#3b82f6"; 
      } else if (queue.includes(index)) {
        fillColor = "#8b5cf6"; 
      } else if (stack.includes(index)) {
        fillColor = "#ec4899"; 
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(index.toString(), x, y);
    });
  }

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
