
import React from 'react';
import type { LatticeSlice } from '../types';

interface LatticeDisplayProps {
  slice: LatticeSlice;
}

const LatticeDisplay: React.FC<LatticeDisplayProps> = ({ slice }) => {
  const size = slice.length;

  return (
    <div className="p-2 bg-black rounded-lg border border-cyan-900/50 shadow-inner">
      <div 
        className="grid gap-0.5 md:gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: size > 12 ? '320px' : '400px',
          height: size > 12 ? '320px' : '400px'
        }}
      >
        {slice.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`transition-all duration-300 rounded-[1px] ${
                cell === 1
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.6)] z-10'
                  : 'bg-gray-800/40 hover:bg-gray-700/50'
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LatticeDisplay;
