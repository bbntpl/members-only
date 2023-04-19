/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./views/**/*.{html,js,ejs}',
		'./public/css/*.css',
	],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundColor: {
				'primary': '#1A237E',
				'secondary': '#283593',
				'accent': '#536DFE',
				'light': '#E8EAF6',
				'dark': '#0D1B2A',
			},
			textColor: {
				'primary': '#1A237E',
				'secondary': '#283593',
				'accent': '#536DFE',
				'light': '#E8EAF6',
				'dark': '#0D1B2A',
			},
			fontFamily: {
				'sans': ['Roboto', 'sans-serif'],
				'headings': ['Montserrat', 'sans-serif'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		backgroundColor: {
			css: {
				variable: true,
			},
		},
		textColor: {
			css: {
				variable: true,
			},
		},
	},
}