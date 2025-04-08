/**
 * Shared constants for Image Insight AI
 * Used by both frontend and backend
 */

// API endpoints
const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me'
  },
  IMAGE: {
    ANALYZE: '/api/analyze',
    HISTORY: '/api/history',
    HISTORY_ITEM: '/api/history/:id'
  }
};

// Error messages
const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_EXISTS: 'User with this email already exists',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_LENGTH: 'Password must be at least 6 characters long',
    INVALID_EMAIL: 'Please provide a valid email address'
  },
  IMAGE: {
    UPLOAD_FAILED: 'Failed to upload image',
    ANALYSIS_FAILED: 'Failed to analyze image',
    IMAGE_REQUIRED: 'Please provide an image',
    NOT_FOUND: 'Image analysis not found'
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    NOT_AUTHENTICATED: 'Not authenticated',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired'
  }
};

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_ENDPOINTS,
    ERROR_MESSAGES
  };
}

// Export for browser (frontend)
if (typeof window !== 'undefined') {
  window.API_ENDPOINTS = API_ENDPOINTS;
  window.ERROR_MESSAGES = ERROR_MESSAGES;
}
