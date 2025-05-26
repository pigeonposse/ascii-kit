import figlet from './core'
import {
	FontMeta,
	Options,
} from './types'

/**
 * Represents a font that can be used to generate ASCII art.
 *
 * @example
 * import font1row from '@ascci-art/font-1row'
 * import { Font } from '@ascii-art/core'
 *
 * const font = new Font( font1row )
 * console.log( await font.text( 'Boo!' ) )
 */
export class Font {

	#name = 'Standard'
	#instance : typeof figlet

	constructor( font: string ) {

		this.#instance = figlet
		this.#instance.parseFont( this.#name, font )

	}

	/**
	 * Gets the metadata for the font.
	 *
	 * @returns {Promise<FontMeta>} An object containing the metadata:
	 *                              - `fig`: The font's layout data.
	 *                              - `options`: The default options for the font.
	 *                              - `numChars`: The number of characters in the font.
	 *                              - `comment`: The font's comment.
	 */
	async metadata(): Promise<FontMeta> {

		const {
			options, comment, numChars, ...rest
			// @ts-ignore
		} = this.#instance.figFonts[this.#name]

		return {
			fig : rest,
			options,
			numChars,
			comment,
		}

	}

	/**
	 * Generate a string of ASCII art from the given text, using the
	 * font that this class was constructed with.
	 *
	 * @param   {string}          text      - The text to generate ASCII art from.
	 * @param   {Options}         [options] - Options to pass to the underlying
	 *                                      `figlet.text` method.
	 * @returns {Promise<string>}           A promise that resolves with the
	 *                                      generated ASCII art.
	 */
	async text( text: string, options?: Options ): Promise<string> {

		return await this.#instance.text( text, {
			...options || {},
			font : this.#name,
		} )

	}

}
