'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Props interface
interface AuthLayoutProps {
	children: React.ReactNode;
}

// Optimized variants for animations
const backgroundVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
};

const containerVariants = {
	hidden: { opacity: 0, scale: 0.9, y: 30 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 },
	},
};

const contentVariants = {
	hidden: { opacity: 0, y: -15 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: 'easeOut', delay: 0.3 + i * 0.2 },
	}),
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className='relative flex min-h-screen items-center justify-center bg-black font-orbitron text-white px-4'>
			{/* Optimized Background */}
			<motion.div
				className='absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-purple-950/30'
				variants={backgroundVariants}
				initial='hidden'
				animate='visible'
				style={{ willChange: 'opacity' }} // Performance hint
			/>

			{/* Auth Container */}
			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				whileHover={{
					scale: 1.02,
					boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
				}}
				className='relative z-10 w-full max-w-md p-6 rounded-xl bg-gray-900/90 border border-gray-800 shadow-xl backdrop-blur-md text-gray-200'
				style={{ willChange: 'transform, opacity' }} // Performance optimization
			>
				{/* Neon Glow (Lightweight) */}
				<motion.div
					className='absolute inset-0 rounded-xl bg-purple-900/10 blur-lg pointer-events-none'
					animate={{ opacity: [0.4, 0.7, 0.4] }}
					transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
					style={{ willChange: 'opacity' }}
				/>

				{/* Content */}
				<AnimatePresence>
					<motion.div className='relative z-20'>
						{/* Header */}
						<motion.h2
							custom={0}
							variants={contentVariants}
							initial='hidden'
							animate='visible'
							className='text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300'
							style={{ textShadow: '0 0 8px rgba(147, 51, 234, 0.4)' }}>
							LumaAI
						</motion.h2>

						{/* Children (Auth Forms) */}
						<motion.div
							custom={1}
							variants={contentVariants}
							initial='hidden'
							animate='visible'
							className='mt-4'>
							{children}
						</motion.div>

						{/* Footer */}
						<motion.p
							custom={2}
							variants={contentVariants}
							initial='hidden'
							animate='visible'
							className='mt-4 text-xs text-gray-400 text-center'>
							Created by{' '}
							<a
								href='https://prayag-in.vercel.app/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-purple-300 hover:text-purple-200 transition-colors'>
								Prayag
							</a>
						</motion.p>
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
