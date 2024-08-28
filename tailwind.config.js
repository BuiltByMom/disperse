/** @type {import('tailwindcss').Config} \*/

const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

const config = {
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
				success: '#00A66F',
				warning: '#FF9900'
			},
			fontFamily: {
				aeonik: ['var(--font-aeonik)', 'Aeonik', ...defaultTheme.fontFamily.sans],
				mono: ['Aeonik Mono', ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-animate'),
		plugin(function ({addUtilities}) {
			addUtilities({
				'.scrollbar-none': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				}
			});
		})
	]
};
export default config;
