const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  aiResponse: {
    description: {
      type: String,
      required: true
    },
    emotions: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    rawResponse: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries by userId
imageSchema.index({ userId: 1, createdAt: -1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
