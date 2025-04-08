const { Image } = require('../models');
const { uploadToFreeImageHost } = require('../utils/uploadToFreeImageHost');
const { analyzeImage } = require('../utils/geminiApi');

/**
 * @desc    Analyze an image
 * @route   POST /api/analyze
 * @access  Private
 */
const analyzeImageController = async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;
    
    // Validate input
    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image'
      });
    }
    
    // Upload image to freeimage.host
    const imageUrl = await uploadToFreeImageHost(imageBase64);
    
    // Analyze image with Gemini API
    const aiResponse = await analyzeImage(imageUrl);
    
    // Save analysis to database
    const image = await Image.create({
      userId: req.user._id,
      imageUrl,
      aiResponse
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: image._id,
        imageUrl,
        aiResponse
      }
    });
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    next(error);
  }
};

/**
 * @desc    Get user's image analysis history
 * @route   GET /api/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images.map(image => ({
        id: image._id,
        imageUrl: image.imageUrl,
        aiResponse: {
          description: image.aiResponse.description,
          emotions: image.aiResponse.emotions,
          tags: image.aiResponse.tags
        },
        createdAt: image.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single image analysis by ID
 * @route   GET /api/history/:id
 * @access  Private
 */
const getImageById = async (req, res, next) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image analysis not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: image._id,
        imageUrl: image.imageUrl,
        aiResponse: image.aiResponse,
        createdAt: image.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an image analysis
 * @route   DELETE /api/history/:id
 * @access  Private
 */
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image analysis not found'
      });
    }
    
    await image.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Image analysis deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeImageController,
  getHistory,
  getImageById,
  deleteImage
};
