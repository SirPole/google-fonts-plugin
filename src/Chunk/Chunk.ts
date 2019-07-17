import { createHash } from 'crypto'
import Options from '../Options/Options'
import { compilation as webpackCompilation } from 'webpack'

export default class Chunk {
  private compilation: webpackCompilation.Compilation

  private readonly name: string

  public constructor(compilation: webpackCompilation.Compilation, name: string) {
    this.compilation = compilation
    this.name = name
  }

  public static hash = (options: Options): string =>
    createHash('sha1')
      .update(JSON.stringify(options))
      .digest('hex')

  public create = (): webpackCompilation.Chunk => {
    return this.compilation.addChunk(this.name)
    // const webpackModule =
    // const webpackModule = new RawModule('', `${this.name}-module`)
    // webpackModule.buildInfo = {}
    // webpackModule.buildMeta = {}
    // webpackModule.hash = ''
    // return chunk.addModule(webpackModule)
  }

  public get = (): webpackCompilation.Chunk => this.compilation.namedChunks.get(this.name)
}
