import homepage from '..html/index.html'

Bun.serve( {
	routes : { '/': homepage },
	fetch( _req ) {

		return new Response( 'Not Found', { status: 404 } )

	},
	port : 3000,
} )

console.log( 'Listening on http://localhost:3000' )
