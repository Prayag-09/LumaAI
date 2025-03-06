# LumaAI Backend 🖥️

[![Backend Status](https://img.shields.io/badge/backend-active-green.svg)](http://localhost:5000)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-orange.svg)](https://expressjs.com)

Welcome to the backend of the LumaAI Chat Application! This directory contains the server-side code built with Node.js, Express, and Prisma, supporting chat and image upload functionalities.

## Table of Contents 📋

- [Overview](#overview)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview 🌐

The backend handles chat data management, API routing, and ImageKit authentication, providing a robust foundation for the LumaAI frontend.

## Features ✨

- RESTful API for chat creation and updates.
- ImageKit authentication for secure uploads.
- Prisma integration for database operations.
- Clerk authentication middleware.

## Directory Structure 📂

```

backend/
├── routes/ # API route handlers
│ ├── chat.routes.ts
│ ├── upload.routes.ts
├── utils/ # Utility modules
│ ├── imagekit.ts
├── index.ts # Main server file
├── middleware/ # Custom middleware
├── README.md # This file
└── package.json # Backend dependencies

```

## Installation 📥

1. **Navigate to Backend**
   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Environment Variables**
   Create a `.env` file with:
   ```env
   IMAGE_KIT_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   DATABASE_URL=your_postgres_url
   ```

## Usage 🎮

- Start the server:
  ```bash
  node index.ts
  ```
- Access at `http://localhost:5000`.

## API Endpoints 📡

- **POST /api/chats**
  - Creates a new chat.
  - **Request**: `{ history: [...] }`
  - **Response**: `{ id, userId, history, ... }`
- **GET /api/chats/:id**
  - Fetches a chat.
  - **Response**: `{ id, userId, history, ... }`
- **PUT /api/chats/:id**
  - Updates a chat.
  - **Request**: `{ question, answer, img }`
  - **Response**: Updated chat
- **POST /api/uploads**
  - Authenticates ImageKit uploads.
  - **Response**: `{ signature, expire, token }`

## Environment Variables 🌱

- `IMAGE_KIT_PRIVATE_KEY`: ImageKit private key.
- `NEXT_PUBLIC_API_URL`: API base URL.
- `CLIENT_URL`: Frontend origin for CORS.
- `DATABASE_URL`: Prisma database connection string.

## Testing 🧪

- Use Postman to test endpoints (e.g., `POST /api/chats`).
- Check server logs for errors.
- Verify ImageKit authentication.

## Contributing 🤝

- Fork the repo and create a branch.
- Submit PRs with clear descriptions.

## Troubleshooting 🔧

- **Server Not Starting**: Check `DATABASE_URL` and Node.js version.
- **API Errors**: Ensure Clerk JWT is valid.
- **Image Upload Failures**: Verify ImageKit credentials.
````
