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
	// async fetch( req ) {

	// 	const url = new URL( req.url )

	// 	// Manejar petición para el JSON con proxy CORS
	// 	if ( url.pathname === '/fonts' ) {

	// 		// Hace fetch al recurso original en unpkg
	// 		const response = await fetch( 'https://unpkg.com/@ascii-kit/fonts/dist/list.json' )
	// 		// const data     = await response.json()

	// 		return response

	// 	}

	// 	if ( req.method === 'OPTIONS' ) {

	// 		const res = new Response( null, { status: 204 } )
	// 		res.headers.set( 'Access-Control-Allow-Origin', '*' )
	// 		res.headers.set( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS' )
	// 		return res

	// 	}

	// 	return new Response( homepage, { headers: { 'Content-Type': 'text/html' } } )

	// },
	fetch( req ) {

		const url = new URL( req.url )
		console.log( url.pathname )

		return new Response( 'Not Found', { status: 404 } )

	},
} )
