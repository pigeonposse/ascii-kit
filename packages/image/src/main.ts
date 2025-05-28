/**
 * Inspired from `asciify-image` library.
 * Is the same as the `asciify` but with modern code and no dependencies.
 *
 * @see https://github.com/ajay-gandhi/asciify-image/
 */

import {
	Jimp,
	intToRGBA,
} from 'jimp'

/**
 * Input of the image.
 */
export type Image2AsciiInput = ArrayBuffer | Buffer
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
	/**
	 * The container options for the asciified image.
	 *
	 */
	container?: {
		width?  : number
		height? : number
	}
}

type ImageBitmap = {
	height : number
	width  : number
}
type CalculateDimsOpts = Required<Pick<Image2AsciiOptions, 'fit'>> & {
	width  : number
	height : number
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
	} = globalThis.process
	const terminalCharWidth = platform === 'win32' ? 0.714 : 0.5

	return {
		width  : ( stdout.columns || 80 ) * terminalCharWidth, // Ancho predeterminado en caso de no estar disponible
		height : stdout.rows || 24, // Alto predeterminado en caso de no estar disponible
	}

}

const calculateDims = (
	imgBitmap: {
		height : number
		width  : number
	},
	opts: CalculateDimsOpts,
): [number, number] => {

	if ( opts.fit === 'width' )
		return [ opts.width, imgBitmap.height * ( opts.width / imgBitmap.width ) ]
	else if ( opts.fit === 'height' )
		return [ imgBitmap.width * ( opts.height / imgBitmap.height ), opts.height ]
	else if ( opts.fit === 'none' ) return [ opts.width, opts.height ]
	else if ( opts.fit === 'box' ) {

		const wRatio = imgBitmap.width / opts.width
		const hRatio = imgBitmap.height / opts.height
		return wRatio > hRatio
			? [ opts.width, Math.round( imgBitmap.height / wRatio ) ]
			: [ Math.round( imgBitmap.width / hRatio ), opts.height ]

	}
	else {

		if ( opts.fit !== 'original' )
			throw new Error( 'Invalid option "fit", assuming "original"' )

		return [ imgBitmap.width, imgBitmap.height ]

	}

}

const validateWidth = ( width: number | string, windowWidth: number ): number => {

	if ( width && typeof width === 'string' && width.endsWith( '%' ) ) {

		width = Math.floor(
			( parseInt( width.slice( 0, -1 ) ) / 100 ) * ( windowWidth ),
		)

	}

	return parseInt( String( width ) )

}
const validateHeight = ( height: number | string, windowHeight: number ): number => {

	if ( height && typeof height === 'string' && height.endsWith( '%' ) ) {

		height = Math.floor(
			( parseInt( height.slice( 0, -1 ) ) / 100 ) * ( windowHeight ),
		)

	}

	return parseInt( String( height ) )

}

/**
 * Converts an image to an ASCII art string.
 *
 * @param   {Image2AsciiInput}   input  - The path to the image to convert or a Buffer containing the image data.
 * @param   {Image2AsciiOptions} [opts] - Optional options.
 * @returns {Promise<string>}           A promise that resolves with the ASCII art string.
 * @example
 * const res = await fetch(
 *   'https://raw.githubusercontent.com/pigeonposse/backan/main/docs/public/logo.png'
 * );
 * const input = await res.arrayBuffer();
 * const ascii = await image2ascii( input, {
 *   fit         : 'width',
 *   width       : '100%',
 *   height      : '100%',
 *   chars       : ' #+@',
 * } )
 *
 * console.log( ascii )
 */
export const image2ascii = async ( input: Image2AsciiInput, opts?: Image2AsciiOptions ): Promise<string> => {

	try {

		const windowSize = await getWindowSize()

		// Setup options
		const options = {
			// If opts?.aspectRatio is null or undefined, it will use 2. Otherwise, it will use the provided value (including 0, false, or an empty string).
			aspectRatio : opts?.aspectRatio ?? 2,
			width       : validateWidth( opts?.width ?? '100%', opts?.container?.width ?? windowSize.width ),
			height      : validateHeight( opts?.height ?? '100%', opts?.container?.height ?? windowSize.height ),
			fit         : opts?.fit || 'box',
			chars       : opts?.chars || ' .,:;i1tfLCG08@',
		}

		const image = await Jimp.read( input )

		const numC = options.chars.length - 1

		const newDims = calculateDims( image.bitmap, options )

		const intensity = ( img: Awaited<ReturnType<typeof Jimp['read']>>, x: number, y: number ): number => {

			const pixels = img.getPixelColor( x, y )
			const color  = intToRGBA( pixels )

			return color.r + color.g + color.b + color.a

		}

		// Resize to requested dimensions
		image.resize( {
			w : newDims[0],
			h : newDims[1],
		} )

		let asciiString: string = '' // Initialize as an empty string

		const norm                     = ( 255 * 4 ) / numC
		const imageBitmap: ImageBitmap = image.bitmap

		// Get and convert pixels
		for ( let j = 0; j < imageBitmap.height; j++ ) {

			for ( let i = 0; i < imageBitmap.width; i++ ) {

				for ( let c = 0; c < options.aspectRatio; c++ ) {

					const next   = options.chars.charAt(
						Math.round( intensity( image, i, j ) / norm ),
					)
					asciiString += next

				}

			}
			// Add newline for all but the last row
			if ( j !== imageBitmap.height - 1 ) asciiString += '\n'

		}

		return asciiString // Directly return the string

	}
	catch ( err ) {

		throw new Error( `Error transforming image: ${err instanceof Error ? err.message : 'Unknown error'}` )

	}

}

