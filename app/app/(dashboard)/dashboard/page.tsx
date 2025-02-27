'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatList from '@/components/ChatList';
import { motion } from 'framer-motion';
import { MessageCircle, Image, Code, Brain, Send } from 'lucide-react';

// Animation variants
const containerVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const featureVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.15 } },
};

const inputVariants = {
	center: { top: '50%', y: '-50%' },
	down: { top: '80%', y: '-50%' }, // Slightly lower for better UX
};

const DashboardPage: React.FC = () => {
	const { userId, isLoaded } = useAuth();
	const router = useRouter();
	const [prompt, setPrompt] = useState<string>('');

	// Redirect if not authenticated
	useEffect(() => {
		if (isLoaded && !userId) {
			router.push('/sign-in');
		}
	}, [isLoaded, userId, router]);

	// Handle prompt submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Prompt submitted:', prompt); // Replace with API call
		setPrompt('');
	};

	// Memoized feature list
	const featureList = useMemo(
		() => [
			{ icon: MessageCircle, label: 'Chat', desc: 'Talk to AI agents' },
			{ icon: Image, label: 'Images', desc: 'Upload or generate visuals' },
			{ icon: Code, label: 'Code', desc: 'Code with AI assistance' },
			{ icon: Brain, label: 'AI Tools', desc: 'Explore advanced features' },
		],
		[]
	);

	// Loading state
	if (!isLoaded) {
		return (
			<div className='flex h-screen items-center justify-center bg-black text-gray-300 font-orbitron'>
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
		<div className='flex h-screen bg-black text-white font-orbitron overflow-hidden'>
			{/* Sidebar */}
			<ChatList />

			{/* Main Content */}
			<motion.main
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='flex-1 flex flex-col items-center justify-between bg-black py-6 px-8 relative min-w-0'>
				{/* Feature Icons */}
				<motion.div
					variants={featureVariants}
					initial='hidden'
					animate='visible'
					className='flex flex-wrap justify-center gap-8 mt-16 max-w-5xl'>
					{featureList.map((item, index) => (
						<motion.div
							key={item.label}
							className='flex flex-col items-center text-center p-4 rounded-lg bg-gray-950/90 border border-gray-950 hover:bg-gray-950 transition-all duration-200 w-36 shadow-sm'
							whileHover={{
								scale: 1.05,
								boxShadow: '0 0 12px rgba(147, 51, 234, 0.25)',
							}}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25, delay: 0.2 + index * 0.1 }}>
							<item.icon className='w-9 h-9 text-purple-400 mb-3' />
							<p className='text-sm font-semibold text-white'>{item.label}</p>
							<p className='text-xs text-gray-400 mt-1'>{item.desc}</p>
						</motion.div>
					))}
				</motion.div>

				{/* Typing Section */}
				<motion.div
					className='w-full max-w-4xl items-center'
					variants={inputVariants}
					initial='center'
					animate={prompt.length > 0 ? 'down' : 'center'}
					transition={{ duration: 0.3, ease: 'easeOut' }}
					style={{
						transform: 'translateX(-50%)',
						zIndex: 10,
					}}>
					<form onSubmit={handleSubmit} className='relative flex items-center'>
						<input
							type='text'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder='Ask LumaAI anything...'
							className='w-full p-4 pr-16 rounded-2xl bg-gray-950 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 text-sm shadow-md hover:shadow-lg transition-shadow duration-200'
						/>
						<motion.button
							type='submit'
							disabled={!prompt.trim()}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className='absolute right-3 p-1 text-purple-400 disabled:text-gray-600'>
							<Send className='w-5 h-5' />
						</motion.button>
					</form>
				</motion.div>

				{/* Spacer */}
				<div className='h-28' />
			</motion.main>
		</div>
	);
};

export default DashboardPage;
