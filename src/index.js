'use strict'

import axios from 'axios'
import cssnano from 'cssnano'
import fs from 'fs'
import mkdirp from 'mkdirp'
import neon from 'neon-js'
import path from 'path'

export default class GoogleFontsWebpackPlugin {
  static pluginName     = 'google-fonts-plugin'
  static defaultOptions = {
    fonts        : [
      {
        family   : 'Roboto',
        variants : [
          '400',
          '400i',
          '700',
          '700i'
        ],
        subsets  : [
          'latin',
          'latin-ext'
        ]
      }
    ],
    formats      : [
      'eot',
      'ttf',
      'woff',
      'woff2'
    ],
    formatAgents : {
      'eot'   : 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)',
      'ttf'   : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.8 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.8',
      'woff'  : 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
      'woff2' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393'
    },
    outputDir    : 'public/fonts',
    encode       : true,
    minify       : true
  }

  constructor (options) {
    this.options = {}
    if (typeof options === 'object') {
      Object.assign(this.options, GoogleFontsWebpackPlugin.defaultOptions, options)
    } else if (typeof options === 'string') {
      let file        = fs.readFileSync(options, 'utf8')
      let fileOptions = {}
      if (/\.neon$/.test(options)) {
        fileOptions = neon.decode(file.replace(/\r\n/g, '\n'), 'object')
      } else {
        fileOptions = JSON.parse(file)
      }
      Object.assign(this.options, GoogleFontsWebpackPlugin.defaultOptions, this.getConfig(fileOptions))
    } else {
      let file        = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
      let fileOptions = JSON.parse(file)
      Object.assign(this.options, GoogleFontsWebpackPlugin.defaultOptions, this.getConfig(fileOptions))
    }
  }

  getConfig (options) {
    for (let key of Object.keys(options)) {
      if (key === GoogleFontsWebpackPlugin.pluginName) {
        return options[ key ]
      } else if (options[ key ] instanceof Object && Object.keys(options[ key ]).length !== 0) {
        const result = this.getConfig(options[ key ])

        if (result) {
          return result
        }
      }
    }
  }

  createRequestStrings () {
    return Object.values(this.options.fonts).map(item => {
      if (item.family) {
        let requestString = 'https://fonts.googleapis.com/'+(item.icon ? 'icon' : 'css')+'?'
        requestString += 'family=' + item.family.replace(/\s/gi, '+')
        if (item.variants) {
          requestString += ':' + Object.values(item.variants).reduce((variants, variant) => {
            return variants + ',' + variant
          })
        }
        if (item.subsets) {
          requestString += '&subset=' + Object.values(item.subsets).reduce((subsets, subset) => {
            return subsets + ',' + subset
          })
        }
        return requestString
      }
      return null
    })
  }

  async requestFont (requestString, format) {
    const response = await axios({
      url          : requestString,
      responseType : 'arraybuffer',
      headers      : {
        'User-Agent' : this.options.formatAgents[ format ]
      }
    })
    return response.data
  }

  async requestFontsCSS (format) {
    const results = []
    for (const promise of this.createRequestStrings().map(requestString => this.requestFont(requestString, format))) {
      results.push(await promise)
    }
    return results.join('')
  }

  async requestFontFiles (fontUrls, format) {
    const results = []
    for (const promise of fontUrls.map(fontUrl => this.requestFontFile(fontUrl, format))) {
      results.push(await promise)
    }
    return results
  }

  async requestFontFile (fontUrl, format) {
    const font = await this.requestFont(fontUrl, format)
    return `"data:application/x-font-${format};base64,${Buffer.from(font, 'binary').toString('base64')}"`
  }

  async encodeFonts (css, format) {
    if (this.options.encode) {
      const regex        = /url\((.+?)\)/gi
      const fontUrls     = css.match(regex).map(urlString => urlString.replace(regex, '$1'))
      const fontsEncoded = await this.requestFontFiles(fontUrls, format)
      fontsEncoded.forEach((font, index) => {
        css = css.replace(fontUrls[ index ], font)
      })
    }
    return css
  }

  async minifyFonts (css) {
    if (this.options.minify) {
      const minified = await cssnano.process(css, {
        discardComments : { removeAll : true },
        discardUnused   : false
      })
      return minified.css
    }
    return css
  }

  pushToFile (css, format) {
    mkdirp.sync(this.options.outputDir)
    return fs.writeFileSync(path.join(this.options.outputDir, format + '.css'), css)
  }

  async make () {
    for (const format of Object.values(this.options.formats)) {
      let css = await this.requestFontsCSS(format)
      css     = await this.encodeFonts(css, format)
      css     = await this.minifyFonts(css)
      this.pushToFile(css, format)
    }
  }

  apply (compiler) {
    compiler.plugin('emit', async (compilation, callback) => {
      await this.make()
      callback()
    })
  }
}
