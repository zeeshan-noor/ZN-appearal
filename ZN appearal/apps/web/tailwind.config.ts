import type { Config } from 'tailwindcss';

export default {
	content: [
		'./app/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#b30019',
					light: '#e11d2d',
					dark: '#7a0011',
				},
			},
		},
	},
	plugins: [],
} satisfies Config;



