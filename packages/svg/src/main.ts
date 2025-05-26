import {
	image2ascii,
	Image2AsciiOptions,
} from '@ascii-kit/image'
import {
	Resvg,
	ResvgRenderOptions,
} from '@resvg/resvg-js'

const svg2png = ( input: string, opts?: ResvgRenderOptions ) => {

	const resvg     = new Resvg( input, {
		fitTo : {
			mode  : 'width',
			value : 200,
		},
		...opts || {},
	} )
	const pngBuffer = resvg.render().asPng()
	return pngBuffer

}
type Svg2AsciiOptions = { svg?: ResvgRenderOptions } & Image2AsciiOptions

/**
 * Converts a SVG string to an ASCII art string.
 *
 * @param   {string}           input  - The SVG string to convert.
 * @param   {Svg2AsciiOptions} [opts] - Optional options.
 * @returns {Promise<string>}         A promise that resolves with the ASCII art string.
 * @example
 * const input = `
 * <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
 *   <circle cx="100" cy="100" r="50" fill="#FF0000"/>
 * </svg>
 * `
 * const ascii = await svg2ascii( input )
 * console.log( ascii )
 */
export const svg2ascii = async ( input: string, opts?: Svg2AsciiOptions ): Promise<string> => {

	return await image2ascii( svg2png( input, opts?.svg ), opts )

}
