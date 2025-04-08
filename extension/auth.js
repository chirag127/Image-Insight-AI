/**
 * Authentication module for Image Insight AI extension
 * Handles login, signup, and logout functionality
 */

// DOM elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

/**
 * Initialize authentication
 * Check if user is authenticated and show appropriate view
 */
function initAuth() {
  // Check authentication state
  chrome.runtime.sendMessage({ action: 'getAuthState' }, (response) => {
    if (response.success && response.data.isAuthenticated) {
      // User is authenticated, show app
      showApp();
    } else {
      // User is not authenticated, show auth
      showAuth();
    }
  });
  
  // Set up event listeners
  setupAuthListeners();
}

/**
 * Set up authentication event listeners
 */
function setupAuthListeners() {
  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate input
    if (!email || !password) {
      showLoginError('Please enter email and password');
      return;
    }
    
    // Send login request to background script
    chrome.runtime.sendMessage(
      { action: 'login', email, password },
      (response) => {
        if (response.success) {
          // Login successful, show app
          showApp();
        } else {
          // Login failed, show error
          showLoginError(response.error || 'Login failed');
        }
      }
    );
  });
  
  // Signup form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validate input
    if (!email || !password || !confirmPassword) {
      showSignupError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showSignupError('Passwords do not match');
      return;
    }
    
    // Send signup request to background script
    chrome.runtime.sendMessage(
      { action: 'signup', email, password },
      (response) => {
        if (response.success) {
          // Signup successful, show app
          showApp();
        } else {
          // Signup failed, show error
          showSignupError(response.error || 'Signup failed');
        }
      }
    );
  });
  
  // Logout button click
  logoutBtn.addEventListener('click', () => {
    // Send logout request to background script
    chrome.runtime.sendMessage({ action: 'logout' }, (response) => {
      if (response.success) {
        // Logout successful, show auth
        showAuth();
      }
    });
  });
  
  // Switch between login and signup forms
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
  });
  
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
  });
}

/**
 * Show authentication container
 */
function showAuth() {
  authContainer.style.display = 'block';
  appContainer.style.display = 'none';
  showLoginForm();
}

/**
 * Show app container
 */
function showApp() {
  authContainer.style.display = 'none';
  appContainer.style.display = 'block';
  
  // Initialize app
  initApp();
}

/**
 * Show login form
 */
function showLoginForm() {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  clearErrors();
}

/**
 * Show signup form
 */
function showSignupForm() {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  clearErrors();
}

/**
 * Show login error
 * @param {string} message - Error message
 */
function showLoginError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

/**
 * Show signup error
 * @param {string} message - Error message
 */
function showSignupError(message) {
  signupError.textContent = message;
  signupError.style.display = 'block';
}

/**
 * Clear all error messages
 */
function clearErrors() {
  loginError.style.display = 'none';
  signupError.style.display = 'none';
}
