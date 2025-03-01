'use client';

import React from 'react';
import { Roboto, Orbitron, Source_Code_Pro } from 'next/font/google';
// import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Navbar';
import { neobrutalism } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-roboto',
});

const orbitron = Orbitron({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-orbitron',
});

const sourceCodePro = Source_Code_Pro({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-sourcecodepro',
});

// Metadata for SEO and branding
// export const metadata: Metadata = {
// 	title: 'LumaAI - The Future of AI',
// 	description: 'Experience the power of AI-driven interactions with LumaAI.',
// 	icons: {
// 		icon: '/favicon.ico', // Ensure this file exists in /public
// 	},
// 	openGraph: {
// 		title: 'LumaAI - The Future of AI',
// 		description: 'Explore AI-powered chat and dashboards with LumaAI.',
// 		url: 'https://lumaai.com', // Replace with your actual domain
// 		siteName: 'LumaAI',
// 		images: [
// 			{
// 				url: 'https://lumaai.com/og-image.jpg', // Add an OG image in /public
// 				width: 1200,
// 				height: 630,
// 				alt: 'LumaAI Preview Image',
// 			},
// 		],
// 		type: 'website',
// 	},
// };

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			afterMultiSessionSingleSignOutUrl='/'
			appearance={{
				baseTheme: neobrutalism,
			}}>
			<QueryClientProvider client={queryClient}>
				<html
					lang='en'
					className={`${roboto.variable} ${orbitron.variable} ${sourceCodePro.variable}`}>
					<body className='bg-black text-white min-h-screen flex flex-col'>

						<div className='fixed top-0 left-0 w-full z-50'>
							<Navbar />
						</div>

						<main className='flex-1 pt-16'>{children}</main>
					</body>
				</html>
			</QueryClientProvider>
		</ClerkProvider>
	);
}
