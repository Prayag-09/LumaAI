'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';

const navbarVariants = {
	hidden: { opacity: 0, y: -50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const AnimatedLogo: React.FC = () => {
	return (
		<motion.svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 220 60'
			width='160'
			height='60'
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, ease: 'easeInOut' }}>
			<defs>
				<linearGradient id='darkGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
					<stop offset='0%' style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
					<stop
						offset='100%'
						style={{ stopColor: '#A1A1AA', stopOpacity: 1 }}
					/>
				</linearGradient>
				<filter id='neonGlow'>
					<feGaussianBlur stdDeviation='3' result='blur' />
					<feMerge>
						<feMergeNode in='blur' />
						<feMergeNode in='SourceGraphic' />
					</feMerge>
				</filter>
			</defs>

			<motion.circle
				cx='190'
				cy='30'
				r='20'
				fill='none'
				stroke='url(#darkGradient)'
				strokeWidth='1'
				filter='url(#neonGlow)'
				initial={{ opacity: 0 }}
				animate={{ opacity: [0.2, 0.5, 0.2] }}
				transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
			/>

			<motion.circle
				cx='190'
				cy='30'
				r='4'
				fill='#9333EA'
				filter='url(#neonGlow)'
				animate={{
					rotate: 360,
					transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
				}}
				style={{ transformOrigin: '190px 30px' }}
			/>

			<motion.text
				x='15'
				y='42'
				className='font-sourcecodepro'
				fontFamily='sans-serif'
				fontSize='34'
				fontWeight='600'
				fill='url(#darkGradient)'
				textAnchor='start'
				filter='url(#neonGlow)'
				initial={{ x: -40, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}>
				LumaAI
			</motion.text>
		</motion.svg>
	);
};

const Navbar: React.FC = () => {
	return (
		<motion.nav
			variants={navbarVariants}
			initial='hidden'
			animate='visible'
			className='fixed top-0 left-0 w-full z-50 bg-black backdrop-blur-md border-b border-gray-950 flex justify-between items-center px-6 py-4'
			style={{
				boxShadow: '0 4px 20px rgba(147, 51, 234, 0.1)',
				height: '64px',
			}}>
			<Link href='/' className='flex items-center'>
				<AnimatedLogo />
			</Link>

			<div className='flex items-center gap-8 font-bold text-xl font-sourcecodepro'>
				<SignedIn>
					<motion.div
						whileHover={{ scale: 1.1, y: -2 }}
						whileTap={{ scale: 0.95 }}
						className='relative group'>
						<Link href='/dashboard' className='relative'>
							<span className='text-white hover:text-purple-300 transition-colors duration-150'>
								Dashboard
							</span>
							<motion.span
								className='absolute bottom-[-4px] left-0 w-full h-0.5 bg-purple-300 rounded-full'
								initial={{ scaleX: 0 }}
								whileHover={{ scaleX: 1 }}
								transition={{ duration: 0.25, ease: 'easeInOut' }}
								style={{ transformOrigin: 'left' }}
							/>
						</Link>
					</motion.div>
				</SignedIn>

				<SignedOut>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='px-5 py-1.5 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-all duration-150 text-sm'>
						<SignInButton />
					</motion.div>
				</SignedOut>
				<SignedIn>
					<UserButton
						appearance={{
							elements: {
								userButtonAvatarBox:
									'w-8 h-8 border-2 border-gray-950 hover:border-purple-300 transition-all',
								userButtonPopoverCard:
									'bg-gray-950 text-white border border-gray-950',
							},
						}}
					/>
				</SignedIn>
			</div>
		</motion.nav>
	);
};

export default Navbar;
