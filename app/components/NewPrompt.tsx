'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IKImage } from 'imagekitio-next';
import Markdown from 'react-markdown';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Upload from './Upload';
import model from '../lib/gemini';

interface ChatMessage {
	role: 'user' | 'model';
	parts: { text: string }[];
	img?: string;
}

interface NewPromptProps {
	data: {
		history: ChatMessage[];
		id: string;
	};
}

const NewPrompt: React.FC<NewPromptProps> = ({ data }) => {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [img, setImg] = useState({
		isLoading: false,
		error: '',
		dbData: {} as { filePath?: string },
		aiData: {} as { inlineData?: { data: string; mimeType: string } },
	});

	console.log('NewPrompt data received:', data);

	const chat = model.startChat({
		history: data?.history.map(({ role, parts }) => ({
			role,
			parts: [{ text: parts[0]?.text || '' }],
		})),
		generationConfig: {},
	});

	const endRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const queryClient = useQueryClient();
	const hasRun = useRef(false);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [question, answer, img.dbData]);

	const mutation = useMutation({
		mutationFn: async () => {
			if (!data.id) throw new Error('Chat ID is undefined');
			if (!question.trim() && !answer.trim()) {
				throw new Error('Question or answer required');
			}

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${data.id}`,
				{
					method: 'PUT',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						question: question.trim() || undefined,
						answer: answer.trim() || undefined,
						img: img.dbData?.filePath || undefined,
					}),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to update chat: ${response.status} - ${errorText}`
				);
			}

			return response.json();
		},
		onSuccess: (updatedData) => {
			console.log('Updated chat data:', updatedData);
			queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
			// Reset state only after the UI has had a chance to render
			formRef.current?.reset();
			setQuestion('');
			setAnswer(''); // Keep this to clear after rendering
			setImg({ isLoading: false, error: '', dbData: {}, aiData: {} });
		},
		onError: (err: any) => {
			console.error('Mutation error:', err);
			setImg((prev) => ({
				...prev,
				error: `Failed to update chat: ${err.message}`,
			}));
		},
	});

	const add = async (text: string, isInitial: boolean) => {
		console.log(
			'Add function called with text:',
			text,
			'isInitial:',
			isInitial
		);
		if (!text?.trim()) {
			console.warn('Empty or invalid text skipped:', text);
			return;
		}
		if (!isInitial) setQuestion(text);

		try {
			const requestContent = img.aiData?.inlineData
				? [{ inlineData: img.aiData.inlineData }, { text: text.trim() }]
				: [text.trim()];

			console.log('Sending message to Gemini with request:', requestContent);
			if (img.aiData?.inlineData) {
				console.log(
					'Image mimeType being sent:',
					img.aiData.inlineData.mimeType
				);
			}

			const result = await chat.sendMessageStream(requestContent);
			let accumulatedText = '';
			for await (const chunk of result.stream) {
				const chunkText = chunk.text();
				console.log('Stream chunk:', chunkText);
				accumulatedText += chunkText;
				setAnswer(accumulatedText); // Update answer incrementally for real-time display
			}
			console.log('Stream completed, accumulated text:', accumulatedText);

			// Trigger mutation after answer is fully set
			mutation.mutate();
		} catch (err) {
			console.error('Error sending message:', err);
			setImg((prev) => ({
				...prev,
				error: 'Failed to process image or message',
			}));
		}
	};

	useEffect(() => {
		if (
			!hasRun.current &&
			data?.history?.length === 1 &&
			data.history[0].parts[0]?.text?.trim()
		) {
			add(data.history[0].parts[0].text, true);
		}
		hasRun.current = true;
	}, [data]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('HandleSubmit triggered');
		const textInput = e.currentTarget.elements.namedItem(
			'text'
		) as HTMLInputElement;
		const text = textInput?.value;
		if (!text?.trim()) {
			console.log('No valid text input');
			return;
		}
		add(text, false);
	};

	return (
		<div className='w-full max-w-4xl mx-auto px-8'>
			{img.isLoading && (
				<div className='text-gray-400 text-center py-2'>Loading...</div>
			)}
			{img.error && (
				<div className='text-red-400 text-center py-2'>{img.error}</div>
			)}

			{img.dbData?.filePath && (
				<div className='relative inline-block w-[150px] h-[150px]'>
					<IKImage
						urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT || ''}
						path={img.dbData.filePath}
						width={150}
						height={150}
						transformation={[{ width: '150', height: '150' }]}
						className='rounded-md shadow-md mb-2 object-cover'
						alt='Uploaded Image'
					/>
				</div>
			)}

			{question && (
				<div className='p-3 rounded-lg bg-gray-800 text-white shadow-sm max-w-2xl mx-auto text-right mb-4'>
					<Markdown>{question}</Markdown>
				</div>
			)}

			{answer && (
				<div className='p-3 rounded-lg bg-gray-950/90 text-white shadow-sm max-w-2xl mx-auto mb-4'>
					<Markdown>{answer}</Markdown>
				</div>
			)}

			<div ref={endRef} />

			<form
				onSubmit={handleSubmit}
				ref={formRef}
				className='relative flex items-center mt-4'>
				<label htmlFor='file' className='mr-2 text-purple-400 cursor-pointer'>
					Upload Image
				</label>
				<Upload setImg={setImg} />
				<input
					type='text'
					name='text'
					placeholder='Ask anything...'
					className='w-full p-4 pr-16 rounded-2xl bg-gray-950 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 text-base shadow-md hover:shadow-lg transition-shadow duration-200 font-orbitron'
					disabled={mutation.isPending}
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<motion.button
					type='submit'
					disabled={!question.trim() || mutation.isPending}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className='absolute right-3 p-1 text-purple-400 disabled:text-gray-600'>
					<Send className='w-5 h-5' />
				</motion.button>
			</form>

			{mutation.isPending && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-gray-400 text-center text-sm mt-2 font-orbitron'>
					Sending...
				</motion.div>
			)}
		</div>
	);
};

export default NewPrompt;
