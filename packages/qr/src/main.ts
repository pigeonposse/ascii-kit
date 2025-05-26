import qrcodeTerminal from 'qrcode-terminal'

import type { QRcodeOpts } from './types'

/**
 * Export types that can be used from outside.
 *
 */
export { QRcodeOpts }

/**
 * Generates a QR code string.
 *
 * @param   {string}          input        - The input string to generate the QR code from.
 * @param   {QRcodeOpts}      [opts]       - Optional options for generating the QR code.
 * @param   {boolean}         [opts.small] - Indicates whether to generate a small QR code. Default is false.
 * @returns {Promise<string>}              - A promise that resolves with the generated QR code string.
 * @example
 * try {
 *   const qrString = await qrcode('https://dovenv.pigeonposse.com');
 *   console.log(qrString);
 * } catch (error) {
 *   console.error('Error generating QR code:', error);
 * }
 */
export const qrcode = async ( input: string, opts?: QRcodeOpts ): Promise<string> => {

	return new Promise<string>( resolve => {

		qrcodeTerminal.generate( input, opts, qr => resolve( qr ) )

	} )

}

