# LumaAI Frontend 📱

[![Frontend Status](https://img.shields.io/badge/frontend-active-green.svg)](https://localhost:3000)
[![Next.js](https://img.shields.io/badge/Next.js-13.x-blueviolet.svg)](https://nextjs.org)

Welcome to the frontend of the LumaAI Chat Application! This directory contains the client-side code built with Next.js, React, and TypeScript, integrated with Gemini AI and ImageKit.

## Table of Contents 📋

- [Overview](#overview)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview 🌐

The frontend provides a dynamic chat interface with AI-powered responses, image uploads, and user authentication. It’s designed for a seamless user experience across devices.

## Features ✨

- Real-time chat with Gemini AI.
- Image upload and thumbnail display via ImageKit.
- Animated transitions with Framer Motion.
- Clerk-based authentication.

## Directory Structure 📂

```

frontend/
├── app/ # Next.js pages and layouts
│ ├── (dashboard)/ # Dashboard-related pages
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/ # Reusable React components
│ ├── ChatList.tsx
│ ├── NewPrompt.tsx
│ ├── Upload.tsx
│ └── Navbar.tsx
├── lib/ # Utility modules
│ ├── gemini.ts
│ └── challenges.ts
├── public/ # Static assets
├── styles/ # Global CSS
├── README.md # This file
└── package.json # Frontend dependencies

```

## Installation 📥

1. **Navigate to Frontend**
   ```bash
   cd frontend
   ```

````

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Environment Variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your_endpoint
   NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Usage 🎮

- Run the development server:
  ```bash
  npm run dev
  ```
- Access at `http://localhost:3000`.

## Components 🛠️

- **Navbar**: Navigation bar with logo and auth options.
- **ChatList**: Sidebar for chat history.
- **NewPrompt**: Chat input and message handling.
- **Upload**: Image upload component with ImageKit.

## Environment Variables 🌱

- `NEXT_PUBLIC_GEMINI_API_KEY`: Gemini API key.
- `NEXT_PUBLIC_IMAGE_KIT_ENDPOINT`: ImageKit URL endpoint.
- `NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY`: ImageKit public key.
- `NEXT_PUBLIC_API_URL`: Backend API URL.

## Testing 🧪

- Open DevTools to monitor console logs.
- Test chat functionality at `/dashboard/chat/[chatId]`.
- Verify image uploads and API responses in Network tab.

## Contributing 🤝

- Fork the repo and create a branch.
- Submit PRs with clear descriptions.

## Troubleshooting 🔧

- **API Errors**: Check `NEXT_PUBLIC_API_URL` and backend status.
- **Image Issues**: Verify ImageKit environment variables.
- **Gemini Errors**: Ensure `NEXT_PUBLIC_GEMINI_API_KEY` is valid.

## License 📜

[MIT License](LICENSE)

---
````
