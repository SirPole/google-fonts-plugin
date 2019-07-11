import {createHash} from 'crypto'
import Options from '../Options/Options'
import {compilation as webpackCompilation, RawModule} from 'webpack'
// import RawModule from 'webpack/lib/RawModule' // FIXME

export default class Chunk {
  private compilation : webpackCompilation.Compilation
  private readonly name : string

  constructor (compilation : webpackCompilation.Compilation, name : string) {
    this.compilation = compilation
    this.name = name
  }

  public static hash = (options : Options) : string => createHash('sha1').update(JSON.stringify(options)).digest('hex')

  public create = () : void => {
    const chunk = this.compilation.addChunk(this.name)
    const webpackModule = new RawModule('', `${this.name}-module`)
    webpackModule.buildInfo = {}
    webpackModule.buildMeta = {}
    webpackModule.hash = ''
    chunk.addModule(webpackModule)
  }

  public get = () : any => this.compilation.namedChunks.get(this.name)
}
