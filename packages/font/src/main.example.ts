import { Font } from './main'

const fonts = ( await import( '../../fonts-all/dist/index.js' ) ).default

type Fonts = typeof fonts[number]

const setFont = async ( name: Fonts ) =>
	await ( new Font( ( await import( '../../fonts/' + name + '/dist/index.js' ) ).default ) )

const names: Fonts[] = [
	'3d',
	'3-d',
	'basic',
	'runic',
	'doh',
	'banner3-d',
	'broadway',
	'eftirobot',
	'fraktur',
	'isometric1',
	'jerusalem',
	'acrobatic',
	'def--leppard',

]

await Promise.all( names.map( async name => {

	const f = await setFont( name )
	console.log( await f.text( 'Hello!' ) )

} ) )

// console.log( await setFont( 'banner', 'HELLO!' ) )

export const checkBrokenFonts = async () => {

	const fontsBroken : Set<string> = new Set()

	await Promise.all( fonts.map( async font => {

		try {

			const f = await setFont( font )
			await f.text( 'Hello!' )

		}
		catch ( _e ) {

			fontsBroken.add( font )

		}

	} ) )
	console.log( {
		all         : fonts.length,
		broken      : fontsBroken.size,
		brokenFonts : [ ...fontsBroken ],
	} )

}

// checkBrokenFonts()
