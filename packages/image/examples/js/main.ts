import { image2ascii } from '@ascii-kit/image'

const res   = await fetch(
	'https://raw.githubusercontent.com/pigeonposse/backan/main/docs/public/logo.png',
)
const input = await res.arrayBuffer()
const ascii = await image2ascii( input, {
	fit    : 'width',
	width  : '100%',
	height : '100%',
	chars  : ' #+@',
} )

console.log( ascii )
