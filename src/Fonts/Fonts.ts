import axios from 'axios'
import Cache from '../Cache/Cache'
import Font from '../Options/Font'
import Options from '../Options/Options'

export default class Fonts {
  private readonly options: Options

  private readonly format: string

  public constructor(format: string, options?: Options) {
    if (!options) {
      options = new Options()
    }
    this.options = options
    this.format = format
  }

  public createRequestUrls = (): string[] => {
    const { fonts, encode, fontDisplay } = this.options
    if (fonts.length === 0) {
      return []
    }

    return Object.values(fonts)
      .map((item: Font): string => {
        const { family, variants, text, subsets } = item
        if (!family) {
          return ''
        }

        let requestString = `https://fonts.googleapis.com/css?family=${family.replace(/\s/gi, '+')}`

        if (variants) {
          requestString += `:${Object.values(variants).join(',')}`
        }

        if (text) {
          requestString += `&text=${text}`
        } else if (subsets) {
          requestString += `&subset=${Object.values(subsets).join(',')}`
        }

        if (!encode && typeof fontDisplay === 'string' && fontDisplay.length > 0) {
          requestString += `&display=${fontDisplay}`
        }

        return requestString
      })
      .filter((url: string): boolean => url.length > 0)
  }

  public requestFont = async (requestUrl: string, encoding: string): Promise<string> => {
    let response = ''
    const cacheKey = Cache.key(requestUrl, this.format)
    if (this.options.cache) {
      response = Cache.get(cacheKey, encoding)
    }

    if (response.length > 0) {
      return response
    }

    response = (await axios({
      url: requestUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': this.options.getAgent(this.format)
      }
    })).data
    Cache.save(cacheKey, response, encoding)

    return response
  }

  public requestFontsCSS = async (): Promise<string> => {
    const urls = this.createRequestUrls()
    const promises = urls.map((url: string): Promise<string> => this.requestFont(url, 'utf8'))
    const fonts = await Promise.all(promises)
    return fonts.join('')
  }

  public requestFontFiles = async (fontUrls: string[]): Promise<string[]> => {
    const promises = fontUrls.map(this.requestFontFile)
    return Promise.all(promises)
  }

  public requestFontFile = async (fontUrl: string): Promise<string> => {
    if (!fontUrl.startsWith('http')) {
      return fontUrl
    }

    const font = await this.requestFont(fontUrl, 'binary')
    return `"data:application/x-font-${this.format};base64,${Buffer.from(font, 'binary').toString('base64')}"`
  }

  public encode = async (css: string): Promise<string> => {
    if (!this.options.encode) {
      return css
    }

    const regex = /url\((.+?)\)/gi
    const matches = css.match(regex)
    if (!matches) {
      return css
    }

    const fontUrls = matches.map((url: string): string => url.replace(regex, '$1'))
    const fontsEncoded = await this.requestFontFiles(fontUrls)
    fontsEncoded.forEach((font: string, index: number): void => {
      css = css.replace(fontUrls[index], font)
    })
    return css
  }
}
