import { Font } from '@ascii-kit/font'

/**
 * Fetches the specified font by name from unpkg.com.
 *
 * @param   {string}          name - The name of the font to fetch.
 * @returns {Promise<string>}      The text content of the font file.
 * @throws  {Error}           If the request fails or the response is not 200.
 * @see     https://unpkg.com/@ascii-kit/fonts-flf/dist/list.json
 */
const getFont = async ( name: string ) => {

	const res = await fetch( `https://unpkg.com/@ascii-kit/fonts-flf/dist/${name}.flf` )
	if ( !res.ok ) throw new Error( `Error getting file: ${res.statusText}` )
	return await res.text()

}

const font  = new Font( await getFont( '3d' ) )
const ascii = await font.text( 'Hello World!' )

console.log( ascii )
