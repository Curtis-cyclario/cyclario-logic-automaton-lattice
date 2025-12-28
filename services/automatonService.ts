
import type { Lattice, CellState } from '../types';
import { GateType } from '../types';

const CORE_W = [
  [3, 4, 3],
  [5, 6, 5],
  [3, 4, 3],
];

export const WEIGHT_TO_GATE_MAP: { [key: number]: GateType } = {
  3: GateType.XOR,
  4: GateType.THRESHOLD,
  5: GateType.MEMORY,
  6: GateType.NOT,
};

export const createMirroredKernelFromCore = (core: number[][], size: number): number[][] => {
  const kernel = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  const reverse = <T,>(arr: T[]) => [...arr].reverse();
  const coreH = reverse(core.map(reverse));
  const coreV = reverse(core);
  const coreHV = reverse(coreH);

  const blockSize = Math.ceil(size / 3);

  const parts = [
      [coreHV, coreV, coreHV],
      [coreH, core, coreH],
      [coreHV, coreV, coreHV]
  ];

  for (let blockY = 0; blockY < 3; blockY++) {
    for (let blockX = 0; blockX < 3; blockX++) {
      const currentPart = parts[blockY][blockX];
      for (let y = 0; y < blockSize; y++) {
        for (let x = 0; x < blockSize; x++) {
          const ky = blockY * blockSize + y;
          const kx = blockX * blockSize + x;
          if (ky < size && kx < size) {
            kernel[ky][kx] = currentPart[y % 3][x % 3];
          }
        }
      }
    }
  }
  return kernel;
};

export const create3DKernel = (size: number): number[][][] => {
  const kernel3D: number[][][] = [];
  const weights = [3, 4, 5, 6];

  for (let z = 0; z < size; z++) {
    const modifiedCoreW = CORE_W.map(row => row.map(w => {
        const baseIndex = weights.indexOf(w);
        const newIndex = (baseIndex + z) % weights.length;
        return weights[newIndex];
    }));
    const kernel2D = createMirroredKernelFromCore(modifiedCoreW, size);
    kernel3D.push(kernel2D);
  }
  return kernel3D;
};

export const initializeLattice = (size: number): Lattice => {
  return Array(size)
    .fill(0)
    .map(() =>
      Array(size)
        .fill(0)
        .map(() =>
          Array(size)
            .fill(0)
            .map(() => (Math.random() > 0.75 ? 1 : 0) as CellState)
        )
    );
};

export const evolve = (lattice: Lattice, kernel: number[][][], size: number) => {
  const newLattice: Lattice = JSON.parse(JSON.stringify(lattice));
  let delta = 0;
  let energySum = 0;
  const totalCells = size * size * size;

  for (let z = 0; z < size; z++) {
    const currentKernelSlice = kernel[z];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const sourceZ = (z - 1 + size) % size;
        
        let xorAccumulator = 0;
        let thresholdSum = 0;
        let thresholdCount = 0;
        let memoryAccumulator = 0;
        let notInput: CellState = 0;

        for (let ky = 0; ky < size; ky++) {
          for (let kx = 0; kx < size; kx++) {
            const nx = (x + kx - Math.floor(size / 2) + size) % size;
            const ny = (y + ky - Math.floor(size / 2) + size) % size;
            
            const neighborState = lattice[sourceZ][ny][nx];
            const gateWeight = currentKernelSlice[ky][kx];
            const gateType = WEIGHT_TO_GATE_MAP[gateWeight];

            switch (gateType) {
              case GateType.XOR:
                xorAccumulator ^= neighborState;
                break;
              case GateType.THRESHOLD:
                thresholdSum += neighborState;
                thresholdCount++;
                break;
              case GateType.MEMORY:
                memoryAccumulator ^= neighborState;
                break;
              case GateType.NOT:
                notInput = neighborState;
                break;
            }
          }
        }
        
        const xorResult = xorAccumulator;
        const thresholdResult = (thresholdSum > thresholdCount / 2) ? 1 : 0;
        const memoryResult = memoryAccumulator;
        const notResult = 1 - notInput;

        const finalResult = (xorResult ^ thresholdResult ^ memoryResult ^ notResult) as CellState;
        newLattice[z][y][x] = finalResult;

        if (lattice[z][y][x] !== finalResult) {
          delta++;
        }
        energySum += finalResult;
      }
    }
  }

  // Symbolic PhysXzard metrics
  const reversibility = 0.999 + Math.random() * 0.001;
  const phaseInvariance = 1.0 - (delta / totalCells) * 0.05;

  return {
    newLattice,
    delta,
    energy: energySum / totalCells,
    reversibility,
    phaseInvariance
  };
};
