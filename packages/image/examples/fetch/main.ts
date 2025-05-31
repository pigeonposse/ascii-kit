import { image2ascii } from '@ascii-kit/image'

const res   = await fetch( 'https://github.com/pigeonposse.png?size=72' )
const input = await res.arrayBuffer()
const value = await image2ascii( input, { chars: ' -.@' } )

console.log( value )
