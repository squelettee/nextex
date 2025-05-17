// FlamingNextex.tsx
// Requires custom CSS for .animate-flame1, .animate-flame2, .animate-flame3 in your global CSS file.

import React from "react";

export default function FlamingNextex() {
  return (
    <span
      className="text-6xl font-extrabold bg-gradient-to-t from-orange-600 via-yellow-400 to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,115,0,0.7)] relative inline-block"
    >
      nextex
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
        <span className="w-2 h-4 bg-yellow-300 rounded-full animate-flame1 opacity-80"></span>
        <span className="w-1.5 h-3 bg-orange-400 rounded-full animate-flame2 opacity-70"></span>
        <span className="w-2 h-5 bg-red-500 rounded-full animate-flame3 opacity-60"></span>
      </span>
    </span>
  );
} 