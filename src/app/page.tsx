import AlgorithmVisualizer from "@/components/layout/algorithm-visualizer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6">Galaxy Algorithm Visualizer</h1>
      <div className="w-full max-w-7xl mb-8">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">
            Graph Types & Algorithms
          </h2>
          <p className="text-sm text-gray-700">
            This visualizer supports multiple graph types:
            directed/undirected/mixed, connected/disconnected, cyclic/acyclic,
            sparse/dense, trees, complete, and bipartite graphs. Select
            different graph types and algorithms to see how they interact.
          </p>
        </div>
      </div>
      <AlgorithmVisualizer />
    </main>
  );
}
