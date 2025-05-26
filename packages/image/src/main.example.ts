import { image2ascii } from './main'

const _fetchImage = async ( url: string ) => {

	try {

		const response = await fetch( url )

		const buffer = Buffer.from( await response.arrayBuffer() )

		return buffer

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error fetching ghaphic from URL: ${error.message}` )

	}

}
const input = await _fetchImage( 'https://raw.githubusercontent.com/pigeonposse/backan/main/docs/public/logo.png' )
console.log( await image2ascii( input, {
	fit   : 'width',
	chars : ' #+@',

} ) )
