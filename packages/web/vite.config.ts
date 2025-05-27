/* eslint-disable camelcase */
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
	define : { PKG: pkg },
} )
