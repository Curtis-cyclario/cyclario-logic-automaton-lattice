import type { Lattice, SavedState, SavedStateMeta } from '../types';

// In a real application, this would be an environment variable.
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Saves the current automaton state to the backend.
 * @param name - A user-provided name for the save state.
 * @param timeStep - The current time step of the simulation.
 * @param lattice - The 9x9x9 lattice data structure.
 * @returns Metadata of the newly saved state.
 */
export const saveState = async (name: string, timeStep: number, lattice: Lattice): Promise<SavedStateMeta> => {
  const response = await fetch(`${API_BASE_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, timeStep, lattice }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to save state: ${errorBody}`);
  }
  return response.json();
};

/**
 * Fetches the list of all saved states' metadata from the backend.
 * @returns An array of saved state metadata objects.
 */
export const getSavedStates = async (): Promise<SavedStateMeta[]> => {
  const response = await fetch(`${API_BASE_URL}/saves`);
  if (!response.ok) {
    throw new Error('Failed to fetch saved states');
  }
  return response.json();
};

/**
 * Fetches a full saved state, including the lattice, by its ID.
 * @param id - The unique identifier of the state to load.
 * @returns The complete saved state object.
 */
export const loadState = async (id: string): Promise<SavedState> => {
  const response = await fetch(`${API_BASE_URL}/saves/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load state with id ${id}`);
  }
  return response.json();
};
