import { image2ascii }  from '@ascii-kit/image'
import { defineConfig } from 'vite'

const getAsciiImage = async ( name: string ) => {

	const res   = await fetch( name )
	const input = await res.arrayBuffer()
	return await image2ascii( input, { chars: ' -.@' } )

}

export default defineConfig( { define : {
	PROFILE_ASCII_IMAGE    : JSON.stringify( await getAsciiImage( 'https://github.com/angelespejo.png?size=72' ) ),
	COLLECTIVE_ASCII_IMAGE : JSON.stringify( await getAsciiImage( 'https://github.com/pigeonposse.png?size=72' ) ),
} } )
