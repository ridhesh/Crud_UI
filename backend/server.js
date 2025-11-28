const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const initDatabase = require('./models/init');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Laundry Management API',
    database: 'Connected'
  });
});

// API info with ALL routes including DELETE
app.get('/api', (req, res) => {
  res.json({
    message: 'Laundry Management System API',
    version: '1.0.0',
    endpoints: {
      customers: {
        add: 'POST /api/customers/add',
        list: 'GET /api/customers/all',
        update: 'PUT /api/customers/update/:customerId',
        delete: 'DELETE /api/customers/delete/:customerId'
      },
      orders: {
        create: 'POST /api/orders/create',
        list: 'GET /api/orders/all',
        updateStatus: 'PUT /api/orders/update-status/:orderId',
        delete: 'DELETE /api/orders/delete/:orderId'
      },
      health: 'GET /api/health'
    }
  });
});

// Route debugging endpoint
app.get('/api/routes/debug', (req, res) => {
  const routes = [
    'GET /api/health',
    'GET /api',
    'GET /api/routes/debug',
    'POST /api/customers/add',
    'GET /api/customers/all', 
    'PUT /api/customers/update/:customerId',
    'DELETE /api/customers/delete/:customerId',
    'POST /api/orders/create',
    'GET /api/orders/all',
    'PUT /api/orders/update-status/:orderId',
    'DELETE /api/orders/delete/:orderId'
  ];
  res.json({ 
    message: 'Available API Routes',
    routes: routes,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Initialize database
initDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🐛 Route Debug: http://localhost:${PORT}/api/routes/debug`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   POST /api/customers/add');
  console.log('   GET  /api/customers/all');
  console.log('   PUT  /api/customers/update/:customerId');
  console.log('   DELETE /api/customers/delete/:customerId');
  console.log('   POST /api/orders/create');
  console.log('   GET  /api/orders/all');
  console.log('   PUT  /api/orders/update-status/:orderId');
  console.log('   DELETE /api/orders/delete/:orderId');
});