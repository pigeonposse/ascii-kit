import homepage from './index.html'

Bun.serve( {
	routes : {
		'/'      : homepage,
		'/fonts' : { GET : async () => {

			const response = await fetch( 'https://unpkg.com/@ascii-kit/fonts/dist/list.json' )
			const data     = await response.json()
			return Response.json( data )

		} },
	},
	fetch( req ) {

		const url = new URL( req.url )
		console.log( url.pathname )

		return new Response( 'Not Found', { status: 404 } )

	},
} )
