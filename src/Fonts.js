const axios = require('axios')
const Cache = require('./Cache')
const Options = require('./Options')

class Fonts {
  constructor (options = Options.defaultOptions) {
    this.options = options
  }

  createRequestUrls = () => {
    const { fonts, encode, fontDisplay } = this.options
    if (!fonts) {
      return
    }

    return Object.values(fonts).map(item => {
      const { family, variants, text, subsets } = item
      if (!family) {
        return
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
  }

  requestFont = async (requestUrl, format, encoding) => {
    let response
    const cacheKey = Cache.key(requestUrl, format)
    if (this.options.cache) {
      response = Cache.get(cacheKey, encoding)
    }

    if (response) {
      return response
    }

    response = (await axios({
      url: requestUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': this.options.formatAgents[format]
      }
    })).data
    Cache.save(cacheKey, response, encoding)

    return response
  }

  requestFontsCSS = async format => {
    const results = []
    for (const promise of this.createRequestUrls().map(requestUrl => this.requestFont(requestUrl, format, 'utf8'))) {
      results.push(await promise)
    }
    return results.join('')
  }

  requestFontFiles = async fontUrls => {
    const results = []
    for (const promise of fontUrls.map(this.requestFontFile)) {
      results.push(await promise)
    }
    return results
  }

  requestFontFile = async fontUrl => {
    if (fontUrl.startsWith('"data:application/')) {
      return fontUrl
    }

    const format = fontUrl.match(new RegExp('(' + Object.values(this.options.formats).join('|') + ')$'))[1]
    const font = await this.requestFont(fontUrl, format, 'binary')
    return `"data:application/x-font-${format};base64,${Buffer.from(font, 'binary').toString('base64')}"`
  }

  encode = async css => {
    if (!this.options.encode) {
      return css
    }

    const regex = /url\((.+?)\)/gi
    const fontUrls = css.match(regex).map(url => url.replace(regex, '$1'))
    const fontsEncoded = await this.requestFontFiles(fontUrls)
    fontsEncoded.forEach((font, index) => {
      css = css.replace(fontUrls[index], font)
    })
    return css
  }
}

module.exports = Fonts
