
import React from 'react';
import { useAutomaton } from './hooks/useAutomaton';
import LatticeDisplay from './components/LatticeDisplay';
import Controls from './components/Controls';
import MetricsChart from './components/MetricsChart';
import KernelDisplay from './components/KernelDisplay';
import { WEIGHT_TO_GATE_MAP } from './services/automatonService';
import { UIMode } from './types';

const App: React.FC = () => {
  const {
    lattice, metrics, timeStep, isRunning, zSlice, setZSlice, togglePlay,
    resetAutomaton, stepForward, speed, setSpeed, savedStates, saveLattice,
    loadLattice, apiConnectionError, refreshSavedStates, size, setSize, mode, setMode, kernel
  } = useAutomaton();

  const currentSlice = lattice[zSlice];

  return (
    <div className={`min-h-screen bg-[#050505] text-gray-200 flex flex-col items-center p-4 font-mono transition-all duration-700 ${mode === UIMode.CINEMATIC ? 'brightness-110' : ''}`}>
      <header className="w-full max-w-7xl mb-8 flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-4">
        <div>
          <h1 className="text-2xl font-black text-cyan-400 tracking-tighter uppercase">
            Cyclario <span className="text-gray-600">v3.1</span>
          </h1>
          <p className="text-[10px] text-cyan-800 font-bold uppercase tracking-widest">
            3D Neuromorphic Quantum Photonic Engine
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-cyan-200 leading-none">{timeStep}</div>
          <div className="text-[10px] text-gray-600 uppercase font-bold">LUMEN TICKS</div>
        </div>
      </header>
      
      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[450px] flex flex-col items-center">
          <div className={`relative ${mode === UIMode.CINEMATIC ? 'scale-110 rotate-1 shadow-2xl shadow-cyan-500/20' : ''} transition-all duration-500`}>
            <LatticeDisplay slice={currentSlice} />
            {mode === UIMode.PHYSXZARD && (
               <div className="absolute -top-4 -left-4 bg-cyan-500 text-black px-2 py-1 text-[8px] font-black uppercase">
                 Live Matrix N={size}
               </div>
            )}
          </div>
          
          <Controls
            isRunning={isRunning} togglePlay={togglePlay} reset={resetAutomaton} step={stepForward}
            zSlice={zSlice} setZSlice={setZSlice} speed={speed} setSpeed={setSpeed}
            timeStep={timeStep} savedStates={savedStates} saveLattice={saveLattice}
            loadLattice={loadLattice} apiConnectionError={apiConnectionError}
            refreshSavedStates={refreshSavedStates} size={size} setSize={setSize}
            mode={mode} setMode={setMode}
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {mode !== UIMode.CONSUMER && (
            <KernelDisplay kernel={kernel} gateMap={WEIGHT_TO_GATE_MAP} />
          )}
          
          <div className="bg-black/50 p-6 rounded-xl border border-gray-900">
             <MetricsChart data={metrics} />
             
             {mode === UIMode.PHYSXZARD && metrics.length > 0 && (
               <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
                 <div>
                   <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Quantum Reversibility</div>
                   <div className="text-xl font-bold text-emerald-500">
                     {(metrics[metrics.length-1].reversibility * 100).toFixed(4)}%
                   </div>
                 </div>
                 <div>
                   <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Phase Stability</div>
                   <div className="text-xl font-bold text-cyan-500">
                     {(metrics[metrics.length-1].phaseInvariance).toFixed(6)}σ
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mt-12 py-6 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-700 font-bold uppercase tracking-widest">
        <div>Proprietary Logic Gate Matrix F | IP Protection Δ-SWASTIKA ACTIVE</div>
        <div>Engine Mode: {mode}</div>
      </footer>
    </div>
  );
};

export default App;
