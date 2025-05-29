import { styleText } from 'node:util'

import {
	tree,
	Tree,
} from './main'

const treeApi = new Tree( {
	shared : { '...': null },
	core   : {
		'index.js' : null,
		'utils.js' : null,
	},
} )
const treeSrc = new Tree( { src : {
	components : {
		'Button.js' : null,
		'Header.js' : null,
	},
	utils : { 'helpers.js': null },
	api   : treeApi,
} } )

const result = tree( treeSrc.content, { hook : { onData : data => {

	data.name    = styleText( data.isFile ? 'green' : 'blue', data.name.replace( '.js', '.ts' ) )
	data.pattern = {
		indent   : styleText( 'dim', data.pattern.indent ),
		line     : styleText( 'dim', data.pattern.line ),
		lastLine : styleText( 'dim', data.pattern.lastLine ),
	}
	return data

} } } )
console.log( treeSrc.generate(), '\n\n' )
console.log( result )
