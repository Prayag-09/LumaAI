'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-next';
import ChatList from '@/components/ChatList';
import NewPrompt from '@/components/NewPrompt';
import { useParams } from 'next/navigation';

const containerVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const messageVariants = {
	hidden: { opacity: 0, y: 15 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, delay: i * 0.1 },
	}),
};

interface ChatMessage {
	role: 'user' | 'assistant';
	parts: { text: string }[];
	img?: string;
}

interface ChatData {
	history: ChatMessage[];
	id: string;
}

const ChatPage: React.FC = () => {
	const params = useParams();
	const chatId = params?.chatId as string;

	const { isPending, error, data } = useQuery<ChatData>({
		queryKey: ['chat', chatId],
		queryFn: () =>
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
				credentials: 'include',
			}).then((res) => {
				if (!res.ok) throw new Error('Failed to fetch chat');
				return res.json();
			}),
		enabled: !!chatId,
	});

	console.log('ChatPage fetched data:', data); // Debug the full response

	return (
		<div className='flex h-screen bg-black text-white font-orbitron overflow-hidden'>
			<ChatList />
			<motion.main
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='flex-1 flex flex-col bg-black py-6 px-8 relative min-w-0'>
				<div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-950 scrollbar-track-black'>
					{isPending ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-4'>
							Loading...
						</motion.div>
					) : error ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-red-400 text-center py-4'>
							Something went wrong: {error.message}
						</motion.div>
					) : data?.history?.length > 0 ? (
						data.history.map((message, i) => (
							<motion.div
								key={i}
								variants={messageVariants}
								initial='hidden'
								animate='visible'
								custom={i}
								className='mb-4'>
								{message.img && (
									<div className='relative inline-block w-[400px] h-[300px]'>
										<IKImage
											urlEndpoint={
												process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT || ''
											}
											path={message.img}
											width={400}
											height={300}
											transformation={[{ width: '400', height: '300' }]}
											loading='lazy'
											lqip={{ active: true, quality: 20 }}
											className='rounded-md shadow-md mb-2 object-cover'
											alt='Uploaded Image'
										/>
									</div>
								)}
								<div
									className={`p-3 rounded-lg bg-gray-950/90 border border-gray-950 text-white shadow-sm max-w-2xl mx-auto ${
										message.role === 'user' ? 'bg-gray-800 text-right' : ''
									}`}>
									<Markdown>{message.parts[0]?.text || ''}</Markdown>
								</div>
							</motion.div>
						))
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-4'>
							No messages yet
						</motion.div>
					)}
				</div>
				{data && (
					<div className='mt-4'>
						<NewPrompt data={data} />
					</div>
				)}
			</motion.main>
		</div>
	);
};

export default ChatPage;
