/* eslint-disable camelcase */
import { defineConfig } from 'vite'
import { VitePWA }      from 'vite-plugin-pwa'

export default defineConfig( { plugins : [
	VitePWA( {
		registerType : 'autoUpdate',
		pwaAssets    : { image: 'public/logo.png' },
		manifest     : {
			theme_color      : '#44ba46',
			background_color : '#111',
			description      : 'Convert text, image or svg to ASCII art',
		},
	} ),
] } )
