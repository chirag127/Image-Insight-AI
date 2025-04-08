const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { db } = require('../config');

// Set up MongoDB Memory Server for testing
let mongoServer;

// Setup MongoDB Memory Server before all tests
beforeAll(async () => {
  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRY = '1h';
  
  // Create MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Set MongoDB URI for testing
  process.env.MONGODB_URI = uri;
  
  // Connect to MongoDB
  await mongoose.connect(uri);
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close MongoDB connection after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

module.exports = {
  mongoServer
};
