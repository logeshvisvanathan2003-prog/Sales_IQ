const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyticsRoutes = require('./routes/analytics');
const transactionsRoutes = require('./routes/transactions');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SalesIQ API running', timestamp: new Date().toISOString() });
});

app.use('/api/analytics', analyticsRoutes);
app.use('/api/transactions', transactionsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 SalesIQ API on http://localhost:${PORT}`);
  console.log(`📊 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  DB: ${process.env.DATABASE_URL ? 'Neon (cloud)' : 'Local PostgreSQL'}\n`);
});

module.exports = app;
