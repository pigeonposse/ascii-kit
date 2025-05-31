import { defineConfig } from '@dovenv/core'
import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
	TYPE,
	getSidebar,
} from '@dovenv/theme-pigeonposse'

import { fontsPlugin } from './fonts.js'

const emojis =  {
	'font'      : '📝',
	'fonts'     : '📂',
	'fonts-all' : '🖌️',
	'fonts-flf' : '🖊️',
	'svg'       : '📐',
	'image'     : '🖼️',
	'qr'        : '📱',
	'tree'      : '🌲',
}

TYPE.fonts    = 'fonts'
const website = 'https://ascii-kit.pigeonposse.com'
export default defineConfig(
	pigeonposseMonorepoTheme( {
		core : await getWorkspaceConfig( {
			metaURL  : import.meta.url,
			path     : '../',
			corePath : './packages/core',
		} ),
		docs : async utils => {

			const sidebar = await getSidebar( {
				utils,
				opts : { emojis },
			} )
			return {
				css : `
				.vp-doc p:has(>img) { 
					display: flex;
					flex-direction: row;
					gap: 10px;
				} 
				.edit-info { display: none !important; }
				`.split( '\n' ).map( line => line.trim() ).join( '\n' ),
				styles : { color: { secondary: 'var(--pp-brand-1)' } },
				nav    : [
					{
						text : 'Website',
						link : website,
					},
				],
				vitepress : {
					ignoreDeadLinks : true,
					metaChunk       : true,
				},
				sidebar : {
					'/guide/'       : sidebar,
					'/todo/'        : sidebar,
					'/contributors' : sidebar,
				},
				llms        : { mdFiles: false },
				twoslash    : false,
				autoSidebar : {
					intro     : false,
					reference : false,
				},
			}

		},
		predocs : async instance => {

			if ( !instance.opts ) instance.opts = {}
			instance.opts.emoji = {
				...instance.opts?.emoji,
				...emojis,
			}

			// console.log( instance.template.readmePkg )
			await instance.run( { index : {
				noFeatures : true,
				custom     : {
					hero : { actions : [
						{
							theme : 'alt',
							text  : 'Website',
							link  : website,
						},
					] },
					features : [
						{
							title   : 'Get started',
							icon    : '🏁',
							details : 'Start your project now',
							link    : '/guide',
						},
						{
							title   : 'Library (aio)',
							icon    : '📚',
							details : 'Check the documentation',
							link    : '/guide/core',
						},
						{
							title   : 'Font',
							icon    : emojis.font,
							details : 'Check the documentation',
							link    : '/guide/font',
						},
						{
							title   : 'Image',
							icon    : emojis.image,
							details : 'Check the documentation',
							link    : '/guide/image',
						},
						{
							title   : 'SVG',
							icon    : emojis.svg,
							details : 'Check the documentation',
							link    : '/guide/svg',
						},
						{
							title   : 'QR',
							icon    : emojis.qr,
							details : 'Check the documentation',
							link    : '/guide/qr',
						},
					],
				},
			} } )

		},
	} ),
	fontsPlugin,
)

