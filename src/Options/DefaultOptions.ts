import Font from './Font'
import FontDisplay from './FontDisplay'

export default interface DefaultOptions extends Object {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any

  fonts?: Font[]
  formats?: string[]
  chunkName?: string
  encode?: boolean
  fontDisplay?: FontDisplay | string
  cache?: boolean
  filename?: string
}
