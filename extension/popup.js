/**
 * Main script for Image Insight AI extension popup
 * Handles image upload, analysis, and history display
 */

// DOM elements
const uploadBtn = document.getElementById('upload-btn');
const captureBtn = document.getElementById('capture-btn');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const resultContainer = document.getElementById('result-container');
const loadingSpinner = document.getElementById('loading-spinner');
const historyBtn = document.getElementById('history-btn');
const historyContainer = document.getElementById('history-container');
const backToAnalysisBtn = document.getElementById('back-to-analysis');
const analysisContainer = document.getElementById('analysis-container');
const resultDescription = document.getElementById('result-description');
const resultEmotions = document.getElementById('result-emotions');
const resultTags = document.getElementById('result-tags');
const fileInput = document.getElementById('file-input');

// Global variables
let currentImageBase64 = null;
let currentAnalysisResult = null;

/**
 * Initialize the app
 * Set up event listeners and load history
 */
function initApp() {
  // Set up event listeners
  setupAppListeners();
  
  // Show analysis view by default
  showAnalysisView();
}

/**
 * Set up app event listeners
 */
function setupAppListeners() {
  // Upload button click
  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', handleFileSelect);
  
  // Capture button click
  captureBtn.addEventListener('click', captureActiveTabScreenshot);
  
  // Analyze button click
  analyzeBtn.addEventListener('click', analyzeCurrentImage);
  
  // History button click
  historyBtn.addEventListener('click', () => {
    showHistoryView();
    loadHistory();
  });
  
  // Back to analysis button click
  backToAnalysisBtn.addEventListener('click', showAnalysisView);
}

/**
 * Handle file selection
 * @param {Event} event - File input change event
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      displayImagePreview(imageDataUrl);
      
      // Extract base64 data (remove data:image/png;base64, prefix)
      currentImageBase64 = imageDataUrl.split(',')[1];
      
      // Enable analyze button
      analyzeBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
  }
}

/**
 * Capture screenshot of active tab
 */
function captureActiveTabScreenshot() {
  chrome.tabs.captureVisibleTab((screenshotUrl) => {
    displayImagePreview(screenshotUrl);
    
    // Extract base64 data (remove data:image/png;base64, prefix)
    currentImageBase64 = screenshotUrl.split(',')[1];
    
    // Enable analyze button
    analyzeBtn.disabled = false;
  });
}

/**
 * Display image preview
 * @param {string} imageDataUrl - Data URL of the image
 */
function displayImagePreview(imageDataUrl) {
  imagePreview.src = imageDataUrl;
  imagePreview.style.display = 'block';
  
  // Clear previous results
  clearResults();
}

/**
 * Analyze current image
 */
function analyzeCurrentImage() {
  if (!currentImageBase64) {
    return;
  }
  
  // Show loading spinner
  loadingSpinner.style.display = 'block';
  analyzeBtn.disabled = true;
  
  // Send analyze request to background script
  chrome.runtime.sendMessage(
    { action: 'analyzeImage', imageBase64: currentImageBase64 },
    (response) => {
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      
      if (response.success) {
        // Analysis successful, display results
        displayResults(response.data);
        currentAnalysisResult = response.data;
      } else {
        // Analysis failed, show error
        showError(response.error || 'Analysis failed');
        analyzeBtn.disabled = false;
      }
    }
  );
}

/**
 * Display analysis results
 * @param {Object} data - Analysis data
 */
function displayResults(data) {
  resultContainer.style.display = 'block';
  
  // Display description
  resultDescription.textContent = data.aiResponse.description;
  
  // Display emotions
  resultEmotions.textContent = data.aiResponse.emotions;
  
  // Display tags
  resultTags.innerHTML = '';
  data.aiResponse.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    resultTags.appendChild(tagElement);
  });
}

/**
 * Clear analysis results
 */
function clearResults() {
  resultContainer.style.display = 'none';
  resultDescription.textContent = '';
  resultEmotions.textContent = '';
  resultTags.innerHTML = '';
  currentAnalysisResult = null;
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  // Add error to result container
  resultContainer.innerHTML = '';
  resultContainer.appendChild(errorElement);
  resultContainer.style.display = 'block';
}

/**
 * Load user's history
 */
function loadHistory() {
  // Clear history container
  historyContainer.innerHTML = '';
  
  // Show loading spinner
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading-history';
  loadingElement.textContent = 'Loading history...';
  historyContainer.appendChild(loadingElement);
  
  // Send get history request to background script
  chrome.runtime.sendMessage({ action: 'getHistory' }, (response) => {
    // Remove loading element
    historyContainer.removeChild(loadingElement);
    
    if (response.success) {
      // History loaded successfully, display items
      if (response.data.length === 0) {
        // No history items
        const noHistoryElement = document.createElement('div');
        noHistoryElement.className = 'no-history';
        noHistoryElement.textContent = 'No history items yet.';
        historyContainer.appendChild(noHistoryElement);
      } else {
        // Display history items
        response.data.forEach(item => {
          const historyItem = createHistoryItem(item);
          historyContainer.appendChild(historyItem);
        });
      }
    } else {
      // Failed to load history, show error
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = response.error || 'Failed to load history';
      historyContainer.appendChild(errorElement);
    }
  });
}

/**
 * Create history item element
 * @param {Object} item - History item data
 * @returns {HTMLElement} - History item element
 */
function createHistoryItem(item) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  
  // Create image element
  const imageElement = document.createElement('img');
  imageElement.className = 'history-image';
  imageElement.src = item.imageUrl;
  imageElement.alt = 'Analysis image';
  
  // Create info container
  const infoContainer = document.createElement('div');
  infoContainer.className = 'history-info';
  
  // Create date element
  const dateElement = document.createElement('div');
  dateElement.className = 'history-date';
  dateElement.textContent = new Date(item.createdAt).toLocaleString();
  
  // Create description element
  const descriptionElement = document.createElement('div');
  descriptionElement.className = 'history-description';
  descriptionElement.textContent = item.aiResponse.description;
  
  // Create tags element
  const tagsElement = document.createElement('div');
  tagsElement.className = 'history-tags';
  
  item.aiResponse.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    tagsElement.appendChild(tagElement);
  });
  
  // Append elements to info container
  infoContainer.appendChild(dateElement);
  infoContainer.appendChild(descriptionElement);
  infoContainer.appendChild(tagsElement);
  
  // Append elements to history item
  historyItem.appendChild(imageElement);
  historyItem.appendChild(infoContainer);
  
  // Add click event to view full details
  historyItem.addEventListener('click', () => {
    // Show analysis view with this item's data
    showAnalysisView();
    
    // Display image and results
    displayImagePreview(item.imageUrl);
    displayResults(item);
    
    // Set current image and result
    currentImageBase64 = null; // Can't re-analyze from history
    currentAnalysisResult = item;
  });
  
  return historyItem;
}

/**
 * Show analysis view
 */
function showAnalysisView() {
  analysisContainer.style.display = 'block';
  historyContainer.style.display = 'none';
  backToAnalysisBtn.style.display = 'none';
  historyBtn.style.display = 'block';
}

/**
 * Show history view
 */
function showHistoryView() {
  analysisContainer.style.display = 'none';
  historyContainer.style.display = 'block';
  backToAnalysisBtn.style.display = 'block';
  historyBtn.style.display = 'none';
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
