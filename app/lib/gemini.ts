import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
	console.error(
		'❌ Missing Gemini API Key. Set NEXT_PUBLIC_GEMINI_API_KEY in .env file.'
	);
	throw new Error('Missing Gemini API Key');
}

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
];

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
	model: 'gemini-2.0-flash',
	safetySettings,
});

export default model;
