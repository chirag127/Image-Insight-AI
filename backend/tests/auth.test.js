const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const { User } = require('../models');

let mongoServer;

// Setup MongoDB Memory Server before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clear database between tests
beforeEach(async () => {
  await User.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Authentication API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should return error if email is already in use', async () => {
      // Create a user first
      await User.create({
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      // Create a user first
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      
      // Login with the user
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should return error if email is incorrect', async () => {
      // Create a user first
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      
      // Try to login with incorrect email
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if password is incorrect', async () => {
      // Create a user first
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      
      // Try to login with incorrect password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should return current user', async () => {
      // Create a user first
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      
      // Get token
      const token = user.generateAuthToken();
      
      // Get current user
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return error if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
});
