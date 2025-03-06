# LumaAI Chat Application 🎉

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-green.svg)](https://github.com/yourusername/lumaai-chat/actions)
[![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)](https://www.npmjs.com/)
[![Contributors](https://img.shields.io/badge/contributors-1-orange.svg)](https://github.com/yourusername/lumaai-chat/graphs/contributors)

Welcome to **LumaAI**, a cutting-edge Next.js-based chat application powered by Google Generative AI (Gemini) and ImageKit for seamless image uploads. This project showcases a dynamic, interactive chat experience with robust backend support, designed for developers and AI enthusiasts alike. 🚀


## Demo Video


https://github.com/user-attachments/assets/c2f84999-bfe9-448b-b370-3adc2db7f43c


## Table of Contents 📋

- [Project Overview](#project-overview)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Frontend Details](#frontend-details)
- [Backend Details](#backend-details)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Project Overview 🌐

LumaAI is an innovative chat application that leverages the power of Gemini AI for natural language processing and ImageKit for efficient image handling. Built with Next.js, it offers a modern, responsive interface with real-time chat capabilities and secure authentication via Clerk.

## Features ✨

- Real-time chat with AI-powered responses using Gemini.
- Image upload and display with ImageKit integration.
- User authentication with Clerk.
- Responsive design for desktop and mobile.
- Animated UI elements with Framer Motion.
- Detailed logging for debugging and development.

## Directory Structure 📂

```

LumaAI/
├── frontend/   # Next.js-based frontend
│   ├── app/    # Application pages
│   ├── components/  # Reusable UI components
│   ├── lib/    # Utility functions
│   ├── README.md  # Frontend details
│   ├── package.json
├── backend/    # Express + Prisma backend
│   ├── routes/  # API endpoints
│   ├── utils/   # Helper functions
│   ├── index.ts # Main server file
│   ├── README.md  # Backend details
│   ├── package.json
├── .env   # Environment variables
├── README.md  # This file
├── package.json # Project metadata
├── LICENSE  # MIT license
```

## Getting Started 🚀

### Prerequisites 🛠️

- Node.js (v18.x or later)
- npm or yarn
- Git
- An ImageKit account for image uploads
- A Google Cloud API key for Gemini
- A Clerk account for authentication

### Installation 📥

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Prayag-09/LumaAI.git
   cd LumaAI
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your_endpoint
   NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   IMAGE_KIT_PRIVATE_KEY=your_private_key
   ```

3. **Install Dependencies**

   - For frontend: `cd frontend && npm install`
   - For backend: `cd backend && npm install`

4. **Start the Application**

   - Backend: `cd backend && node index.ts` or use your start script
   - Frontend: `cd frontend && npm run dev`

5. **Access the App**
   Open `http://localhost:3000` in your browser.

## Usage 🎮

- Navigate to `/dashboard` to start a new chat.
- Use `/dashboard/chat/[chatId]` to view or continue a specific chat.
- Upload images and interact with the AI-powered chat interface.

## API Documentation 📚

### Endpoints

- **POST /api/chats**
  - Creates a new chat.
  - **Body**: `{ history: [{ role: 'user', parts: [{ text: 'Hello' }] }] }`
  - **Response**: `{ id, userId, history, createdAt, updatedAt }`
  - **Auth**: Requires Clerk JWT
- **GET /api/chats/:id**
  - Fetches a specific chat.
  - **Response**: `{ id, userId, history, createdAt, updatedAt }`
- **PUT /api/chats/:id**
  - Updates a chat with new messages or images.
  - **Body**: `{ question, answer, img }`
  - **Response**: Updated chat object
- **POST /api/uploads**
  - Authenticates ImageKit uploads.
  - **Response**: `{ signature, expire, token }`

## Frontend Details 🌐

- **Location**: `app/`
- **Tech Stack**: Next.js, React, TypeScript
- **Key Files**:
  - `app/(dashboard)/dashboard/page.tsx` - Dashboard entry
  - `app/(dashboard)/dashboard/chat/[chatId]/page.tsx` - Chat interface
  - `components/NewPrompt.tsx` - Chat input component
  - `components/Upload.tsx` - Image upload component
- **README**: See `frontend/README.md` for detailed setup.

## Backend Details 🖥️

- **Location**: `server/`
- **Tech Stack**: Node.js, Express, Prisma
- **Key Files**:
  - `index.ts` - Main server file
  - `routes/chat.routes.ts` - Chat API routes
  - `routes/upload.routes.ts` - ImageKit authentication
  - `utils/imagekit.ts` - ImageKit configuration
- **README**: See `backend/README.md` for detailed setup.

## Contributing 🤝

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-feature`.
3. Commit changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Open a Pull Request.

## Troubleshooting 🔧

- **Messages Not Sending**: Check console logs for `text` value and API response status. Verify `NEXT_PUBLIC_GEMINI_API_KEY`.
- **Images Missing**: Ensure `NEXT_PUBLIC_IMAGE_KIT_ENDPOINT` and backend `/api/upload` are configured.
- **404 Errors**: Confirm `NEXT_PUBLIC_API_URL` matches the backend server.

## License 📜

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments 🙌

- Google for the Generative AI SDK.
- ImageKit for image upload services.
- Clerk for authentication solutions.
- The open-source community for inspiration.

## Contact 📧

- **Author**: [T Prayag] (prayagtushar2016@gmail.com)
- **GitHub**: [yourusername/lumaai-chat](https://github.com/Prayag-09)
- **Issues**: Report bugs or suggestions [here](https://github.com/Prayag-09/LumaAI/issues).
