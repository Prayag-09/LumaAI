'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ChatList from '@/components/ChatList';
import { motion } from 'framer-motion';
import { MessageCircle, Image, Code, Brain, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DashboardPage: React.FC = () => {
	const { userId, isLoaded } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [prompt, setPrompt] = useState<string>('');

	useEffect(() => {
		if (isLoaded && !userId) {
			router.push('/sign-in');
		}
	}, [isLoaded, userId, router]);

	const mutation = useMutation({
		mutationFn: (text: string) =>
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					history: [{ role: 'user', parts: [{ text }] }],
				}),
			}).then((res) => {
				if (!res.ok) throw new Error('Failed to create chat');
				return res.json();
			}),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['userChats'] });
			router.push(`/dashboard/chat/${data.id}`);
			setPrompt('');
		},
		onError: (error) => {
			console.error('Error creating chat:', error);
			alert('Failed to create chat. Please try again.');
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = prompt.trim();
		if (!text) return;
		mutation.mutate(text);
	};

	const featureList = useMemo(
		() => [
			{ icon: MessageCircle, label: 'Chat', desc: 'Talk to AI agents' },
			{ icon: Image, label: 'Images', desc: 'Upload or generate visuals' },
			{ icon: Code, label: 'Code', desc: 'Code with AI assistance' },
			{ icon: Brain, label: 'AI Tools', desc: 'Explore advanced features' },
		],
		[]
	);

	if (!isLoaded) {
		return (
			<div className='flex h-screen w-screen items-center justify-center bg-black text-gray-400 font-orbitron'>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className='text-lg'>
					Loading...
				</motion.div>
			</div>
		);
	}

	return (
		<div className='flex h-screen w-screen bg-black text-white font-orbitron overflow-hidden'>
			<ChatList />
			<motion.main
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
				className='flex-1 flex flex-col items-center justify-between bg-black py-6 px-4 sm:px-8 min-w-0 overflow-hidden'>
				{/* Features Section */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.15 }}
					className='flex flex-wrap justify-center gap-6 mt-12 sm:mt-16 max-w-5xl w-full px-4 sm:px-0'>
					{featureList.map((item, index) => (
						<motion.div
							key={item.label}
							className='flex flex-col items-center text-center p-4 rounded-md bg-gray-950 border border-gray-900 hover:bg-gray-900 transition-all duration-150 w-32 sm:w-36 shadow-sm'
							whileHover={{
								scale: 1.05,
								boxShadow: '0 0 10px rgba(147, 51, 234, 0.2)',
							}}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25, delay: 0.2 + index * 0.1 }}>
							<item.icon className='w-8 sm:w-9 h-8 sm:h-9 text-purple-400 mb-2 sm:mb-3' />
							<p className='text-base sm:text-lg font-semibold'>{item.label}</p>
							<p className='text-xs sm:text-sm text-gray-400 mt-1'>
								{item.desc}
							</p>
						</motion.div>
					))}
				</motion.div>

				{/* Input Box */}
				<motion.div
					className='w-full max-w-[90%] sm:max-w-3xl flex justify-center'
					initial={{ y: 0 }}
					animate={prompt.length > 0 ? { y: 40 } : { y: 0 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}>
					<form
						onSubmit={handleSubmit}
						className='relative flex items-center w-full'>
						<input
							type='text'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder='Ask LumaAI anything...'
							className='w-full p-3 sm:p-4 pr-14 sm:pr-16 rounded-md bg-gray-950 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-base transition-all duration-150'
							disabled={mutation.isPending}
						/>
						<motion.button
							type='submit'
							disabled={!prompt.trim() || mutation.isPending}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className='absolute right-3 sm:right-4 p-1 text-purple-400 disabled:text-gray-600'>
							<Send className='w-5 h-5' />
						</motion.button>
					</form>
					{mutation.isPending && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='absolute left-0 right-0 text-center text-sm text-gray-400 mt-2'>
							Creating chat...
						</motion.div>
					)}
				</motion.div>

				{/* Spacing for Bottom */}
				<div className='h-16 sm:h-24' />
			</motion.main>
		</div>
	);
};

export default DashboardPage;
