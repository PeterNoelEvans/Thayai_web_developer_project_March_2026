require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const nowServingRoutes = require('./routes/nowServing');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3201;

app.use(cors());
app.use(express.json());

// Static files: public + uploads
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'thayai-api', port: PORT });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/now-serving', nowServingRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Thayai API running on port ${PORT}`);
});
