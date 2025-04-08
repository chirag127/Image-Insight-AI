const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const { User, Image } = require('../models');
const { uploadToFreeImageHost } = require('../utils/uploadToFreeImageHost');
const { analyzeImage } = require('../utils/geminiApi');

// Mock the uploadToFreeImageHost function
jest.mock('../utils/uploadToFreeImageHost', () => ({
  uploadToFreeImageHost: jest.fn()
}));

// Mock the analyzeImage function
jest.mock('../utils/geminiApi', () => ({
  analyzeImage: jest.fn()
}));

let mongoServer;
let token;
let userId;

// Setup MongoDB Memory Server before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create a test user
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123'
  });
  
  userId = user._id;
  token = user.generateAuthToken();
});

// Clear database between tests
beforeEach(async () => {
  await Image.deleteMany({});
  
  // Reset mocks
  uploadToFreeImageHost.mockReset();
  analyzeImage.mockReset();
});

// Close database connection after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Image API', () => {
  describe('POST /api/analyze', () => {
    it('should analyze image and return results', async () => {
      // Mock the uploadToFreeImageHost function
      uploadToFreeImageHost.mockResolvedValue('https://example.com/image.jpg');
      
      // Mock the analyzeImage function
      analyzeImage.mockResolvedValue({
        description: 'A beautiful landscape',
        emotions: 'Peaceful, serene',
        tags: ['nature', 'landscape', 'mountains'],
        rawResponse: 'Raw response from Gemini API'
      });
      
      const res = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .send({
          imageBase64: 'base64encodedimage'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('imageUrl', 'https://example.com/image.jpg');
      expect(res.body.data).toHaveProperty('aiResponse');
      expect(res.body.data.aiResponse).toHaveProperty('description', 'A beautiful landscape');
      expect(res.body.data.aiResponse).toHaveProperty('emotions', 'Peaceful, serene');
      expect(res.body.data.aiResponse).toHaveProperty('tags');
      expect(res.body.data.aiResponse.tags).toEqual(['nature', 'landscape', 'mountains']);
      
      // Verify that the functions were called with the correct arguments
      expect(uploadToFreeImageHost).toHaveBeenCalledWith('base64encodedimage');
      expect(analyzeImage).toHaveBeenCalledWith('https://example.com/image.jpg');
    });
    
    it('should return error if image is missing', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .send({
          imageBase64: 'base64encodedimage'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('GET /api/history', () => {
    it('should return user\'s image analysis history', async () => {
      // Create some test images
      await Image.create([
        {
          userId,
          imageUrl: 'https://example.com/image1.jpg',
          aiResponse: {
            description: 'Image 1 description',
            emotions: 'Happy',
            tags: ['tag1', 'tag2'],
            rawResponse: 'Raw response 1'
          }
        },
        {
          userId,
          imageUrl: 'https://example.com/image2.jpg',
          aiResponse: {
            description: 'Image 2 description',
            emotions: 'Sad',
            tags: ['tag3', 'tag4'],
            rawResponse: 'Raw response 2'
          }
        }
      ]);
      
      const res = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 2);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveLength(2);
      
      // Check first image
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('imageUrl', 'https://example.com/image2.jpg');
      expect(res.body.data[0]).toHaveProperty('aiResponse');
      expect(res.body.data[0].aiResponse).toHaveProperty('description', 'Image 2 description');
      expect(res.body.data[0].aiResponse).toHaveProperty('emotions', 'Sad');
      expect(res.body.data[0].aiResponse).toHaveProperty('tags');
      expect(res.body.data[0].aiResponse.tags).toEqual(['tag3', 'tag4']);
      
      // Check second image
      expect(res.body.data[1]).toHaveProperty('id');
      expect(res.body.data[1]).toHaveProperty('imageUrl', 'https://example.com/image1.jpg');
      expect(res.body.data[1]).toHaveProperty('aiResponse');
      expect(res.body.data[1].aiResponse).toHaveProperty('description', 'Image 1 description');
      expect(res.body.data[1].aiResponse).toHaveProperty('emotions', 'Happy');
      expect(res.body.data[1].aiResponse).toHaveProperty('tags');
      expect(res.body.data[1].aiResponse.tags).toEqual(['tag1', 'tag2']);
    });
    
    it('should return empty array if user has no history', async () => {
      const res = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 0);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveLength(0);
    });
    
    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .get('/api/history');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('GET /api/history/:id', () => {
    it('should return a specific image analysis', async () => {
      // Create a test image
      const image = await Image.create({
        userId,
        imageUrl: 'https://example.com/image.jpg',
        aiResponse: {
          description: 'Image description',
          emotions: 'Happy',
          tags: ['tag1', 'tag2'],
          rawResponse: 'Raw response'
        }
      });
      
      const res = await request(app)
        .get(`/api/history/${image._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', image._id.toString());
      expect(res.body.data).toHaveProperty('imageUrl', 'https://example.com/image.jpg');
      expect(res.body.data).toHaveProperty('aiResponse');
      expect(res.body.data.aiResponse).toHaveProperty('description', 'Image description');
      expect(res.body.data.aiResponse).toHaveProperty('emotions', 'Happy');
      expect(res.body.data.aiResponse).toHaveProperty('tags');
      expect(res.body.data.aiResponse.tags).toEqual(['tag1', 'tag2']);
    });
    
    it('should return error if image not found', async () => {
      const res = await request(app)
        .get(`/api/history/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .get(`/api/history/${new mongoose.Types.ObjectId()}`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('DELETE /api/history/:id', () => {
    it('should delete a specific image analysis', async () => {
      // Create a test image
      const image = await Image.create({
        userId,
        imageUrl: 'https://example.com/image.jpg',
        aiResponse: {
          description: 'Image description',
          emotions: 'Happy',
          tags: ['tag1', 'tag2'],
          rawResponse: 'Raw response'
        }
      });
      
      const res = await request(app)
        .delete(`/api/history/${image._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify that the image was deleted
      const deletedImage = await Image.findById(image._id);
      expect(deletedImage).toBeNull();
    });
    
    it('should return error if image not found', async () => {
      const res = await request(app)
        .delete(`/api/history/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/history/${new mongoose.Types.ObjectId()}`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
});
