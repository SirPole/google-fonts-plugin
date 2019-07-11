import Chunk from '../Chunk/Chunk'
import Fonts from '../Fonts/Fonts'
import Options from '../Options/Options'
import DefaultOptions from '../Options/DefaultOptions'
import {compilation, Compiler} from 'webpack'

export default class Plugin {
  private static pluginName : string = 'google-fonts-plugin'
  private readonly options : Options
  private fonts : Fonts

  constructor (input ? : DefaultOptions | string) {
    this.options = new Options(input)
    this.options.get()
    this.fonts = new Fonts(this.options)
  }

  public static getPluginName = () : string => Plugin.pluginName

  public getFilename = (format : string, compilation : compilation.Compilation) : string => {
    let filename = this.options.filename
    const replaceMatrix : { [key : string] : string } = {
      name: format,
      hash: compilation.hash || '',
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

  public apply = (compiler : Compiler) : void => {
    compiler.hooks.environment.tap(Plugin.getPluginName(), this.options.get)

    compiler.hooks.watchRun.tap(Plugin.getPluginName(), this.options.get)

    compiler.hooks.make.tapAsync(Plugin.getPluginName(), async (compilation : compilation.Compilation, callback : Function) : Promise<void> => {
      const chunk = new Chunk(compilation, this.options.chunkName)
      chunk.create()

      for (const format of Object.values(this.options.formats)) {
        const css = await this.fonts.requestFontsCSS(format)
        compilation.assets[this.getFilename(format, compilation)] = {
          source: () => css,
          size: () => Buffer.byteLength(css, 'utf8')
        }
      }

      compilation.hooks.optimizeAssets.tapAsync(Plugin.getPluginName(), async (assets : { [key : string] : any }, callback : Function) : Promise<void> => {
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

      compilation.hooks.afterOptimizeChunkAssets.tap(Plugin.getPluginName(), () : void => {
        const fontsChunk = chunk.get()
        for (const format of Object.values(this.options.formats)) {
          fontsChunk.files.push(this.getFilename(format, compilation))
        }
      })

      compilation.hooks.chunkHash.tap(Plugin.getPluginName(), (chunk : compilation.Chunk, chunkHash : compilation.ChunkHash) : void => {
        if (chunk.name === this.options.chunkName) {
          chunkHash.digest = () : string => Chunk.hash(this.options)
        }
      })

      callback()
    })

    compiler.hooks.emit.tap(Plugin.getPluginName(), (compilation : compilation.Compilation) : void => {
      const chunk = new Chunk(compilation, this.options.chunkName).get()
      delete compilation.assets[chunk.files[0]]
    })

    compiler.hooks.afterCompile.tap(Plugin.getPluginName(), (compilation : compilation.Compilation) : void => {
      compilation.contextDependencies.add(this.options.file)
    })
  }
}
