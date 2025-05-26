/**
 * Inspired from `asciify-image` library.
 * Is the same as the `asciify` but with modern code and no dependencies.
 *
 * @see https://github.com/ajay-gandhi/asciify-image/
 */

import type Jimp from 'jimp-compact' // 1.3MB @see https://pkg-size.dev/jimp-compact

/**
 * Input of the image.
 */
export type Image2AsciiInput = Buffer
export type Image2AsciiOptions = {
	// /**
	//  * Defines if the output should be colored (`true`) or black and white (`false`).
	//  *
	//  * @default `true`
	//  */
	// color?   : boolean
	/**
	 * The fit to resize the image to:
	 * • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio.
	 * • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio.
	 * • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio.
	 * • `original` - Doesn't resize the image.
	 * • `none` - Scales the width and height to the specified values, ignoring original aspect ratio.
	 *
	 * @default `box`
	 */
	fit?         : 'box' | 'width' | 'height' | 'original' | 'none'
	/**
	 * The width to resize the image to. Use a percentage to set the image width to x% of the terminal window width.
	 *
	 * @default `100%`
	 */
	width?       : number | string
	/**
	 * The height to resize the image to. Use a percentage to set the image width to x% of the terminal window height.
	 *
	 * @default `100%`
	 */
	height?      : number | string
	/**
	 * Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height.
	 *
	 * You probably don't need to change this.
	 *
	 * @default `2`
	 */
	aspectRatio? : number
	/**
	 * The characters to use for the asciified image.
	 *
	 * @default ` .,:;i1tfLCG08@`
	 */
	chars?       : string
}

const getWindowSize = async (): Promise<{
	width  : number
	height : number
}> => {

	if ( typeof window !== 'undefined' && window.innerWidth && window.innerHeight ) {

		return {
			width  : window.innerWidth,
			height : window.innerHeight,
		}

	}
	const {
		platform, stdout,
	} = ( await import( 'node:process' ) )
	const terminalCharWidth = platform === 'win32' ? 0.714 : 0.5

	return {
		width  : ( stdout.columns || 80 ) * terminalCharWidth, // Ancho predeterminado en caso de no estar disponible
		height : stdout.rows || 24, // Alto predeterminado en caso de no estar disponible
	}

}

type CalculateDimsOpts = Required<Pick<Image2AsciiOptions, 'fit'>> & {
	width  : number
	height : number
}
const calculateDims = (
	img: Jimp,
	opts: CalculateDimsOpts,
): [number, number] => {

	if ( opts.fit === 'width' )
		return [ opts.width, img.bitmap.height * ( opts.width / img.bitmap.width ) ]
	else if ( opts.fit === 'height' )
		return [ img.bitmap.width * ( opts.height / img.bitmap.height ), opts.height ]
	else if ( opts.fit === 'none' ) return [ opts.width, opts.height ]
	else if ( opts.fit === 'box' ) {

		const wRatio = img.bitmap.width / opts.width
		const hRatio = img.bitmap.height / opts.height
		return wRatio > hRatio
			? [ opts.width, Math.round( img.bitmap.height / wRatio ) ]
			: [ Math.round( img.bitmap.width / hRatio ), opts.height ]

	}
	else {

		if ( opts.fit !== 'original' )
			console.error( 'Invalid option "fit", assuming "original"' )

		return [ img.bitmap.width, img.bitmap.height ]

	}

}

/**
 * Converts an image to an ASCII art string.
 *
 * @param   {Image2AsciiInput}   input  - The path to the image to convert or a Buffer containing the image data.
 * @param   {Image2AsciiOptions} [opts] - Optional options.
 * @returns {Promise<string>}           A promise that resolves with the ASCII art string.
 * @example
 * const input = 'https://raw.githubusercontent.com/pigeonposse/backan/main/docs/public/logo.png'
 * const ascii = await image2ascii( input, {
 *   fit         : 'width',
 *   width       : '100%',
 *   height      : '100%',
 *   chars       : ' #+@',
 * } )
 * console.log( ascii )
 */
export const image2ascii = async ( input: Image2AsciiInput, opts?: Image2AsciiOptions ): Promise<string> => {

	try {

		const Jimp  = ( await import( 'jimp-compact' ) ).default
		const image = await Jimp.read( input )

		const windowSize = await getWindowSize()

		const intensity = ( img: Jimp, x: number, y: number ): number => {

			const color = Jimp.intToRGBA( img.getPixelColor( x, y ) )
			return color.r + color.g + color.b + color.a

		}

		const validateWidth = ( width: number | string ): number => {

			if ( width && typeof width === 'string' && width.endsWith( '%' ) ) {

				width = Math.floor(
					( parseInt( width.slice( 0, -1 ) ) / 100 ) * ( windowSize.width ),
				)

			}

			return parseInt( String( width ) )

		}
		const validateHeight = ( height: number | string ): number => {

			if ( height && typeof height === 'string' && height.endsWith( '%' ) ) {

				height = Math.floor(
					( parseInt( height.slice( 0, -1 ) ) / 100 ) * ( windowSize.height ),
				)

			}

			return parseInt( String( height ) )

		}

		// Setup options
		const options = {
			fit         : opts?.fit ?? 'box',
			width       : opts?.width ? validateWidth( opts.width ) : validateWidth( '100%' ), //image.bitmap.width,
			height      : opts?.height ? validateHeight( opts.height ) : validateHeight( '100%' ), //image.bitmap.height,
			aspectRatio : opts?.aspectRatio ?? 2,
			asString    : true,
			chars       : opts?.chars ?? ' .,:;i1tfLCG08@',
		}
		// console.debug( options )

		const chars   = options.chars
		const numC    = chars.length - 1
		const newDims = calculateDims( image, options )

		// Resize to requested dimensions
		image.resize( newDims[0], newDims[1] )

		let ascii: string | string[] = options.asString ? '' : []

		const norm = ( 255 * 4 ) / numC

		// Get and convert pixels
		for ( let j = 0; j < image.bitmap.height; j++ ) {

			// Add new array if type
			// @ts-ignore
			if ( !options.asString ) ( ascii as string[] ).push( [] )

			for ( let i = 0; i < image.bitmap.width; i++ ) {

				for ( let c = 0; c < options.aspectRatio; c++ ) {

					const next = chars.charAt(
						Math.round( intensity( image, i, j ) / norm ),
					)

					if ( options.asString ) ascii += next
					// @ts-ignore
					else ascii[j].push( next )

				}

			}

			if ( options.asString && j !== image.bitmap.height - 1 )
				( ascii as string ) += '\n'

		}

		return ascii.toString()

	}
	catch ( err ) {

		throw new Error( `Error loading image: ${err}` )

	}

}

