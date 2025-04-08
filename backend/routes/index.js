const express = require('express');
const authRoutes = require('./auth.routes');
const imageRoutes = require('./image.routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/', imageRoutes);

module.exports = router;
