
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  initializeLattice,
  evolve,
  create3DKernel,
} from '../services/automatonService';
import * as apiService from '../services/apiService';
import { Lattice, MetricsData, SavedStateMeta, UIMode } from '../types';

const MAX_METRICS_LENGTH = 150;

export const useAutomaton = () => {
  const [size, setSize] = useState(9);
  const [mode, setMode] = useState<UIMode>(UIMode.PHYSXZARD);
  const [lattice, setLattice] = useState<Lattice>(() => initializeLattice(size));
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [timeStep, setTimeStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [zSlice, setZSlice] = useState(Math.floor(size / 2));
  const [speed, setSpeed] = useState(10);
  const [savedStates, setSavedStates] = useState<SavedStateMeta[]>([]);
  const [apiConnectionError, setApiConnectionError] = useState<string | null>(null);

  const kernel = useMemo(() => create3DKernel(size), [size]);

  const requestRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedIntervalRef = useRef<number>(1000 / speed);

  const stepForward = useCallback(() => {
    setLattice((prevLattice) => {
      const { newLattice, delta, energy, reversibility, phaseInvariance } = evolve(prevLattice, kernel, size);

      setTimeStep((t) => {
        const newTimeStep = t + 1;
        setMetrics((prevMetrics) => {
          const newMetric = { t: newTimeStep, delta, energy, reversibility, phaseInvariance };
          const nextMetrics = [...prevMetrics, newMetric];
          if (nextMetrics.length > MAX_METRICS_LENGTH) {
            return nextMetrics.slice(nextMetrics.length - MAX_METRICS_LENGTH);
          }
          return nextMetrics;
        });
        return newTimeStep;
      });

      return newLattice;
    });
  }, [kernel, size]);

  const animate = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateTimeRef.current > speedIntervalRef.current) {
      lastUpdateTimeRef.current = timestamp;
      stepForward();
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [stepForward]);

  const refreshSavedStates = useCallback(async () => {
    try {
      const states = await apiService.getSavedStates();
      setSavedStates(states);
      setApiConnectionError(null);
    } catch (error) {
      setApiConnectionError("Backend disconnected. Persistent state unavailable.");
    }
  }, []);

  useEffect(() => {
    refreshSavedStates();
  }, [refreshSavedStates]);

  useEffect(() => {
    if (isRunning) {
      lastUpdateTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  useEffect(() => {
    speedIntervalRef.current = 1000 / speed;
  }, [speed]);

  const handleSizeChange = (newSize: number) => {
    setIsRunning(false);
    setSize(newSize);
    setLattice(initializeLattice(newSize));
    setMetrics([]);
    setTimeStep(0);
    setZSlice(Math.floor(newSize / 2));
  };

  const resetAutomaton = () => {
    setIsRunning(false);
    setLattice(initializeLattice(size));
    setMetrics([]);
    setTimeStep(0);
    setZSlice(Math.floor(size / 2));
  };

  const saveLattice = useCallback(async (name: string) => {
    if (!name.trim()) return;
    try {
      await apiService.saveState(name, timeStep, lattice);
      await refreshSavedStates();
    } catch (error) {
      setApiConnectionError("Save failed.");
    }
  }, [lattice, timeStep, refreshSavedStates]);

  const loadLattice = useCallback(async (id: string) => {
    try {
      setIsRunning(false);
      const savedState = await apiService.loadState(id);
      setSize(savedState.lattice.length);
      setLattice(savedState.lattice);
      setTimeStep(savedState.timeStep);
      setMetrics([]);
      setZSlice(Math.floor(savedState.lattice.length / 2));
    } catch (error) {
      setApiConnectionError("Load failed.");
    }
  }, []);

  return {
    lattice,
    metrics,
    timeStep,
    isRunning,
    zSlice,
    setZSlice,
    togglePlay: () => setIsRunning(!isRunning),
    resetAutomaton,
    stepForward,
    speed,
    setSpeed,
    savedStates,
    saveLattice,
    loadLattice,
    apiConnectionError,
    refreshSavedStates,
    size,
    setSize: handleSizeChange,
    mode,
    setMode,
    kernel,
  };
};
