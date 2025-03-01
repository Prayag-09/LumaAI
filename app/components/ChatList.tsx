'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

// Animation variants
const sidebarVariants = {
	hidden: { opacity: 0, x: -25 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const listVariants = {
	hidden: { opacity: 0, y: 15 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: 'easeOut', delay: i * 0.06 },
	}),
	exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};

interface Chat {
	id: string; // Changed from _id to id to match Prisma default
	title: string;
}

const ChatList: React.FC = () => {
	const { isPending, error, data } = useQuery<Chat[]>({
		queryKey: ['userChats'],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/userchats`,
				{
					credentials: 'include',
				}
			);
			if (!res.ok) throw new Error('Failed to fetch chats');
			return res.json();
		},
		staleTime: 5 * 60 * 1000,
	});

	return (
		<motion.aside
			variants={sidebarVariants}
			initial='hidden'
			animate='visible'
			className='w-64 h-screen bg-black text-white font-orbitron border-r border-gray-950 flex flex-col pt-16 pb-4 px-4 fixed top-0 left-0 z-40 overflow-hidden'
			style={{ willChange: 'opacity, transform' }}>
			{/* Title */}
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
				className='text-lg font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-950'
				style={{ textShadow: '0 0 5px rgba(147, 51, 234, 0.2)' }}>
				Chat History
			</motion.h1>

			{/* Navigation Links */}
			<div className='flex flex-col space-y-3 mt-6 text-sm'>
				<Link
					href='/'
					className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-150'>
					<span className='text-purple-400'>↓</span> Explore
				</Link>
				<Link
					href='/dashboard'
					className='flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-150'>
					<span className='text-lg'>+</span> New Chat
				</Link>
			</div>

			{/* Chat History List */}
			<motion.div className='flex-1 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-950 scrollbar-track-black space-y-2 pr-1'>
				<AnimatePresence>
					{isPending ? (
						<motion.div
							key='loading'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='text-gray-400 text-sm text-center py-2'>
							Loading...
						</motion.div>
					) : error ? (
						<motion.div
							key='error'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='text-red-400 text-sm text-center py-2'>
							Error loading chats
						</motion.div>
					) : data && data.length > 0 ? (
						data.map((chat, index) => (
							<motion.div
								key={chat.id} // Use chat.id instead of chat._id
								custom={index}
								variants={listVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								whileHover={{ scale: 1.02, backgroundColor: '#0F172A' }}
								className='px-3 py-2 rounded-md bg-black text-sm text-white hover:text-gray-200 transition-colors duration-100 cursor-pointer'>
								<Link
									href={`/dashboard/chat/${chat.id}`}
									className='block truncate'>
									{chat.title}
								</Link>
							</motion.div>
						))
					) : (
						<motion.div
							key='empty'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='text-gray-400 text-sm text-center py-2'>
							No chats yet
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Upgrade to Pro Section */}
			<motion.div
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
				whileHover={{
					scale: 1.01,
					boxShadow: '0 0 10px rgba(147, 51, 234, 0.15)',
				}}
				className='mt-4 p-3 bg-gray-950 rounded-md text-center border border-gray-950'>
				<p className='text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-950'>
					Upgrade to Pro
				</p>
				<span className='text-xs text-gray-400 block mt-1'>
					Unlock limitless AI power
				</span>
				<Link
					href='/pro'
					className='block mt-2 px-4 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-md text-xs font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-150'>
					Go Pro
				</Link>
			</motion.div>
		</motion.aside>
	);
};

export default ChatList;
