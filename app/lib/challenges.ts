export const challenges = {
	project: 'Chat Application',
	description:
		'This is a Next.js-based chat application integrated with Google Generative AI (Gemini) and ImageKit for image uploads. Below is a log of issues encountered during development and how they were resolved.',
	issues_and_fixes: [
		{
			issue_number: 1,
			title: 'Unable to Test API Through Postman',
			issue:
				'When testing the `/api/chats` endpoint with Postman, it returned `{ "message": "Server is running" }` instead of creating a chat, due to hitting the root route instead of the POST endpoint.',
			fix: "Adjusted the Express server middleware order in `index.ts` to prioritize `app.use('/api', chatRoutes)` before the debug route, ensuring POST requests reached the correct handler. Added authentication with a Clerk JWT in Postman headers.",
		},
		{
			issue_number: 2,
			title: '404 Error on PUT Request in NewPrompt',
			issue:
				'A `PUT http://localhost:5000/api/chats/undefined 404 (Not Found)` error occurred because `data._id` was undefined in `NewPrompt.tsx`.',
			fix: 'Changed `data._id` to `data.id` in `NewPromptProps` to match the Prisma schema, added a validation check for `data.id`, and enhanced error feedback with an alert.',
		},
		{
			issue_number: 3,
			title: 'Unable to Send Messages on /dashboard/chat/[chatId]',
			issue: 'Messages couldn’t be sent, possibly due to state or form issues.',
			fix: 'Ensured controlled input with `value={question}` and `onChange`, added debugging logs, and confirmed `handleSubmit` triggered `add` correctly. Adjusted navigation and ID handling.',
		},
		{
			issue_number: 4,
			title: 'Context Provider Error with IKContext',
			issue:
				'`hook.js:608 The value prop is required for the <Context.Provider>` error occurred in `Upload.tsx`, indicating a misconfiguration.',
			fix: 'Unified imports to `imagekitio-next`, added fallback environment variables, and ensured `IKContext` was correctly configured with `urlEndpoint`, `publicKey`, and `authenticator`. Updated to the latest `imagekitio-next` version.',
		},
		{
			issue_number: 5,
			title: 'Public Key Undefined Error',
			issue:
				"`Uncaught TypeError: Cannot read properties of undefined (reading 'publicKey')` despite logging, due to missing environment variables.",
			fix: 'Added strict checks in `Upload.tsx` to throw an error if `NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY` or `NEXT_PUBLIC_IMAGE_KIT_ENDPOINT` was missing, and updated `.env` with correct values.',
		},
		{
			issue_number: 6,
			title: 'Empty Text Parameter Error with Gemini API',
			issue:
				'A 400 Bad Request error from Gemini API (`Unable to submit request because it has an empty text parameter`) occurred, even with valid input.',
			fix: "Strengthened text validation in `add` to skip empty strings, adjusted `sendMessageStream` to use `{ role: 'user', parts: [{ text: text.trim() }] }` format, and added detailed logging to trace the request. Updated the Gemini model to `gemini-1.5-flash` via `lib/gemini.ts`.",
		},
		{
			issue_number: 7,
			title: 'Image Size Too Large',
			issue: 'Uploaded images filled too much space in the chat.',
			fix: 'Reduced `IKImage` width to `"150"` and added `max-w-[150px] max-h-[150px] object-cover` to the className in `NewPrompt.tsx` for a thumbnail-like display.',
		},
	],
	setup_instructions: [
		{
			step_number: 1,
			description: 'Install Dependencies',
			details:
				'Run `npm install` to install all required packages. Ensure `@google/generative-ai`, `imagekitio-next`, and `lucide-react` are included.',
		},
		{
			step_number: 2,
			description: 'Configure Environment Variables',
			details:
				'Create a `.env` file with: \n```\nNEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key\nNEXT_PUBLIC_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your_endpoint\nNEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY=your_public_key\nNEXT_PUBLIC_API_URL=http://localhost:5000\nIMAGE_KIT_PRIVATE_KEY=your_private_key\n```',
		},
		{
			step_number: 3,
			description: 'Backend Setup',
			details:
				'Update `utils/imagekit.ts` with ImageKit credentials. Ensure `routes/upload.routes.ts` returns `{ signature, expire, token }` for authentication. Run the backend server with `node index.ts` or your start script.',
		},
		{
			step_number: 4,
			description: 'Frontend Setup',
			details:
				'Create `lib/gemini.ts` with the provided model configuration. Update `components/NewPrompt.tsx`, `components/Upload.tsx`, and other files as provided. Run `npm run dev` to start the frontend.',
		},
		{
			step_number: 5,
			description: 'Testing',
			details:
				'Navigate to `/dashboard`, create a chat, and go to `/dashboard/chat/[chatId]`. Send a message, upload an image, and check the console for logs. Verify network requests in DevTools for successful PUT and upload responses.',
		},
	],
	notes: [
		{
			description: 'Debugging',
			details:
				'Use console logs to trace issues. Share logs if problems persist.',
		},
		{
			description: 'API',
			details:
				'Ensure `/api/chats/[id]` PUT and `/api/upload` endpoints work as expected.',
		},
		{
			description: 'Version',
			details:
				'Keep dependencies updated, especially `imagekitio-next` and `@google/generative-ai`.',
		},
	],
};
