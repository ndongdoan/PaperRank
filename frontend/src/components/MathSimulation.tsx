"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Sigma } from "lucide-react";
import { MatrixSimulation } from "@/lib/api";

interface MathProps {
  data: MatrixSimulation;
}

export default function MathSimulation({ data }: MathProps) {
  const {
    adjacency_matrix,
    stochastic_matrix,
    final_vector,
    iterations,
    damping_factor,
  } = data;
  const n = final_vector.length;

  // Expand full matrix
  const [isExpanded, setIsExpanded] = useState(false);
  const displayLimit = isExpanded ? n : Math.min(n, 5);

  // Render matrix with labels
  const renderMatrix = (dataMatrix: any[], isVector = false) => (
    <div className="relative inline-flex flex-col mx-2 font-mono text-[11px] max-w-full overflow-x-auto pb-4">
      {/* Column headers */}
      {!isVector && (
        <div className="flex w-max">
          <div className="w-8 shrink-0 mr-2"></div>
          <div className="px-2 border-l-2 border-transparent flex gap-4 mb-1 text-blue-500 font-bold opacity-70 w-max">
            {Array.from({ length: displayLimit }).map((_, j) => (
              <span key={j} className="w-10 shrink-0 text-center">
                P{j}
              </span>
            ))}
            {n > displayLimit && (
              <span className="w-4 shrink-0 text-center">...</span>
            )}
          </div>
        </div>
      )}

      <div className="flex w-max">
        {/* Row headers */}
        <div className="flex flex-col gap-1 mr-2 mt-1 w-8 shrink-0 text-blue-500 font-bold opacity-70">
          {Array.from({ length: displayLimit }).map((_, i) => (
            <span key={i} className="h-5 flex items-center justify-end">
              P{i}
            </span>
          ))}
          {n > displayLimit && (
            <span className="h-5 flex items-center justify-end">...</span>
          )}
        </div>

        {/* Matrix values */}
        <div className="border-l-2 border-r-2 border-gray-400 px-2 py-1 flex flex-col gap-1 bg-white w-max">
          {dataMatrix.slice(0, displayLimit).map((rowOrVal: any, i: number) => (
            <div key={i} className="flex gap-4 h-5 items-center w-max">
              {isVector ? (
                <span className="w-10 shrink-0 text-center text-gray-800 font-medium">
                  {Number(rowOrVal).toFixed(2)}
                </span>
              ) : (
                <>
                  {rowOrVal
                    .slice(0, displayLimit)
                    .map((val: number, j: number) => (
                      <span
                        key={j}
                        className="w-10 shrink-0 text-center text-gray-700"
                      >
                        {Number(val).toFixed(2)}
                      </span>
                    ))}
                  {n > displayLimit && (
                    <span className="w-4 shrink-0 text-gray-400 text-center">
                      ...
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
          {n > displayLimit && (
            <div className="flex gap-4 justify-center text-gray-400 h-5 items-center w-max">
              <span className="shrink-0">...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-blue-50/50 rounded-3xl border border-blue-100 p-8 mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
            <Calculator size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-serif italic">
            Mathematical Simulation
          </h2>
        </div>

        {/* Expand matrix BUTTON */}
        {n > 5 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white font-bold transition-all shadow-sm active:scale-95"
          >
            {isExpanded ? "Collapse Matrix" : `View Full Matrix (${n}x${n})`}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
            Step 1: Adjacency Matrix (A)
          </h3>
          <div className="overflow-x-auto w-full">
            <div className="flex items-start">
              <span className="font-bold text-lg mr-2 mt-5">A =</span>
              {renderMatrix(adjacency_matrix)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
            Step 2: Stochastic Matrix (M)
          </h3>
          <div className="overflow-x-auto w-full">
            <div className="flex items-start">
              <span className="font-bold text-lg mr-2 mt-5">M =</span>
              {renderMatrix(stochastic_matrix)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sigma size={16} /> Power Iteration Method
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm text-gray-800 text-center border border-gray-200">
              v = d &sdot; M &sdot; v + ((1 - d) / {n}) &sdot; E
            </div>
            <p className="text-sm mt-4 font-medium text-green-600">
              ✓ The vector converges after {iterations} iterations.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center border-l border-gray-100 pl-6 w-full overflow-x-auto">
            <p className="text-sm font-bold text-gray-700 mb-2">
              Final PageRank Vector (v)
            </p>
            {renderMatrix(final_vector as any, true)}
            <p className="text-[10px] text-gray-400 mt-2 text-center italic">
              *P0, P1... corresponds to the labels on the Sidebar.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
