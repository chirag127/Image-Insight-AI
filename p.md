Here’s a detailed **Product Requirements Document (PRD)** for your browser extension project using Gemini 2.0 Flash Lite, Express.js, and MongoDB, with login support and image uploads via `freeimage.host`.

---

# 📄 Product Requirements Document (PRD)

## 🧩 Project Title
**Image Insight AI**
*A smart browser extension that analyzes images using AI, provides contextual insights, and stores history with user authentication.*

---

## 🚀 Objective
To build a cross-browser extension that allows users to:
- Upload and analyze images using Gemini 2.0 Flash Lite.
- Get AI-generated insights (e.g., description, sentiment, tags).
- Store analysis history per user.
- Support login/logout.
- Host uploaded images via `freeimage.host`.

---

## 🏗️ Architecture Overview

### 📦 Project Structure
```
root/
├── extension/       # Browser Extension (Frontend)
│   ├── popup.html
│   ├── popup.js
│   ├── styles.css
│   ├── manifest.json
│   └── auth.js
├── backend/         # Backend API Server
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── utils/uploadToFreeImageHost.js
│   └── .env
└── shared/          # (Optional) Shared constants, types, etc.
```

---

## 🌐 Browser Support
- Chrome
- Edge
- Firefox
> Using Manifest V3 for compatibility.

---

## 🧠 Features

### 1. **User Authentication**
- **Signup/Login/Logout**
- Token-based authentication (JWT)
- Sessions persist using `chrome.storage.local`

---

### 2. **Image Analysis Flow**
- User selects or uploads an image.
- Extension converts image to base64.
- Sends base64 to backend.
- Backend uploads to `freeimage.host` and gets image URL.
- Sends prompt (with image URL) to **Gemini 2.0 Flash Lite** API.
- Receives AI response (tags, caption, insights).
- Saves image metadata + user + AI response to MongoDB.
- Displays result in extension popup.

---

### 3. **History Panel**
- Shows all previous image analyses for the logged-in user.
- Includes timestamp, AI summary, and image preview.
- Data fetched from MongoDB by user ID.

---

### 4. **UI Components**
- **Login/Signup Page**
- **Image Upload + Preview Panel**
- **AI Result Viewer**
- **History Viewer (Accordion/List)**
- **Logout Button**

---

## 🧰 Tech Stack

### 🔹 Frontend (Browser Extension)
- HTML, CSS, JavaScript
- `chrome.storage.local` for token/session
- `fetch` for backend calls
- Manifest V3

### 🔹 Backend
- **Express.js** server
- Routes: `/auth`, `/analyze`, `/history`
- **Gemini 2.0 Flash Lite API** for AI response
- **MongoDB** (users, images)
- `freeimage.host` uploader (via axios & form-data)

### 🔹 Storage
- MongoDB Collections:
  - `users`: `{ _id, email, hashedPassword }`
  - `images`: `{ _id, userId, imageUrl, aiResponse, createdAt }`

---

## 🔒 Authentication Details

- Passwords hashed with bcrypt.
- JWT for session auth (stored in browser local storage).
- Auth middleware protects API routes.

---

## 🔄 API Endpoints

### `POST /auth/signup`
- `{ email, password }`
- Returns JWT token.

### `POST /auth/login`
- `{ email, password }`
- Returns JWT token.

### `POST /analyze`
- `{ imageBase64 }` (requires `Authorization: Bearer <token>`)
- Returns `{ imageUrl, aiResponse }`.

### `GET /history`
- Returns user's analysis history.

---

## 📤 Upload to FreeImage Host

Code (already given by you):

```js
const uploadToFreeImageHost = async (imageBase64) => {
  // Upload image to freeimage.host
};
```

Returns an image URL used in Gemini prompt.

---

## 📸 Gemini Prompt Template (for Image Analysis)
```txt
"Analyze the following image from this URL: [imageURL]. Provide:
- A short description of the image.
- Any emotions or scene context.
- Tags/keywords that describe it."
```

---

## 📆 Milestones

| Week | Deliverables |
|------|--------------|
| 1 | Backend setup: auth, DB models, upload utility |
| 2 | Frontend setup: extension popup UI, login/logout |
| 3 | Integrate image upload + AI analysis |
| 4 | History view + polishing + cross-browser testing |

---

## ✅ Stretch Goals
- Dark mode toggle
- Multi-language support
- Export history to JSON/CSV
- Share image + AI results to social media

const axios = require("axios");
const FormData = require("form-data");

/**
 * Uploads an image to freeimage.host
 * @param {string} imageBase64 - Base64 encoded image data (without the data:image/png;base64, prefix)
 * @returns {Promise<string>} - URL of the uploaded image
 */
