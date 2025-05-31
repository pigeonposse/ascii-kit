import { Font } from '@ascii-kit/font'

const getAsciiString = async ( font: string, txt: string ) => {

	// const fontModule = await import( `https://cdn.jsdelivr.net/npm/@ascii-kit/fonts/dist/${name}.js` )
	const fontModule = await import( `https://cdn.jsdelivr.net/npm/@ascii-kit/font-${font}/+esm` )
	const fontData   = fontModule.default

	const fontInstance = new Font( fontData )
	const ascii        = await fontInstance.text( txt )

	return ascii

}
const ascii = await getAsciiString( '3d', 'Hello World!' )
console.log( ascii )
