/** @type {import('tailwindcss').Config} \*/
import type {Config} from 'tailwindcss';

const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,tsx,jsx}'],

	theme: {
		extend: {
			colors: {
				primary: '#FFFFFF',
				secondary: '#000000',
				accent: '#FFD915',
				background: '#000000',
				'background-modal': '#131313',
				fail: '#E53200',
				success: '#00A66F'
			},
			fontFamily: {
				aeonik: ['var(--font-aeonik)', 'Aeonik', ...defaultTheme.fontFamily.sans],
				mono: ['Aeonik Mono', ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: []
};
export default config;
