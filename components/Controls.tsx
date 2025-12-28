
import React, { useState } from 'react';
import { PlayIcon, PauseIcon, ForwardIcon, ArrowPathIcon } from './Icons';
import { SavedStateMeta, UIMode } from '../types';

interface ControlsProps {
  isRunning: boolean;
  togglePlay: () => void;
  reset: () => void;
  step: () => void;
  zSlice: number;
  setZSlice: (z: number) => void;
  speed: number;
  setSpeed: (s: number) => void;
  timeStep: number;
  savedStates: SavedStateMeta[];
  saveLattice: (name: string) => void;
  loadLattice: (id: string) => void;
  apiConnectionError: string | null;
  refreshSavedStates: () => void;
  size: number;
  setSize: (s: number) => void;
  mode: UIMode;
  setMode: (m: UIMode) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning, togglePlay, reset, step, zSlice, setZSlice, speed, setSpeed, timeStep, 
  savedStates, saveLattice, loadLattice, apiConnectionError, refreshSavedStates,
  size, setSize, mode, setMode
}) => {
  const [saveName, setSaveName] = useState('');
  const [selectedSave, setSelectedSave] = useState('');

  return (
    <div className="w-full mt-4 p-4 bg-gray-900/80 rounded-xl border border-gray-800 shadow-xl">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6 bg-gray-800 p-1 rounded-lg">
        {Object.values(UIMode).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1 text-[10px] uppercase tracking-tighter rounded font-bold transition-all ${
              mode === m ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={reset} className="p-3 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded-full transition-all border border-red-900/50">
          <ArrowPathIcon className="w-5 h-5" />
        </button>
        <button onClick={togglePlay} className="p-5 bg-cyan-600/20 hover:bg-cyan-500 text-cyan-400 hover:text-black rounded-full transition-all border border-cyan-500/50 shadow-lg shadow-cyan-500/10">
          {isRunning ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
        </button>
        <button onClick={step} disabled={isRunning} className="p-3 bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white rounded-full transition-all disabled:opacity-20 border border-blue-900/50">
          <ForwardIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between text-[10px] text-cyan-500 uppercase font-bold mb-1">
            <span>Dimension</span>
            <span>{size}³</span>
          </div>
          <input type="range" min="3" max="15" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between text-[10px] text-cyan-500 uppercase font-bold mb-1">
            <span>Z-Depth</span>
            <span>Slice {zSlice}</span>
          </div>
          <input type="range" min="0" max={size - 1} value={zSlice} onChange={(e) => setZSlice(parseInt(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between text-[10px] text-cyan-500 uppercase font-bold mb-1">
            <span>Frequency</span>
            <span>{speed}Hz</span>
          </div>
          <input type="range" min="1" max="60" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>

      {mode === UIMode.PHYSXZARD && (
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-4">
           <div className="flex flex-col gap-2">
              <input
                type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)}
                placeholder="Calibration ID..."
                className="bg-black border border-gray-700 rounded px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 outline-none"
              />
              <button
                onClick={() => { saveLattice(saveName); setSaveName(''); }}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-cyan-500 border border-cyan-900 rounded text-[10px] font-bold uppercase tracking-widest"
              >
                Snapshot State
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
