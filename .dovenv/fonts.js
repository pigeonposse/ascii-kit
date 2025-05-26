import { defineConfig } from '@dovenv/core'
import {
	decompress,
	ensureDir,
	existsDir,
	getBaseName,
	getFileText,
	getPaths,
	joinPath,
	writeFile,
} from '@dovenv/core/utils'
import { generate } from 'astring'
import { Client }   from 'basic-ftp'

import {
	digitsToEnglish,
	downloadGitHub,
} from './utils.js'

export const fontsPlugin = defineConfig( { custom : { fonts : {
	desc : 'Generate font packages',
	fn   : async ( { utils } ) => {

		const FTP_HOST      = 'ftp.figlet.org'
		const FTP_PATH      = '/pub/figlet/fonts'
		const PACKAGES_PATH = joinPath( utils.wsDir, 'packages' )
		const FONT_PKG_PATH = joinPath( PACKAGES_PATH, 'fonts' )

		const FONT_DIST_ROUTE    = 'dist'
		const FONT_JS_ROUTE      = `${FONT_DIST_ROUTE}/index.js`
		const FONT_DTS_ROUTE     = `${FONT_DIST_ROUTE}/index.d.ts`
		const LIB_ID             = 'ascii-kit'
		const ALL_FONT_PKG_ID    = 'fonts'
		const TEMP_PATH          = joinPath( FONT_PKG_PATH, '.temp' )
		const COMPRESS_PATH      = joinPath( TEMP_PATH, 'compress' )
		const FONT_TEMP_PATH     = joinPath( TEMP_PATH, 'fonts' )
		const ALL_FONT_PATH      = joinPath( PACKAGES_PATH, 'fonts-all' )
		const ALL_FONT_DIST_PATH = joinPath( ALL_FONT_PATH, FONT_DIST_ROUTE )

		const VERSION = utils.config.const.corePkg.version
		if ( !VERSION ) throw new Error( 'Version not found' )
		const existsFonts = await existsDir( FONT_TEMP_PATH )

		if ( !existsFonts ) {

			console.log( 'Downloading fonts...' )
			const client = new Client()
			// client.ftp.verbose = true

			await ensureDir( TEMP_PATH )
			try {

				console.log( `🔗 Connecting to ${FTP_HOST}` )
				await client.access( {
					host     : FTP_HOST,
					user     : 'anonymous',
					password : 'guest',
					secure   : false,
				} )
				await client.cd( FTP_PATH )
				const fileList = await client.list()

				await ensureDir( COMPRESS_PATH )
				await ensureDir( FONT_TEMP_PATH )

				for ( const file of fileList ) {

					if ( !( file.isFile && file.name.endsWith( '.tar.gz' ) ) ) continue

					const FONT_PATH = joinPath( COMPRESS_PATH, file.name )
					await client.downloadTo( FONT_PATH, file.name )
					console.log( `✅ Downloaded: ${file.name}` )
					await decompress( {
						input   : FONT_PATH,
						output  : FONT_TEMP_PATH,
						newName : file.name.replace( '.tar.gz', '' ),
						format  : 'tgz',
					} )

					console.log( `✅ Decompressed: ${file.name}` )

				}

				client.close()

				await downloadGitHub( {
					user   : 'xero',
					repo   : 'figlet-fonts',
					branch : 'master',
					output : joinPath( FONT_TEMP_PATH ),
				} )

				console.log( '🎉 Finished downloading fonts. continue...\n' )

			}
			catch ( err ) {

				console.warn( 'Failed to download fonts: \n', err )
				client.close()
				return

			}

		}
		else console.log( '🎉 Fonts already downloaded. continue...\n' )

		const fonts = new Set()

		const getPKGname = name => `@${LIB_ID}/${name}`

		/** @type {import('@dovenv/core/utils').PackageJSON} */
		const pkgDataShared = {
			version  : VERSION,
			keywords : [
				'ascii',
				'dovenv',
				'font',
				'figfont',
				'pp',
				'pigeonposse',
				'ascii-kit',
				'theme',
			],
			homepage : `https://${LIB_ID}.pigeonposse.com`,
			bugs     : {
				url   : `https://github.com/pigeonposse/${LIB_ID}/issues`,
				email : 'dev@pigeonposse.com',
			},
			repository : {
				type : 'https',
				url  : `https://github.com/pigeonposse/${LIB_ID}/`,
			},
			funding : {
				type : 'individual',
				url  : 'https://pigeonposse.com/?popup=donate',
			},
			license : 'MIT',
			author  : {
				name  : 'Angelo',
				email : 'angelo@pigeonposse.com',
				url   : 'https://github.com/angelespejo',
			},
			type          : 'module',
			publishConfig : {
				access   : 'public',
				registry : 'https://registry.npmjs.org/',
			},
		}
		/** @type {import('@dovenv/core/utils').PackageJSON} */
		const ALL_FONT_PKG_DATA = {
			name        : getPKGname( ALL_FONT_PKG_ID ),
			description : `All in one Figfonts for be imported as a JS module`,
			exports     : { '.' : { import : {
				types   : './' + FONT_DTS_ROUTE,
				default : './' + FONT_JS_ROUTE,
			} } },
			main   : FONT_JS_ROUTE,
			module : FONT_JS_ROUTE,
			types  : FONT_DTS_ROUTE,
			files  : [ FONT_DIST_ROUTE ],
			...pkgDataShared,
		}

		const getFontID = sufix => 'font-' + sufix

		/**
		 * Get package data
		 *
		 * @param   {string}                                   name - package name
		 * @returns {import('@dovenv/core/utils').PackageJSON}      - Pkg
		 */
		const getPackageData = name => {

			return {
				name        : getPKGname( getFontID( name ) ),
				description : `Figfont "${name}" for be imported as a JS module`,
				exports     : { '.' : { import : {
					types   : './' + FONT_DTS_ROUTE,
					default : './' + FONT_JS_ROUTE,
				} } },
				main   : FONT_JS_ROUTE,
				module : FONT_JS_ROUTE,
				types  : FONT_DTS_ROUTE,
				files  : [ FONT_DIST_ROUTE ],
				...pkgDataShared,
			}

		}
		const getJScontent   = ( name, content ) => {

			const value = content
				.replace( /\\/g, '\\\\' ) // escape backslashes
				.replace( /`/g, '\\`' ) // escape backticks
				.replace( /\$/g, '\\$' ) // escape dollar signs (avoids `${`)
			// .replace( /\${/g, '\\${' ) // escape template interpolation
			// .replace( /\r/g, '\\r' ) // escapa retorno de carro
			// .replace( /\n/g, '\\n' ) // escapa salto de línea
				.replace( /\u2028/g, '\\u2028' ) // optional unicode line sep
				.replace( /\u2029/g, '\\u2029' )

			const code = generate( {
				type : 'Program',
				body : [
					{
						type        : 'ExportDefaultDeclaration',
						declaration : {
							type : 'Literal',
							value,
						},
					},
				],
				sourceType : 'module',
			} )

			if ( typeof code !== 'string' ) throw new Error( 'Generated code is not a string' )

			return {
				js  : code,
				dts : `/** FigFont "${name}" data */\ndeclare const font: string\nexport default font`,
			}

		}
		const getReadmeData = fontName => {

			const importedName = digitsToEnglish( fontName.replaceAll( '-', '_' ) )
			return `# ${fontName} - Figfont \n\nThis package contains figfont data for the font **${fontName}**. \n\n## Example usage \n\n\`\`\`js\nimport ${importedName} from '${getPKGname( fontName )}'\nimport {Font} from '@${LIB_ID}/font'\n\nconst font = new Font( ${importedName} )\nconsole.log( await font.text( 'Hello World!' )\n\`\`\``

		}

		const toJson   = d => JSON.stringify( d, null, '\t' )
		const flfFiles = await getPaths( joinPath( FONT_TEMP_PATH, '**/*.flf' ) )
		console.log( 'Flf files found: ', flfFiles.length )

		console.log( 'Generating font packages...\n' )

		await ensureDir( ALL_FONT_DIST_PATH )

		await Promise.all( flfFiles.map( async file => {

			const filename    = getBaseName( file )
			const fontNamePre = filename.replace( '.flf', '' ).replaceAll( ' ', '--' ).toLowerCase()

			if ( fonts.has( fontNamePre ) ) return

			const fontName  = fontNamePre //(  file.includes( 'xero' ) ? 'xero-' : '' ) + fontNamePre
			const FONT_PATH = joinPath( FONT_PKG_PATH, fontName )
			const content   = getJScontent( fontName, await getFileText( file ) )
			const pkgData   = getPackageData( fontName )

			await ensureDir( joinPath( FONT_PATH, FONT_DIST_ROUTE ) )

			await writeFile( joinPath( FONT_PATH, FONT_JS_ROUTE ), content.js, 'utf8' )
			await writeFile( joinPath( FONT_PATH, FONT_DTS_ROUTE ), content.dts, 'utf8' )
			await writeFile( joinPath( FONT_PATH, 'package.json' ), toJson( pkgData ), 'utf8' )
			await writeFile( joinPath( FONT_PATH, 'README.md' ), getReadmeData( getFontID( fontName ) ), 'utf8' )
			await writeFile( joinPath( ALL_FONT_DIST_PATH, fontName + '.js' ), content.js, 'utf8' )
			await writeFile( joinPath( ALL_FONT_DIST_PATH, fontName + '.d.ts' ), content.dts, 'utf8' )

			fonts.add( fontName )
			// console.log( `✅ Generated font package: ${fontName}\n  - PATH: ${FONT_PATH}` )

		} ) )

		const fontsArray  = [ ...fonts ]
		const fontsString = toJson( fontsArray )
		const typeDef     = `/** List of figfonts names */\ndeclare const fonts: ${fontsString};\nexport default fonts;\n`
		await writeFile( joinPath( ALL_FONT_PATH, 'README.md' ), `# All in one FigFonts`, 'utf8' )
		await writeFile( joinPath( ALL_FONT_PATH, 'package.json' ), toJson( ALL_FONT_PKG_DATA ), 'utf8' )
		await writeFile( joinPath( ALL_FONT_DIST_PATH, 'list.json' ), fontsString, 'utf8' )
		await writeFile( joinPath( ALL_FONT_DIST_PATH, 'index.js' ), `export default ${fontsString}\n`, 'utf8' )
		await writeFile( joinPath( ALL_FONT_PATH, FONT_DIST_ROUTE, 'index.d.ts' ), typeDef, 'utf8' )
		// console.log( `✅ Generated font package: ${ALL_FONT_PKG_ID}\n  - PATH: ${ALL_FONT_PATH}\n` )

		console.log( `🎉 Finished generating font packages.\n\n  - PATH: ${FONT_PKG_PATH}\n  - PACKAGES: ${fonts.size}` )

		// await removeDirIfExist( TEMP_PATH )

	},
} } } )
