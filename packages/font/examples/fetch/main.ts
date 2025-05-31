import { Font } from '@ascii-kit/font'

/**
 * Fetches the specified font by name from cdn.jsdelivr.net.
 *
 * @param   {string}          name - The name of the font to fetch.
 * @returns {Promise<string>}      The text content of the font file.
 * @throws  {Error}           If the request fails or the response is not 200.
 * @see     https://cdn.jsdelivr.net/npm/@ascii-kit/fonts-all/dist/list.json
 */
const getFont = async ( name: string ) => {

	// const fontModule = await import( `https://cdn.jsdelivr.net/npm/@ascii-kit/fonts/dist/${name}.js` )
	const fontModule = await import( `https://cdn.jsdelivr.net/npm/@ascii-kit/font-${name}/+esm` )

	return fontModule.default

}

const font  = new Font( await getFont( '3d' ) )
const ascii = await font.text( 'Hello World!' )

console.log( ascii )
