
import React, { useState } from 'react';
import { GateType } from '../types';

interface KernelDisplayProps {
  kernel: number[][][];
  gateMap: { [key: number]: GateType };
}

const weightColorMap: { [key: number]: string } = {
  3: 'bg-indigo-500/80 text-indigo-100',
  4: 'bg-teal-500/80 text-teal-100',
  5: 'bg-amber-500/80 text-amber-100',
  6: 'bg-rose-600/80 text-rose-100',
};

const KernelDisplay: React.FC<KernelDisplayProps> = ({ kernel, gateMap }) => {
  const [zSlice, setZSlice] = useState(0);
  const size = kernel.length;
  const currentSlice = kernel[zSlice] || kernel[0];

  return (
    <div className="w-full flex flex-col items-center p-4 bg-black/40 rounded-xl border border-gray-800">
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-cyan-600">
        Mirrored Weighted Kernel Topology
      </h3>
      <div className="p-1 bg-gray-900 rounded shadow-inner">
        <div 
          className="grid gap-[1px]" 
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {currentSlice.map((row, y) =>
            row.map((weight, x) => (
              <div
                key={`${y}-${x}`}
                title={`Gate: ${gateMap[weight]}`}
                className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[8px] font-bold rounded-[1px] transition-colors ${
                  weightColorMap[weight] || 'bg-gray-800'
                }`}
              >
                {size < 12 ? weight : ''}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="w-full max-w-xs mt-6">
        <div className="flex justify-between text-[9px] uppercase font-bold mb-1 text-gray-500">
          <span>Projection Layer</span>
          <span>Z-{zSlice}</span>
        </div>
        <input
          type="range" min="0" max={kernel.length - 1} value={zSlice}
          onChange={(e) => setZSlice(parseInt(e.target.value, 10))}
          className="w-full accent-gray-600 h-1"
        />
      </div>
    </div>
  );
};

export default KernelDisplay;
