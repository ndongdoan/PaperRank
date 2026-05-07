"use client";

import { motion } from "framer-motion";

interface NavbarProps {
  onLogoClick?: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-100 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-sm">
        {/* Logo */}
        <div onClick={onLogoClick} className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
            P
          </div>
          <span className="text-xl font-bold tracking-tighter text-gray-900 font-serif italic">PaperRank</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#explore" className="hover:text-gray-900 transition-colors">Contact Us</a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/ndongdoan/PaperRank" 
            target="_blank"
            className="p-2 text-gray-400 hover:text-gray-900 transition-all hover:scale-110"
            aria-label="GitHub"
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95">
            Log In
          </button>
        </div>
      </div>
    </motion.nav>
  );
}