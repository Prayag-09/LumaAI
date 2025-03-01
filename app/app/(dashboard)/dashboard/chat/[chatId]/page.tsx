'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
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
	role: 'user' | 'model';
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

	console.log('ChatPage fetched data:', data);
	console.log(
		'History with images:',
		data?.history.map((msg) => ({ role: msg.role, img: msg.img }))
	); // Debug: Check image presence

	return (
		<div className='flex h-screen bg-black text-white overflow-hidden font-inter'>
			<ChatList />
			<motion.main
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='flex-1 flex flex-col bg-black py-6 px-4 relative min-w-0 overflow-x-hidden'>
				<div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-950 scrollbar-track-black max-w-4xl mx-auto w-full'>
					{isPending ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-2'>
							Loading...
						</motion.div>
					) : error ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-red-400 text-center py-2'>
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
								className='mb-3 flex justify-between items-start w-full'>
								<div
									className={`flex flex-col ${
										message.role === 'user'
											? 'items-end justify-end'
											: 'items-start justify-start'
									} w-full max-w-[calc(100%-20px)]`}>
									{message.img && (
										<div className='relative mb-2'>
											<IKImage
												urlEndpoint={
													process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT ?? ''
												}
												path={message.img}
												width={300} // Increased from 150 to 300
												transformation={[{ width: '300' }]} // Updated transformation
												loading='lazy'
												lqip={{ active: true, quality: 20 }}
												className='rounded-md shadow-md object-cover max-w-[300px] max-h-[300px] block' // Increased max dimensions
												alt='Uploaded Image'
											/>
										</div>
									)}
									<div
										className={`p-2 rounded-md bg-gray-950/90 border border-gray-900 text-white shadow-sm ${
											message.role === 'user'
												? 'bg-gray-800 text-right font-semibold'
												: 'font-medium'
										} text-sm md:text-base leading-relaxed max-w-[70%] break-words`}>
										<Markdown>{message.parts[0]?.text ?? ''}</Markdown>
									</div>
								</div>
							</motion.div>
						))
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-2'>
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
