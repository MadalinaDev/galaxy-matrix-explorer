"use client";

export default function AdjacencyMatrix({
  matrix,
  currentState,
  startNode,
  endNode,
  isDirected = false,
}: {
  matrix: any;
  currentState: any;
  startNode: any;
  endNode: any;
  isDirected: boolean;
}) {
  if (!matrix || matrix.length === 0) {
    return <div className="text-center p-4">No matrix data available</div>;
  }

  const { visited = [], current = null, queue = [], stack = [] } = currentState;

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300 bg-gray-100"></th>
            {matrix.map((_: any, index: any) => (
              <th
                key={index}
                className={`p-2 border border-gray-300 text-center w-10 ${
                  index === startNode
                    ? "bg-green-100"
                    : index === endNode
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                {index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row: any, rowIndex: any) => (
            <tr key={rowIndex}>
              <th
                className={`p-2 border border-gray-300 text-center ${
                  rowIndex === startNode
                    ? "bg-green-100"
                    : rowIndex === endNode
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                {rowIndex}
              </th>
              {row.map((cell: any, colIndex: any) => {
                let bgColor = "bg-white";

                const isCurrentEdge =
                  (rowIndex === current && visited.includes(colIndex)) ||
                  (colIndex === current && visited.includes(rowIndex));

                const isVisitedEdge =
                  visited.includes(rowIndex) && visited.includes(colIndex);

                const isAsymmetric =
                  isDirected &&
                  matrix[rowIndex][colIndex] !== Number.POSITIVE_INFINITY &&
                  matrix[colIndex][rowIndex] === Number.POSITIVE_INFINITY;

                if (cell === Number.POSITIVE_INFINITY || cell === 0) {
                  bgColor = "bg-gray-50";
                } else if (isCurrentEdge) {
                  bgColor = "bg-yellow-100";
                } else if (isVisitedEdge) {
                  bgColor = "bg-blue-50";
                } else if (isAsymmetric) {
                  bgColor = "bg-purple-50";
                }

                return (
                  <td
                    key={colIndex}
                    className={`p-2 border border-gray-300 text-center ${bgColor}`}
                  >
                    {cell === Number.POSITIVE_INFINITY ? "∞" : cell}
                    {isDirected &&
                      cell !== Number.POSITIVE_INFINITY &&
                      cell !== 0 &&
                      matrix[colIndex][rowIndex] ===
                        Number.POSITIVE_INFINITY && (
                        <span className="text-xs ml-1">→</span>
                      )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
