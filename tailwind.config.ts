/** @type {import('tailwindcss').Config} \*/
import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000'
      },
      fontFamily: {
				aeonik: ['var(--font-aeonik)', 'Aeonik', ...defaultTheme.fontFamily.sans],
				mono: ['Aeonik Mono', ...defaultTheme.fontFamily.mono]
			},
    },
  },
  plugins: [],
}
export default config
