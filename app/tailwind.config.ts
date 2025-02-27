/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				roboto: ['var(--font-roboto)', 'sans-serif'],
				orbitron: ['var(--font-orbitron)', 'sans-serif'],
				srcpro: ['var(--font-sourcecodepro)', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
