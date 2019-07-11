import Font from './Font'
import FontDisplay from './FontDisplay'

export default interface DefaultOptions extends Object {
  fonts? : Font[],
  formats? : string[]
  formatAgents? : { [key : string] : string },
  chunkName? : string
  encode? : boolean
  fontDisplay? : FontDisplay | string
  cache? : boolean,
  filename? : string
}
