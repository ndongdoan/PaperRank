"use client";

import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import GraphView from "@/components/GraphView";
import { fetchPaperRank, RankResponse } from "@/lib/api";
import MathSimulation from "@/components/MathSimulation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { Sliders, Telescope, Sparkle, Network, RefreshCw } from "lucide-react";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<RankResponse | null>(null);
  const [damping, setDamping] = useState(0.85);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState({
    keyword: "",
    author: "",
    limit: 10,
    year: "",
  });

  const handleReset = () => {
    setHasSearched(false);
    setGraphData(null);
    setSelectedId(null);
    setLoading(false);
    setCurrentQuery({ keyword: "", author: "", limit: 10, year: "" });
  };

  const handleSearch = async (
    keyword: string,
    author: string,
    limit: number,
    year: string = "",
    dFactor: number = damping,
    isUpdate = false,
  ) => {
    if (!keyword && !author) return;

    if (!isUpdate) {
      setLoading(true);
    } else {
      setIsRecalculating(true);
    }

    setHasSearched(true);
    setCurrentQuery({ keyword, author, limit, year });

    try {
      // Call API from backend
      const data = await fetchPaperRank(keyword, author, limit, year, dFactor);
      setGraphData(data);
    } catch (error) {
      console.error("Search failed:", error);
      // Add error toast message
    } finally {
      setLoading(false);
      setIsRecalculating(false);
    }
  };

  useEffect(() => {
    if (!hasSearched || (!currentQuery.keyword && !currentQuery.author)) return;

    const delayDebounceFn = setTimeout(() => {
      console.log(">>> Recalculate with new value d =", damping);
      handleSearch(
        currentQuery.keyword,
        currentQuery.author,
        currentQuery.limit,
        currentQuery.year,
        damping,
        true,
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [damping]);

  return (
    <main className="bg-[#FDFDFD] relative min-h-screen flex flex-col">
      <Navbar onLogoClick={handleReset} />
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[150px]" />
      </div>

      <div className="relative flex flex-col items-center w-full flex-1">
        {/* 1. Hero Section */}
        <motion.div
          animate={{
            height: hasSearched ? 0 : "48vh",
            paddingTop: hasSearched ? 0 : 128,
            opacity: hasSearched ? 0 : 1,
            marginBottom: hasSearched ? 0 : 40,
          }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col items-center justify-end overflow-hidden w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
          >
            CITATION NETWORK DISCOVERY
          </motion.div>
          <h1 className="text-8xl font-bold text-gray-900 mb-6 tracking-tighter font-serif italic">
            PaperRank
          </h1>
          <p className="text-gray-500 text-xl font-light max-w-2xl text-center px-4 leading-relaxed opacity-90">
            Uncover the world&apos;s most <br className="hidden md:block" />
            <span className="text-gray-900 font-medium whitespace-nowrap">
              influential research papers
            </span>{" "}
            with a single click.
          </p>
        </motion.div>

        {/* 2. Searchbar */}
        <div
          className={`relative z-50 w-full transition-all duration-1000 ${hasSearched ? "pt-26" : "pt-0"}`}
        >
          <SearchBar onSearch={handleSearch} isCollapsed={hasSearched} />
        </div>

        {/* 3. Graph */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="container mx-auto px-4 mt-4 w-full h-[85vh] min-h-162.5 pb-12"
            >
              <div className="h-full w-full bg-white rounded-[40px] border border-gray-100 shadow-2xl relative overflow-hidden">
                {/* Damping factor */}
                <div className="absolute top-6 left-6 z-20 bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-sm flex flex-col gap-4 min-w-60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Sliders size={14} /> Damping Factor
                    </span>
                    <span className="text-sm font-mono font-bold text-blue-600">
                      {damping}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={damping}
                    onChange={(e) => setDamping(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {isRecalculating
                        ? "Recalculating matrix..."
                        : "Matrix synchronized"}
                    </span>
                    <RefreshCw
                      size={12}
                      className={`text-gray-300 ${isRecalculating ? "animate-spin text-blue-600" : ""}`}
                    />
                  </div>
                </div>

                {/* Visualization & Sidebar Area */}
                <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
                  {loading ? (
                    <div className="flex-1 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mb-4" />
                      <p className="font-light italic text-gray-400">
                        Rendering graph...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Graph on the left */}
                      <div className="flex-3 relative border-r border-gray-50">
                        {graphData && graphData.nodes.length > 0 ? (
                          <GraphView
                            data={graphData}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                          />
                        ) : (
                          <p className="flex items-center justify-center h-full text-gray-300">
                            No data found.
                          </p>
                        )}
                      </div>

                      {/* Paper list on the right */}
                      <div className="flex-1 bg-gray-50/50 backdrop-blur-sm overflow-y-auto p-6 flex flex-col gap-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Network size={14} /> Ranked Papers (
                          {graphData?.nodes.length || 0})
                        </h3>

                        <div className="flex flex-col gap-3">
                          {[...(graphData?.nodes || [])]
                            .map((node, originalIndex) => ({
                              ...node,
                              pIndex: originalIndex,
                            }))
                            .sort((a, b) => b.rank - a.rank)
                            .map((node, index) => {
                              const authorsData = (node.authors ||
                                "Unknown") as string | string[];
                              const firstAuthor = Array.isArray(authorsData)
                                ? authorsData[0]
                                : authorsData?.split(",")[0];
                              const displayAuthor =
                                firstAuthor +
                                (Array.isArray(authorsData) &&
                                authorsData.length > 1
                                  ? " et al."
                                  : "");
                              const isSelected = selectedId === node.id;

                              return (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  key={node.id}
                                  onClick={() => setSelectedId(node.id)}
                                  id={`paper-${node.id}`}
                                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-100/50 shadow-lg ring-2 ring-blue-500/20"
                                      : "bg-white border-gray-100 hover:border-blue-200 shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span
                                      className={`text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded-lg shrink-0 ${
                                        isSelected
                                          ? "bg-blue-600 text-white"
                                          : "bg-blue-50 text-blue-600"
                                      }`}
                                    >
                                      {index + 1}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                      <h4
                                        className={`text-sm font-semibold leading-snug transition-colors ${
                                          isSelected
                                            ? "text-blue-700"
                                            : "text-gray-800 group-hover:text-blue-600"
                                        }`}
                                      >
                                        {node.title}
                                      </h4>
                                      <div className="flex flex-col gap-1.5 mt-2">
                                        {/* Line 1: P-index & Rank */}
                                        <div className="flex items-center gap-2">
                                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                            P{node.pIndex}
                                          </span>
                                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                            Rank: {node.rank.toFixed(4)}
                                          </span>
                                        </div>

                                        {/* Line 2: Author & Year */}
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                                          <span className="truncate max-w-45">
                                            {displayAuthor}
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span>{node.year || "N/A"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {graphData?.matrix_simulation && (
          <div className="container mx-auto px-4 pb-12 w-full">
            <MathSimulation data={graphData.matrix_simulation} />
          </div>
        )}
      </div>

      {/* 4. Product Value */}
      <AnimatePresence>
        {!hasSearched && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="container mx-auto px-4 py-32"
          >
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard
                icon={<Network className="text-blue-600" />}
                title="Visual Discovery"
                desc="See how papers connect and identify the pillars of any research field through an interactive map."
                delay={0.1}
              />
              <FeatureCard
                icon={<Telescope className="text-blue-600" />}
                title="Deep Exploration"
                desc="Find exactly what you need with an engine that understands the context behind every citation."
                delay={0.2}
              />
              <FeatureCard
                icon={<Sparkle className="text-blue-600" />}
                title="Priority Ranking"
                desc="Our engine automatically highlights the most significant works so you can focus on what matters."
                delay={0.3}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer
        className={`py-12 border-t border-gray-50 text-center transition-opacity duration-500 ${hasSearched ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-gray-300 text-[12px] font-bold tracking-[0.2em] uppercase">
          PaperRank • 2026
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: any;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="p-8 bg-white border border-gray-100 rounded-4xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
