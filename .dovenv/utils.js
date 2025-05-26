/* eslint-disable default-case */

import {
	decompress,
	joinPath,
	writeFile,
} from '@dovenv/core/utils'

export const downloadGitHub = async ( {
	user, repo, branch = 'master', output,
} ) => {

	const res  = await fetch( `https://github.com/${user}/${repo}/archive/refs/heads/${branch}.zip` )
	const name = `${user}-${repo}-${branch}`

	const buffer  = await res.arrayBuffer()
	const zipPath = joinPath( output, `${name}.zip` )

	await writeFile( zipPath, Buffer.from( buffer ) )

	await decompress( {
		input   : zipPath,
		output,
		newName : name,
		format  : 'zip',
	} )

}

/**
 * @see https://www.npmjs.com/package/js-string-escape?activeTab=code
 */

export const stringScape = string => {

	return ( '' + string ).replace( /["'\\\n\r\u2028\u2029]/g, character => {

		// Escape all characters not included in SingleStringCharacters and
		// DoubleStringCharacters on
		// http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
		switch ( character ) {

			case '"' :
			case '\'' :
			case '\\' :
				return '\\' + character
				// Four possible LineTerminator characters need to be escaped:
			case '\n' :
				return '\\n'
			case '\r' :
				return '\\r'
			case '\u2028' :
				return '\\u2028'
			case '\u2029' :
				return '\\u2029'

		}

	} )

}

const digitsToWords = {
	0 : 'zero',
	1 : 'one',
	2 : 'two',
	3 : 'three',
	4 : 'four',
	5 : 'five',
	6 : 'six',
	7 : 'seven',
	8 : 'eight',
	9 : 'nine',
}

export const digitsToEnglish = input => {

	return input.replace( /\d/g, digit => digitsToWords[digit] )

}
