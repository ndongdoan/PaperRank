"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (keyword: string, author: string, limit: number, year: string) => void;
  isCollapsed: boolean;
}

export default function SearchBar({ onSearch, isCollapsed }: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [limit, setLimit] = useState(10); // Default search limit of 10 papers
  const [showOptions, setShowOptions] = useState(false);
  const [year, setYear] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword || author) onSearch(keyword, author, limit, year);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        y: isCollapsed ? 0 : 0, 
        scale: isCollapsed ? 0.85 : 1,
        maxWidth: isCollapsed ? "100%" : "56rem",
      }}
      transition={{ type: "spring", stiffness: 40, damping: 17, mass: 1.5 }}
      className="w-full mx-auto z-50 px-4 md:px-0"
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl transition-all duration-500 ${
          isCollapsed ? "rounded-2xl shadow-lg" : "rounded-4xl p-2"
        } flex flex-col md:flex-row gap-2`}
      >
        <div className={`flex-2 flex items-center px-4 gap-3 ${!isCollapsed && "border-b md:border-b-0 md:border-r border-gray-100"}`}>
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search keywords, topics, title, DOI..."
            className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="flex-1 flex items-center px-4 gap-3">
          <input
            type="text"
            placeholder="Author(s)..."
            className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Search button and Limit setting box */}
        <div className="flex items-center gap-2 pr-2 relative">
          <button 
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-xl transition-colors ${showOptions ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <Settings2 size={20} />
          </button>

          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95 font-medium whitespace-nowrap ${
              isCollapsed ? "px-6 py-2 m-1 rounded-xl text-sm" : "px-8 py-4 rounded-3xl"
            }`}
          >
            {isCollapsed ? "New Search" : "Explore"}
          </button>

          {/* Limit setting box */}
          <AnimatePresence>
            {showOptions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full mt-4 right-0 bg-white border border-gray-100 p-5 rounded-2xl shadow-xl z-10 flex flex-col gap-4 min-w-64 ${
                  isCollapsed ? "scale-110 origin-top-right" : ""
                }`}
              >
                {/* Limit */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Limit:</span>
                  <input 
                    type="number" 
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="w-20 bg-gray-50 px-3 py-1 rounded-lg text-sm font-mono text-blue-600 outline-none"
                  />
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* Year filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year Range:</span>
                  <input 
                    type="text"
                    placeholder="e.g. 2024 or 2020-2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono text-blue-600 outline-none"
                  />
                  
                  {/* Preset buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["Last 5y", "Last 10y"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          if (p === "Last 5y") {
                            const cy = new Date().getFullYear();
                            setYear(`${cy - 5}-${cy}`);
                          } 
                          else if (p === "Last 10y") {
                            const cy = new Date().getFullYear();
                            setYear(`${cy - 10}-${cy}`);
                          }
                        }}
                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 font-bold transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}