import { Font } from '@ascii-kit/font'

const getAsciiString = async ( font: string, txt: string ) => {

	const res = await fetch( `https://unpkg.com/@ascii-kit/fonts-flf/dist/${font}.flf` )
	if ( !res.ok ) throw new Error( `Error getting file: ${res.statusText}` )
	const fontData     = await res.text()
	const fontInstance = new Font( fontData )
	const ascii        = await fontInstance.text( txt )

	return ascii

}

const ascii = await getAsciiString( '3d', 'Pigeon\nPosse' )

console.log( ascii )