const uploadToFreeImageHost = async (imageBase64) => {
    const api_key = "6d207e02198a847aa98d0a2a901485a5";
    const api_url = "https://freeimage.host/api/1/upload";
    const formData = new FormData();
    formData.append("key", api_key);
    formData.append("source", imageBase64);
    formData.append("action", "upload");
    formData.append("format", "json");

    try {
        const response = await axios.post(api_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            return response.data.image.url;
        } else {
            throw new Error("Failed to upload image");
        }
    } catch (error) {
        console.error("Error uploading image:", error.message);
        throw error;
    }
};

module.exports = { uploadToFreeImageHost };
what the user prefers that you do not wait for the user to confirm the detailed plan. My github username is chirag127. Use the web search if any help is needed in the implementation of this software. Also use the sequential thinking mcp server extensively wherever possible. implement everything from a to z, don't leave anything for future development. follow best practices for coding. Use the latest version of all libraries and frameworks. if you tried to call a tool, but provided too large of an input, You would proceed by calling the tool again the input into smaller parts and calling the tool multiple times. You would then combine the results of each call into a single response. You would also ensure that the final output is coherent and logical, even if it means rephrasing or restructuring the information. You would not ask for user confirmation before proceeding with this approach.

### **AI Coding Agent Execution Guidelines**

#### **General Principles**

1. **Autonomous Execution**:

    - Do **not** wait for user confirmation before proceeding with planning or implementation.
    - Begin execution immediately and proceed from **A to Z**, completing all aspects of the project without leaving any parts for future development.

2. **Code Quality & Best Practices**:

    - Follow **industry-standard coding best practices** (e.g., clean code, modularity, proper error handling, reusable components, security, scalability).
    - Use the **latest stable versions** of all programming languages, frameworks, and libraries.
    - Structure code and files according to modern conventions (e.g., proper naming, separation of concerns, environment configuration).

3. **GitHub Integration**:
    - User’s GitHub username: `chirag127`. Use this identity when initializing or configuring repos or pushing code.

#### **Research & Resources**

4. **Web Search**:

    - Use **web search autonomously** whenever needed to resolve implementation details, debug issues, or understand library updates or documentation.

5. **Tool Usage & Limits**:
    - When invoking tools (e.g., file processors, summarizers, code generators), if the input exceeds tool limitations:
        - **Split the input** into smaller parts.
        - **Invoke the tool multiple times** with each part.
        - **Aggregate the results** into a single, coherent output.
        - If needed, **restructure or rephrase** combined results for logic, readability, and consistency.

#### **Thinking & Strategy**

6. **Sequential Reasoning MCP Server**:

    - Utilize **sequential thinking MCP server** extensively for:
        - Step-by-step planning
        - Breaking down complex workflows
        - Dependency resolution
        - Optimal implementation ordering

7. **No Future TODOs**:

    - Do **not** defer tasks or add future "TODO" notes.
    - Every deliverable should be **fully implemented, functional, and production-ready**.

8. **Documentation**:

    - Provide **comprehensive documentation** for all code, including:
        - Code comments
        - README files
        - API documentation (if applicable)
    - Ensure documentation is clear, concise, and easy to follow.

9. **Hyperbrowser**:

    - Use **Hyperbrowser** for all web-related tasks, including:

        - Web scraping
        - Data extraction
        - API interactions

    - Ensure compliance with web scraping best practices and respect robots.txt.

10. **firecrawler**:
    - Use **firecrawler** for all web crawling tasks, including:
        - Data extraction
        - API interactions
    - Ensure compliance with web crawling best practices and respect robots.txt.
11. **Code Review**:
    - Perform **self-code reviews** before finalizing any code.
    - Ensure code is clean, efficient, and adheres to best practices.
12. **Testing**:
    - Implement **unit tests** and **integration tests** for all code.
    - Ensure all tests pass before finalizing any code.
    - Use modern testing frameworks and libraries.
13. **other**:

-   Always test the project at the end to ensure it doesn't contain errors.
-   Don't create placeholder code unless planning to expand on it later.
-   Code from A to Z rather than just small parts that don't fulfill the user's needs.
-   Don't duplicate code; build upon existing implementations.
- code should be as modular as possible
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        if (email) {
            const transporter = nodemailer.createTransport({
                host: "smtpout.secureserver.net",
                port: 465, // Use port 465 for secure connections (SSL/TLS)
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USERNAME,
                to: `${email},qrsayteam@gmail.com`,
                subject: subject,
                html: text,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Screenshot 2025-04-08 193727.png", "image/png"),
  ];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // TODO: Following code needs to be updated for client-side apps.
  const candidates = result.response.candidates;
  for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if(part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  console.log(result.response.text());
}

run();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // TODO: Following code needs to be updated for client-side apps.
  const candidates = result.response.candidates;
  for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if(part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  console.log(result.response.text());
}

run();