const { createHash } = require('crypto')
const RawModule = require('webpack/lib/RawModule')

class Chunk {
  constructor (compilation, name) {
    this.compilation = compilation
    this.name = name
  }

  static hash = (options) => createHash('sha1').update(JSON.stringify(options)).digest('hex')

  create = () => {
    const chunk = this.compilation.addChunk(this.name)
    const webpackModule = new RawModule('', `${this.name}-module`)
    webpackModule.buildInfo = {}
    webpackModule.buildMeta = {}
    webpackModule.hash = ''
    chunk.addModule(webpackModule)
  }

  get = () => this.compilation.namedChunks.get(this.name)
}

module.exports = Chunk
