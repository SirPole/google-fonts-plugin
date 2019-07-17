import { compilation as webpackCompilation, Compiler } from 'webpack'
import { RawSource } from 'webpack-sources'
import Chunk from '../Chunk/Chunk'
import Fonts from '../Fonts/Fonts'
import DefaultOptions from '../Options/DefaultOptions'
import Options from '../Options/Options'
import Stats from '../Stats/Stats'

export default class Plugin {
  private static pluginName: string = 'google-fonts-plugin'

  private readonly options: Options

  private fonts: Fonts

  public constructor(input?: DefaultOptions | string) {
    this.options = new Options(input)
    this.fonts = new Fonts(this.options)

    if (this.options.stats) {
      new Stats().track(this.options)
    }
  }

  public static getPluginName = (): string => Plugin.pluginName

  public getFilename = (format: string, compilation: webpackCompilation.Compilation): string => {
    let { filename } = this.options
    const replaceMatrix: { [key: string]: string } = {
      name: format,
      hash: compilation.hash || '',
      chunkhash: Chunk.hash(this.options)
    }

    for (const key of Object.keys(replaceMatrix)) {
      const regex = new RegExp(`\\[${key}:?(\\d+)?\\]`, 'gi')
      const result = regex.exec(filename)

      if (result) {
        filename = filename.replace(regex, replaceMatrix[key].substring(0, result[1] ? Number(result[1]) : Infinity))
      }
    }

    return filename
  }

  public apply = (compiler: Compiler): void => {
    compiler.hooks.environment.tap(Plugin.getPluginName(), this.options.get)

    compiler.hooks.watchRun.tap(Plugin.getPluginName(), this.options.get)

    compiler.hooks.make.tapAsync(
      Plugin.getPluginName(),
      async (compilation, callback): Promise<void> => {
        const chunk = new Chunk(compilation, this.options.chunkName)
        chunk.create()
        for (const format of Object.values(this.options.formats)) {
          const css = await this.fonts.requestFontsCSS(format)
          compilation.assets[format] = new RawSource(css)
        }

        compilation.hooks.optimizeAssets.tapAsync(
          Plugin.getPluginName(),
          async (assets, callback): Promise<void> => {
            for (const format of Object.values(this.options.formats)) {
              const css = await this.fonts.encode(compilation.assets[format].source())
              compilation.assets[format] = new RawSource(css)
            }

            callback()
          }
        )

        compilation.hooks.chunkHash.tap(Plugin.getPluginName(), (chunk, chunkHash): void => {
          if (chunk.name === this.options.chunkName) {
            chunkHash.digest = (): string => Chunk.hash(this.options)
          }
        })

        callback()
      }
    )

    compiler.hooks.afterCompile.tap(Plugin.getPluginName(), (compilation): void => {
      compilation.contextDependencies.add(this.options.file)
    })

    compiler.hooks.emit.tap(Plugin.getPluginName(), (compilation): void => {
      const chunk = new Chunk(compilation, this.options.chunkName).get()
      delete compilation.assets[chunk.files[0]]
      for (const format of Object.values(this.options.formats)) {
        const file = this.getFilename(format, compilation)
        chunk.files.push(file)
        if (file !== format) {
          compilation.assets[file] = new RawSource(compilation.assets[format].source())
          delete compilation.assets[format]
        }
      }
    })
  }
}
