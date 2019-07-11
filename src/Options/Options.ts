import { readFileSync } from 'fs'
import * as pkgUp from 'pkg-up'
import DefaultOptions from './DefaultOptions'
import FontDisplay from './FontDisplay'
import Plugin from '../Plugin/Plugin'
import Font from './Font'

export default class Options implements DefaultOptions {
  public fonts: Font[] = [
    {
      family: 'Roboto',
      variants: ['400', '400i', '700', '700i'],
      subsets: ['latin', 'latin-ext'],
      text: '',
    },
  ]
  public formats: string[] = ['woff', 'woff2']
  private readonly formatAgents: { [key: string]: string } = {
    eot:
      'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)',
    ttf:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.8 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.8',
    woff:
      'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
    woff2:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
  }
  public chunkName: string = 'google-fonts'
  public filename: string = '[name].css'
  public fontDisplay: FontDisplay | string = FontDisplay.SWAP
  public encode: boolean = true
  public cache: boolean = true
  public file: string = ''
  private readonly input: DefaultOptions | string | undefined

  public constructor(input?: DefaultOptions | string) {
    this.input = input
  }

  public get = (): DefaultOptions => {
    // FIXME
    let parsedOptions: DefaultOptions = {}

    if (typeof this.input === 'object') {
      parsedOptions = this.input
    } else if (typeof this.input === 'string') {
      parsedOptions = this.getFromFile(this.input)
    } else {
      parsedOptions = this.getFromPackage()
    }
    Object.assign(this, parsedOptions)
    return parsedOptions
  }

  private getFromFile = (input: string): DefaultOptions => {
    this.file = input
    const fileContents: string = readFileSync(this.file, 'utf8')

    return this.crawl(JSON.parse(fileContents))
  }

  private getFromPackage = (): DefaultOptions =>
    this.getFromFile(pkgUp.sync() || '')

  private crawl = (options: { [key: string]: any }): DefaultOptions => {
    let result: DefaultOptions = {}
    for (let key of Object.keys(options)) {
      if (key === Plugin.getPluginName()) {
        return options[key]
      } else if (
        options[key] instanceof Object &&
        Object.keys(options[key]).length !== 0
      ) {
        result = this.crawl(options[key])

        if (Object.entries(result).length > 0) {
          break
        }
      }
    }

    return result
  }

  public getAgent(format: string): string {
    return this.formatAgents[format]
  }
}
