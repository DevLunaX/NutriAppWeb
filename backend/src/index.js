const express = require('express');
const cors = require('cors');
const patientsRouter = require('./routes/patients');

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NutriApp Backend API is running' });
});

// Routes
app.use('/api/patients', patientsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for origin: ${CORS_ORIGIN}`);
});
