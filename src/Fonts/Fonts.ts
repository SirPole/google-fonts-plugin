import axios from 'axios'
import Cache from '../Cache/Cache'
import Font from '../Options/Font'
import Options from '../Options/Options'

export default class Fonts {
  private readonly options: Options

  public constructor(options?: Options) {
    if (!options) {
      options = new Options()
    }
    this.options = options
  }

  public createRequestUrls = (): string[] => {
    const { fonts, encode, fontDisplay } = this.options
    if (!fonts) {
      return []
    }

    return Object.values(fonts)
      .map((item: Font): string => {
        const { family, variants, text, subsets } = item
        if (!family) {
          return ''
        }

        let requestString = `https://fonts.googleapis.com/css?family=${family.replace(
          /\s/gi,
          '+'
        )}`

        if (variants) {
          requestString += `:${Object.values(variants).join(',')}`
        }

        if (text) {
          requestString += `&text=${text}`
        } else if (subsets) {
          requestString += `&subset=${Object.values(subsets).join(',')}`
        }

        if (
          !encode &&
          typeof fontDisplay === 'string' &&
          fontDisplay.length > 0
        ) {
          requestString += `&display=${fontDisplay}`
        }

        return requestString
      })
      .filter((url: string): boolean => url.length > 0)
  }

  public requestFont = async (
    requestUrl: string,
    format: string,
    encoding: string
  ): Promise<string> => {
    let response = ''
    const cacheKey = Cache.key(requestUrl, format)
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
        'User-Agent': this.options.getAgent(format),
      },
    })).data
    Cache.save(cacheKey, response, encoding)

    return response
  }

  public requestFontsCSS = async (format: string): Promise<string> => {
    const results = []
    for (const promise of this.createRequestUrls().map(
      (requestUrl: string): Promise<string> =>
        this.requestFont(requestUrl, format, 'utf8')
    )) {
      results.push(await promise)
    }
    return results.join('')
  }

  public requestFontFiles = async (fontUrls: string[]): Promise<string[]> => {
    const results = []
    for (const promise of fontUrls.map(this.requestFontFile)) {
      results.push(await promise)
    }
    return results
  }

  public requestFontFile = async (fontUrl: string): Promise<string> => {
    if (fontUrl.startsWith('"data:application/')) {
      return fontUrl
    }

    const matches = fontUrl.match(
      new RegExp('(' + Object.values(this.options.formats).join('|') + ')$')
    )
    if (!matches) {
      return fontUrl
    }

    const format = matches[1]
    const font = await this.requestFont(fontUrl, format, 'binary')
    return `"data:application/x-font-${format};base64,${Buffer.from(
      font,
      'binary'
    ).toString('base64')}"`
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

    const fontUrls = matches.map((url: string): string =>
      url.replace(regex, '$1')
    )
    const fontsEncoded = await this.requestFontFiles(fontUrls)
    fontsEncoded.forEach((font: string, index: number): void => {
      css = css.replace(fontUrls[index], font)
    })
    return css
  }
}
