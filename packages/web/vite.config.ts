/* eslint-disable camelcase */
import { image2ascii } from '@ascii-kit/image'
import {
	defineConfig,
	Plugin,
} from 'vite'
import ogPlugin    from 'vite-plugin-open-graph'
import { VitePWA } from 'vite-plugin-pwa'

import { version } from './package.json'
import pkg         from '../../package.json'

const title               = 'ASCII Kit | Convert text, image or svg to ASCII art'
const description         = 'Convert text, image or svg to ASCII art'
const lang                = 'es'
const transformHtmlPlugin = ( data: Record<string, string> ): Plugin => ( {
	name               : 'transform-html',
	transformIndexHtml : {
		order : 'pre',
		handler( html: string ) {

			return html.replace(
				/<%=\s*(\w+)\s*%>/gi,
				( _match, p1 ) => data[p1] || '',
			)

		},
	},
} )
const dedentString        = ( value: string ): string => {

	const lines = value.split( '\n' )

	// 1. Find the minimum leading whitespace across all non-empty lines
	let minIndent = Infinity

	for ( const line of lines ) {

		// Skip lines that are completely empty or contain only whitespace for indent calculation
		if ( line.trim().length === 0 ) continue
		// Match leading whitespace characters from the start of the line
		const leadingSpacesMatch = line.match( /^\s*/ )
		// Get the length of the matched leading whitespace; default to 0 if none
		const currentIndent = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0
		// Update minIndent if a smaller indentation is found
		minIndent = Math.min( minIndent, currentIndent )

	}

	// If all lines were empty or no content, ensure minIndent is 0
	if ( minIndent === Infinity ) minIndent = 0

	// 2. Remove that minimum amount of leading whitespace from each line
	const processedValue = lines.map( line => {

		// If the line is empty or just whitespace, return an empty string to remove it.
		// If you wanted to preserve blank lines with their original spaces, you'd return 'line' here.
		if ( line.trim().length === 0 ) return ''
		// Remove the calculated minIndent from the beginning of the line
		return line.substring( minIndent )

	} ).join( '\n' ) // Join the processed lines back into a single string

	return processedValue

}
const ascciLogo = async () => {

	const res            = await fetch( 'https://github.com/pigeonposse.png?size=72' )
	const input          = await res.arrayBuffer()
	const value          = await image2ascii( input, { chars: ' -.@' } )
	const processedValue = value.split( '\n' )
		.filter( line => line.trim() !== '' ) // Filter out lines that become empty after trimming
		.join( '\n' )
	return dedentString( processedValue ) + '\n\nMade with ❤️ by PigeonPosse\n\nhttps://pigeonposse.com'

}

export default defineConfig( {
	plugins : [
		VitePWA( {
			registerType : 'autoUpdate',
			pwaAssets    : { image: 'public/logo.png' },
			manifest     : {
				theme_color      : '#44ba46',
				background_color : '#111',
				description,

			},
		} ),
		ogPlugin( {
			basic : {
				image  : '/logo.png',
				locale : lang,
				url    : pkg.homepage,
				title,
				description,
				type   : 'website',
			},

			twitter : {
				site    : pkg.extra.collective.socialUser.twitter,
				title,
				creator : pkg.extra.collective.socialUser.twitter,
				card    : 'summary_large_image',
			},
		} ),
		transformHtmlPlugin( {
			VERSION : version,
			LANG    : lang,
			TITLE   : title,
			DESC    : description,
		} ),
	],
	define : {
		PKG        : pkg,
		LOGO_ASCII : JSON.stringify( await ascciLogo() ),
	},
} )
