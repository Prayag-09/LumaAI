'use client';

import { GoogleGeminiEffectDemo } from '@/components/GeminiDemo';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const emojiSequences: string[] = [
	'🚀 Unleashing AI-Powered Futures...',
	'🤖 Crafting Smarter Conversations...',
	'⚡ Boosting Efficiency with AI...',
	'💡 Igniting Creativity through Tech...',
	'🌐 Connecting Minds Globally...',
	'🔍 Unlocking Deeper Insights...',
];


const TypingAnimation: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
			whileHover={{
				scale: 1.02,
				boxShadow: '0 0 12px rgba(147, 51, 234, 0.5)',
			}}
			className='flex items-center gap-3 px-6 py-3 bg-black/70 backdrop-blur-lg border border-gray-800 rounded-full shadow-lg'>
			<TypeAnimation
				sequence={emojiSequences.flatMap((seq) => [seq, 1500])}
				wrapper='span'
				speed={50}
				preRenderFirstString={true}
				style={{
					fontSize: '1.25em',
					fontWeight: '600',
					fontFamily: 'Orbitron, sans-serif',
					color: '#FFFFFF',
					textShadow: '0 0 10px rgba(147, 51, 234, 0.6)',
					display: 'inline-block',
				}}
				repeat={Infinity}
			/>
			{/* Animated Indicator Dot */}
			<motion.span
				className='w-2 h-2 bg-purple-500 rounded-full'
				animate={{ opacity: [0.3, 1, 0.3] }}
				transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
			/>
		</motion.div>
	);
};

export default function Home() {
	return (
		<div className='relative w-full h-screen bg-black text-white'>
			<div>
				<GoogleGeminiEffectDemo />
			</div>

			<motion.div
				className='fixed top-32 right-8 z-20'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 1 }}>
				<TypingAnimation />
			</motion.div>
		</div>
	);
}
