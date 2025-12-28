
export type CellState = 0 | 1;

export type LatticeSlice = CellState[][];

export type Lattice = LatticeSlice[];

export interface MetricsData {
  t: number;
  delta: number;
  energy: number;
  reversibility: number; // For PhysXzard mode
  phaseInvariance: number; // For PhysXzard mode
}

export enum GateType {
  XOR = 'XOR',
  THRESHOLD = 'THRESHOLD',
  MEMORY = 'MEMORY',
  NOT = 'NOT',
}

export enum UIMode {
  CONSUMER = 'CONSUMER',
  PHYSXZARD = 'PHYSXZARD',
  CINEMATIC = 'CINEMATIC',
}

export interface SavedStateMeta {
  id: string;
  name: string;
  timeStep: number;
  createdAt: string;
  size: number;
}

export interface SavedState extends SavedStateMeta {
  lattice: Lattice;
}
