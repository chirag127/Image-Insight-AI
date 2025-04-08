const express = require('express');
const { imageController } = require('../controllers');
const { auth } = require('../middleware');

const router = express.Router();

// All routes are protected
router.use(auth);

// Analyze image
router.post('/analyze', imageController.analyzeImageController);

// Get history
router.get('/history', imageController.getHistory);

// Get single image analysis
router.get('/history/:id', imageController.getImageById);

// Delete image analysis
router.delete('/history/:id', imageController.deleteImage);

module.exports = router;
