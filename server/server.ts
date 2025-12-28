import express from 'express';
import cors from 'cors';

// These types would typically be shared from a common module.
type CellState = 0 | 1;
type LatticeSlice = CellState[][];
type Lattice = LatticeSlice[];

interface SavedState {
  id: string;
  name: string;
  timeStep: number;
  lattice: Lattice;
  createdAt: string;
}

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Use built-in middleware for JSON parsing

// In-memory array to act as a database for demonstration purposes.
const savedStates: SavedState[] = [];

// API endpoint to save a new state.
app.post('/api/save', (req, res) => {
  const { name, timeStep, lattice } = req.body;
  if (!name || typeof timeStep === 'undefined' || !lattice) {
    return res.status(400).json({ error: 'Missing name, timeStep, or lattice data' });
  }

  const newState: SavedState = {
    id: `state_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    timeStep,
    lattice,
    createdAt: new Date().toISOString(),
  };

  savedStates.push(newState);
  console.log(`State saved: "${name}" (ID: ${newState.id}). Total states: ${savedStates.length}`);

  // Return metadata of the newly saved state for confirmation.
  res.status(201).json({ id: newState.id, name: newState.name, timeStep: newState.timeStep, createdAt: newState.createdAt });
});

// API endpoint to get a list of saved states (metadata only).
app.get('/api/saves', (req, res) => {
  const metadata = savedStates
    .map(({ id, name, timeStep, createdAt }) => ({
      id,
      name,
      timeStep,
      createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first
  res.json(metadata);
});

// API endpoint to get a specific full state by its ID.
app.get('/api/saves/:id', (req, res) => {
  const { id } = req.params;
  const state = savedStates.find(s => s.id === id);

  if (state) {
    res.json(state);
  } else {
    res.status(404).json({ error: 'State not found' });
  }
});

app.listen(port, () => {
  console.log(`Automaton backend server listening at http://localhost:${port}`);
  console.log('Run `npm install express cors` and `npx ts-node server/server.ts` to start.');
});
