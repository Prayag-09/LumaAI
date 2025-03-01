'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IKImage } from 'imagekitio-react';
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

interface ImgState {
	isLoading: boolean;
	error: string;
	dbData: { filePath?: string };
	aiData: { inlineData?: { data: string; mimeType: string } };
}

const NewPrompt: React.FC<NewPromptProps> = ({ data }) => {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [img, setImg] = useState<ImgState>({
		isLoading: false,
		error: '',
		dbData: {},
		aiData: {},
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

	const mutation = useMutation<unknown, Error>({
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
			formRef.current?.reset();
			setQuestion('');
			setAnswer('');
			setImg({ isLoading: false, error: '', dbData: {}, aiData: {} });
		},
		onError: (err: Error) => {
			console.error('Mutation error:', err);
			setImg((prev) => ({
				...prev,
				error: `Failed to update chat: ${err.message}`,
			}));
		},
	});

	const add = useCallback(
		async (text: string, isInitial: boolean) => {
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
					setAnswer(accumulatedText);
				}
				console.log('Stream completed, accumulated text:', accumulatedText);

				mutation.mutate();
			} catch (err) {
				console.error('Error sending message:', err);
				setImg((prev) => ({
					...prev,
					error: 'Failed to process image or message',
				}));
			}
		},
		[img.aiData, chat, mutation, setQuestion]
	);

	useEffect(() => {
		if (
			!hasRun.current &&
			data?.history?.length === 1 &&
			data.history[0].parts[0]?.text?.trim()
		) {
			add(data.history[0].parts[0].text, true);
		}
		hasRun.current = true;
	}, [data, add]);

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
				<div className='p-3 rounded-lg font-bold bg-gray-800 text-white shadow-sm max-w-2xl mx-auto text-right mb-4'>
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
				<Upload setImg={setImg} />
				<input
					type='text'
					name='text'
					placeholder='Ask anything...'
					className='w-full p-4 pr-16 rounded-2xl bg-gray-950 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 text-base shadow-md hover:shadow-lg transition-shadow duration-200'
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
