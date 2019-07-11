import Chunk from '../Chunk/Chunk'
import Fonts from '../Fonts/Fonts'
import Options from '../Options/Options'
import DefaultOptions from '../Options/DefaultOptions'
import { Compiler, compilation as webpackCompilation } from 'webpack'

export default class Plugin {
  private static pluginName: string = 'google-fonts-plugin'
  private readonly options: Options
  private fonts: Fonts

  public constructor(input?: DefaultOptions | string) {
    this.options = new Options(input)
    this.options.get()
    this.fonts = new Fonts(this.options)
  }

  public static getPluginName = (): string => Plugin.pluginName

  public getFilename = (
    format: string,
    compilation: webpackCompilation.Compilation
  ): string => {
    let filename = this.options.filename
    const replaceMatrix: { [key: string]: string } = {
      name: format,
      hash: compilation.hash || '',
      chunkhash: Chunk.hash(this.options),
    }

    Object.keys(replaceMatrix).forEach((key: string): void => {
      let regex = new RegExp(`\\[${key}:?(\\d+)?\\]`, 'gi')
      let result = regex.exec(filename)

      if (result) {
        filename = filename.replace(
          regex,
          replaceMatrix[key].substring(
            0,
            result[1] ? Number(result[1]) : Infinity
          )
        )
      }
    })

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
          compilation.assets[this.getFilename(format, compilation)] = {
            source: (): string => css,
            size: (): number => Buffer.byteLength(css, 'utf8'),
          }
        }

        compilation.hooks.optimizeAssets.tapAsync(
          Plugin.getPluginName(),
          async (assets, callback): Promise<void> => {
            for (const format of Object.values(this.options.formats)) {
              const file: string = this.getFilename(format, compilation)
              const css: string = await this.fonts.encode(
                assets[Object.keys(assets).indexOf(file)].source()
              )

              compilation.assets[file] = {
                source: (): string => css,
                size: (): number => Buffer.byteLength(css, 'utf8'),
              }
            }

            callback()
          }
        )

        compilation.hooks.afterOptimizeChunkAssets.tap(
          Plugin.getPluginName(),
          (): void => {
            const fontsChunk = chunk.get()
            for (const format of Object.values(this.options.formats)) {
              fontsChunk.files.push(this.getFilename(format, compilation))
            }
          }
        )

        compilation.hooks.chunkHash.tap(
          Plugin.getPluginName(),
          (chunk, chunkHash): void => {
            if (chunk.name === this.options.chunkName) {
              chunkHash.digest = (): string => Chunk.hash(this.options)
            }
          }
        )

        callback()
      }
    )

    compiler.hooks.emit.tap(Plugin.getPluginName(), (compilation): void => {
      const chunk = new Chunk(compilation, this.options.chunkName).get()
      delete compilation.assets[chunk.files[0]]
    })

    compiler.hooks.afterCompile.tap(
      Plugin.getPluginName(),
      (compilation): void => {
        compilation.contextDependencies.add(this.options.file)
      }
    )
  }
}
