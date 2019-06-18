const Chunk = require('./Chunk')
const Fonts = require('./Fonts')
const Options = require('./Options')

class Plugin {
  static pluginName = 'google-fonts-plugin'

  constructor (input) {
    this.options = new Options(input)
    this.options.get()
    this.fonts = new Fonts(this.options)
  }

  getFilename = (format, compilation) => {
    let filename = this.options.filename
    const replaceMatrix = {
      name: format,
      hash: compilation.hash,
      chunkhash: Chunk.hash(this.options)
    }

    Object.keys(replaceMatrix).forEach(key => {
      let regex = new RegExp(`\\[${key}:?(\\d+)?\\]`, 'gi')
      let result = regex.exec(filename)

      if (result) {
        filename = filename.replace(regex, replaceMatrix[key].substring(0, result[1] ? Number(result[1]) : Infinity))
      }
    })

    return filename
  }

  apply = compiler => {
    compiler.hooks.environment.tap(Plugin.pluginName, this.options.get)

    compiler.hooks.watchRun.tap(Plugin.pluginName, this.options.get)

    compiler.hooks.make.tapAsync(Plugin.pluginName, async (compilation, callback) => {
      const chunk = new Chunk(compilation, this.options.chunkName)
      chunk.create()

      for (const format of Object.values(this.options.formats)) {
        const css = await this.fonts.requestFontsCSS(format)
        compilation.assets[this.getFilename(format, compilation)] = {
          source: () => css,
          size: () => Buffer.byteLength(css, 'utf8')
        }
      }

      compilation.hooks.optimizeAssets.tapAsync(Plugin.pluginName, async (assets, callback) => {
        for (const format of Object.values(this.options.formats)) {
          const file = this.getFilename(format, compilation)
          const css = await this.fonts.encode(assets[file].source())

          compilation.assets[file] = {
            source: () => css,
            size: () => Buffer.byteLength(css, 'utf8')
          }
        }

        callback()
      })

      compilation.hooks.afterOptimizeChunkAssets.tap(Plugin.pluginName, () => {
        const fontsChunk = chunk.get()
        for (const format of Object.values(this.options.formats)) {
          fontsChunk.files.push(this.getFilename(format, compilation))
        }
      })

      compilation.hooks.chunkHash.tap(Plugin.pluginName, (chunk, chunkHash) => {
        if (chunk.name === this.options.chunkName) {
          chunkHash.digest = () => Chunk.hash(this.options)
        }
      })

      callback()
    })

    compiler.hooks.emit.tap(Plugin.pluginName, compilation => {
      const chunk = new Chunk(compilation, this.options.chunkName).get()
      delete compilation.assets[chunk.files[0]]
    })

    compiler.hooks.afterCompile.tap(Plugin.pluginName, compilation => {
      compilation.contextDependencies.add(this.options.file)
    })
  }
}

module.exports = Plugin
