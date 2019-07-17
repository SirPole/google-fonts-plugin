import { createHash } from 'crypto'
import { compilation as webpackCompilation } from 'webpack'
import DefaultOptions from '../Options/DefaultOptions'

const RawModule = require('webpack/lib/RawModule') // eslint-disable-line @typescript-eslint/no-var-requires

export default class Chunk {
  private compilation: webpackCompilation.Compilation

  private readonly name: string

  public constructor(compilation: webpackCompilation.Compilation, name: string) {
    this.compilation = compilation
    this.name = name
  }

  public static hash = (options: DefaultOptions): string =>
    createHash('sha1')
      .update(JSON.stringify(options))
      .digest('hex')

  public create = (): boolean => {
    const chunk = this.compilation.addChunk(this.name)
    const webpackModule = new RawModule('', `${this.name}-module`)
    webpackModule.buildInfo = {}
    webpackModule.buildMeta = {}
    webpackModule.hash = ''
    return chunk.addModule(webpackModule)
  }

  public get = (): webpackCompilation.Chunk => this.compilation.namedChunks.get(this.name)
}
