# Image Insight AI

A smart browser extension that analyzes images using AI, provides contextual insights, and stores history with user authentication.

## Features

-   Upload and analyze images using Gemini 2.0 Flash Lite
-   Get AI-generated insights (description, sentiment, tags)
-   Store analysis history per user
-   User authentication (signup/login/logout)
-   Image hosting via freeimage.host

## Architecture

The project consists of two main components:

1. **Browser Extension (Frontend)**

    - HTML, CSS, JavaScript
    - Chrome storage for token/session
    - Manifest V3 for browser compatibility

2. **Backend API Server**
    - Express.js server
    - MongoDB for data storage
    - JWT for authentication
    - Gemini 2.0 Flash Lite API integration
    - freeimage.host for image hosting

## Installation

### Backend Setup

1. Navigate to the backend directory:

    ```
    cd backend
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create a `.env` file based on `.env.example` and fill in your configuration:

    ```
    cp .env.example .env
    ```

4. Start the server:
    ```
    npm start
    ```

### Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the `extension` directory
4. The extension should now be installed and visible in your browser toolbar

## Usage

1. Click on the extension icon in your browser toolbar
2. Sign up or log in to your account
3. Upload an image or capture a screenshot
4. Click "Analyze Image" to get AI-generated insights
5. View your analysis history by clicking "View History"

## API Endpoints

-   `POST /api/auth/signup` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/me` - Get current user
-   `POST /api/analyze` - Analyze an image
-   `GET /api/history` - Get user's analysis history
-   `GET /api/history/:id` - Get a specific analysis
-   `DELETE /api/history/:id` - Delete an analysis

## Technologies Used

-   **Frontend**:

    -   HTML, CSS, JavaScript
    -   Chrome Extension API
    -   Fetch API

-   **Backend**:
    -   Node.js
    -   Express.js
    -   MongoDB with Mongoose
    -   JWT for authentication
    -   Gemini 2.0 Flash Lite API
    -   Axios for HTTP requests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[chirag127](https://github.com/chirag127)
