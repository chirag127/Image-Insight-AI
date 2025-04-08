/**
 * Background script for Image Insight AI extension
 * Handles authentication state and communication with the backend
 */

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Image Insight AI extension installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({
    isAuthenticated: false,
    token: null,
    user: null
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle authentication
  if (request.action === 'login') {
    login(request.email, request.password)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
  
  if (request.action === 'signup') {
    signup(request.email, request.password)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
  
  if (request.action === 'logout') {
    logout()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
  
  // Handle image analysis
  if (request.action === 'analyzeImage') {
    analyzeImage(request.imageBase64)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
  
  // Handle history retrieval
  if (request.action === 'getHistory') {
    getHistory()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
  
  // Handle getting auth state
  if (request.action === 'getAuthState') {
    getAuthState()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
});

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data
 */
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save auth state to storage
    await chrome.storage.local.set({
      isAuthenticated: true,
      token: data.token,
      user: data.user
    });
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Signup user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data
 */
async function signup(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Signup failed');
    }
    
    // Save auth state to storage
    await chrome.storage.local.set({
      isAuthenticated: true,
      token: data.token,
      user: data.user
    });
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

/**
 * Logout user
 * @returns {Promise} - Promise with success
 */
async function logout() {
  try {
    // Clear auth state from storage
    await chrome.storage.local.set({
      isAuthenticated: false,
      token: null,
      user: null
    });
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Analyze image
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise} - Promise with analysis data
 */
async function analyzeImage(imageBase64) {
  try {
    // Get auth token from storage
    const { token } = await chrome.storage.local.get('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ imageBase64 })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Analysis failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw error;
  }
}

/**
 * Get user's history
 * @returns {Promise} - Promise with history data
 */
async function getHistory() {
  try {
    // Get auth token from storage
    const { token } = await chrome.storage.local.get('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get history');
    }
    
    return data.data;
  } catch (error) {
    console.error('Get history error:', error);
    throw error;
  }
}

/**
 * Get authentication state
 * @returns {Promise} - Promise with auth state
 */
async function getAuthState() {
  try {
    const { isAuthenticated, token, user } = await chrome.storage.local.get([
      'isAuthenticated',
      'token',
      'user'
    ]);
    
    return { isAuthenticated, token, user };
  } catch (error) {
    console.error('Get auth state error:', error);
    throw error;
  }
}
