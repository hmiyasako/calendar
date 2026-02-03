import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';
import eventsRouter from './routes/events';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
