// server.js - Main Express server for La Farine Bakery API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import menuRoutes from './routes/menu.js';
import saleRoutes from './routes/sale.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import geoRoutes from './routes/geo.js';
import emailRoutes from './routes/email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/la-farine';

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MONGODB CONNECTION ────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB error:', err));

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api/menu', menuRoutes);
app.use('/api/sale', saleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bakery', geoRoutes);app.use('/api/email', emailRoutes);
// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── ERROR HANDLER ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍞 La Farine Backend running on http://localhost:${PORT}`);
  console.log(`📝 API Base: http://localhost:${PORT}/api`);
  console.log(`\n📌 POSTMAN TEST URLS:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/menu`);
  console.log(`   GET  http://localhost:${PORT}/api/sale`);
  console.log(`   POST http://localhost:${PORT}/api/orders`);
  console.log(`   GET  http://localhost:${PORT}/api/bakery/location`);
});
