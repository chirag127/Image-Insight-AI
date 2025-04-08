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

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local installation or MongoDB Atlas account)
-   Google Cloud account with Gemini API access

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

4. Update the `.env` file with your configuration:

    ```
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/image-insight-ai
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRY=7d
    GEMINI_API_KEY=your_gemini_api_key
    FREEIMAGE_API_KEY=6d207e02198a847aa98d0a2a901485a5
    ```

5. Start the server:

    ```
    npm start
    ```

    For development with auto-reload:

    ```
    npm run dev
    ```

### Extension Setup

1. Navigate to the extension directory:

    ```
    cd extension
    ```

2. Build the extension (optional):

    ```
    npm run build
    ```

3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked" and select the `extension` directory
6. The extension should now be installed and visible in your browser toolbar

### Testing

To run the backend tests:

```
npm test
```

For continuous testing during development:

```
npm run test:watch
```

To generate test coverage report:

```
npm run test:coverage
```

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
    -   Chrome Storage API

-   **Backend**:
    -   Node.js
    -   Express.js
    -   MongoDB with Mongoose
    -   JWT for authentication
    -   Gemini 2.0 Flash Lite API
    -   Axios for HTTP requests
    -   Jest and Supertest for testing

## Project Structure

```
root/
├── extension/                 # Browser Extension (Frontend)
│   ├── images/                # Extension icons
│   ├── popup.html            # Main extension popup
│   ├── popup.js              # Popup JavaScript
│   ├── auth.js               # Authentication functionality
│   ├── background.js         # Background script
│   ├── styles.css            # CSS styles
│   ├── manifest.json         # Extension manifest
│   └── package.json          # Frontend dependencies
│
├── backend/                  # Backend API Server
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── tests/                # Test files
│   ├── utils/                # Utility functions
│   ├── .env.example          # Example environment variables
│   ├── server.js             # Main server file
│   └── package.json          # Backend dependencies
│
├── shared/                   # Shared constants
├── .gitignore                # Git ignore file
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

## Error Handling

The application implements comprehensive error handling:

-   **Frontend**: Proper error messages for API failures, network issues, and validation errors
-   **Backend**: Centralized error handling middleware with appropriate HTTP status codes
-   **API**: Consistent error response format with descriptive messages
-   **Authentication**: Secure JWT validation with proper error responses

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[chirag127](https://github.com/chirag127)
