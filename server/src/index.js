require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'thayai-api', port: PORT });
});

// Placeholder for future routes
app.get('/api', (req, res) => {
  res.json({ message: 'Thayai Restaurant Ordering API', version: '0.1.0' });
});

app.listen(PORT, () => {
  console.log(`Thayai API running on port ${PORT}`);
});
