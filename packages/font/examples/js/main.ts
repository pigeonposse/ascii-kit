import { Font }   from '@ascii-kit/font'
import fontThreeD from '@ascii-kit/font-3d'

const font  = new Font( fontThreeD )
const ascii = await font.text( 'Hello World!' )

console.log( ascii )
