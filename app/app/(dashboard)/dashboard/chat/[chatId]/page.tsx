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
		transition: { duration: 0.25, delay: i * 0.05 },
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

	return (
		<div className='flex h-screen bg-black text-white font-inter'>
			<ChatList />

			<motion.main
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='flex flex-col flex-1 h-screen bg-black py-6 px-4 relative min-w-0'>
				{/* Chat Messages Container */}
				<div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-black px-4 max-w-4xl mx-auto w-full'>
					{isPending && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-6'>
							Loading...
						</motion.div>
					)}

					{error && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-red-400 text-center py-6'>
							Error: {error.message}
						</motion.div>
					)}

					{data?.history?.length ?? 0 > 0 ? (
						data?.history.map((message, i) => (
							<motion.div
								key={i}
								variants={messageVariants}
								initial='hidden'
								animate='visible'
								custom={i}
								className='mb-4 flex w-full'>
								<div
									className={`flex flex-col ${
										message.role === 'user' ? 'items-end' : 'items-start'
									} w-full`}>
									{/* Image Message Handling */}
									{message.img && (
										<IKImage
											urlEndpoint={
												process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT ?? ''
											}
											path={message.img}
											width={300}
											transformation={[{ width: '300' }]}
											loading='lazy'
											lqip={{ active: true, quality: 20 }}
											className='rounded-md shadow-md object-cover max-w-[250px] max-h-[250px] mb-2'
											alt='Uploaded Image'
										/>
									)}

									{/* Text Message Bubble */}
									<div
										className={`p-3 rounded-lg border border-gray-900 text-white shadow-md ${
											message.role === 'user'
												? 'bg-gray-800 text-right'
												: 'bg-gray-950 text-left'
										} text-sm md:text-base max-w-[85%] md:max-w-[70%] break-words`}>
										<Markdown>{message.parts[0]?.text ?? ''}</Markdown>
									</div>
								</div>
							</motion.div>
						))
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-gray-400 text-center py-6'>
							No messages yet
						</motion.div>
					)}
				</div>

				{/* Input Field - Fixed at Bottom */}
				{data && (
					<div className='sticky bottom-0 w-full bg-black px-4 pb-4 max-w-4xl mx-auto'>
						<NewPrompt data={data} />
					</div>
				)}
			</motion.main>
		</div>
	);
};

export default ChatPage;
