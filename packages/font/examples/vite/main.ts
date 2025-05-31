import { Font }         from '@ascii-kit/font'
import { defineConfig } from 'vite'

const getFont = async ( font: string, txt: string ) => {

	const res = await fetch( `https://unpkg.com/@ascii-kit/fonts-flf/dist/${font}.flf` )
	if ( !res.ok ) throw new Error( `Error getting file: ${res.statusText}` )
	const fontData = await res.text()

	const fontInstance = new Font( fontData )
	return await fontInstance.text( txt )

}

export default defineConfig( { define : {
	TITLE_ASCII_ANSI_SHADOW : JSON.stringify( await getFont( 'ansi--shadow', 'Pigeon\nPosse' ) ),
	TITLE_ASCII_3D          : JSON.stringify( await getFont( '3d', 'Pigeon\nPosse' ) ),
} } )

