'use strict'

const axios = require('axios')
const crypto = require('crypto')
const fs = require('fs')
const neon = require('neon-js')
const pkgUp = require('pkg-up')
const RawModule = require('webpack/lib/RawModule')
const findCacheDir = require('find-cache-dir')

class GoogleFontsWebpackPlugin {
  static pluginName = 'google-fonts-plugin'
  static defaultOptions = {
    fonts: [
      {
        family: 'Roboto',
        variants: [
          '400',
          '400i',
          '700',
          '700i'
        ],
        subsets: [
          'latin',
          'latin-ext'
        ]
      }
    ],
    formats: [
      'eot',
      'ttf',
      'woff',
      'woff2'
    ],
    formatAgents: {
      'eot': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)',
      'ttf': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.8 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.8',
      'woff': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
      'woff2': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393'
    },
    chunkName: 'google-fonts',
    encode: true,
    cache: true
  }

  constructor (options) {
    this.inputOptions = options
    this.optionsFile = ''
    this.getOptions()
  }

  getOptions () {
    let parsedOptions = {}

    if (typeof this.inputOptions === 'object') {
      parsedOptions = this.inputOptions
    } else if (typeof this.inputOptions === 'string') {
      parsedOptions = this.getOptionsFromFile(this.inputOptions)
    } else {
      parsedOptions = this.getOptionsFromPackage()
    }

    this.options = Object.assign({}, GoogleFontsWebpackPlugin.defaultOptions, parsedOptions)
  }

  getOptionsFromFile (optionsFile) {
    this.optionsFile = optionsFile
    const file = fs.readFileSync(this.optionsFile, 'utf8')
    let fileOptions = {}

    if (/\.neon$/.test(this.optionsFile)) {
      fileOptions = this.parseNeon(file)
    } else {
      fileOptions = this.parseJson(file)
    }

    return this.findConfig(fileOptions)
  }

  parseJson (file) {
    return JSON.parse(file)
  }

  parseNeon (file) {
    return neon.decode(file.replace(/\r\n/g, '\n'), 'object')
  }

  getOptionsFromPackage () {
    this.optionsFile = pkgUp.sync()
    const file = fs.readFileSync(this.optionsFile, 'utf8')

    return this.findConfig(this.parseJson(file))
  }

  findConfig (options) {
    for (let key of Object.keys(options)) {
      if (key === GoogleFontsWebpackPlugin.pluginName) {
        return options[key]
      } else if (options[key] instanceof Object && Object.keys(options[key]).length !== 0) {
        const result = this.findConfig(options[key])

        if (result) {
          return result
        }
      }
    }
  }

  getCacheKey (requestUrl, format) {
    const hashedUrl = crypto.createHash('sha1').update(requestUrl).digest('hex')
    return `${format}-${hashedUrl}`
  }

  getFromCache (key, encoding) {
    let contents = null
    const file = findCacheDir({
      name: GoogleFontsWebpackPlugin.pluginName,
      thunk: true
    })(key)

    if (fs.existsSync(file)) {
      contents = fs.readFileSync(file, encoding)
    }
    return contents
  }

  saveToCache (key, contents, encoding) {
    const file = findCacheDir({
      name: GoogleFontsWebpackPlugin.pluginName,
      create: true,
      thunk: true
    })(key)
    return fs.writeFileSync(file, contents, encoding)
  }

  createRequestStrings () {
    return Object.values(this.options.fonts).map(item => {
      if (item.family) {
        let requestString = 'https://fonts.googleapis.com/css?family=' + item.family.replace(/\s/gi, '+')

        if (item.variants) {
          requestString += ':' + Object.values(item.variants).join(',')
        }

        if (item.subsets) {
          requestString += '&subset=' + Object.values(item.subsets).join(',')
        }

        return requestString
      }
      return null
    })
  }

  async requestFont (requestString, format, encoding) {
    let response = null
    const cacheKey = this.getCacheKey(requestString, format)
    if (this.options.cache) {
      response = this.getFromCache(cacheKey, encoding)
    }

    if (!response) {
      response = (await axios({
        url: requestString,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': this.options.formatAgents[format]
        }
      })).data
      this.saveToCache(cacheKey, response, encoding)
    }

    return response
  }

  async requestFontsCSS (format) {
    const results = []
    for (const promise of this.createRequestStrings().map(requestString => this.requestFont(requestString, format, 'utf8'))) {
      results.push(await promise)
    }
    return results.join('')
  }

  async requestFontFiles (fontUrls) {
    const results = []
    for (const promise of fontUrls.map(fontUrl => this.requestFontFile(fontUrl))) {
      results.push(await promise)
    }
    return results
  }

  async requestFontFile (fontUrl) {
    if (fontUrl.startsWith('"data:application/')) {
      return fontUrl
    }

    const format = fontUrl.match(new RegExp('(' + Object.values(this.options.formats).join('|') + ')$'))[1]
    const font = await this.requestFont(fontUrl, format, 'binary')
    return `"data:application/x-font-${format};base64,${Buffer.from(font, 'binary').toString('base64')}"`
  }

  async encodeFonts (css) {
    if (this.options.encode) {
      const regex = /url\((.+?)\)/gi
      const fontUrls = css.match(regex).map(urlString => urlString.replace(regex, '$1'))
      const fontsEncoded = await this.requestFontFiles(fontUrls)
      fontsEncoded.forEach((font, index) => {
        css = css.replace(fontUrls[index], font)
      })
    }
    return css
  }

  createHash () {
    return crypto.createHash('sha1').update(JSON.stringify(this.options)).digest('hex')
  }

  apply (compiler) {
    compiler.hooks.environment.tap(GoogleFontsWebpackPlugin.pluginName, this.getOptions.bind(this))

    compiler.hooks.watchRun.tap(GoogleFontsWebpackPlugin.pluginName, this.getOptions.bind(this))

    compiler.hooks.make.tapAsync(GoogleFontsWebpackPlugin.pluginName, async (compilation, callback) => {
      // Create chunk and add dummy module
      const chunk = compilation.addChunk(this.options.chunkName)
      const webpackModule = new RawModule('', this.options.chunkName + '-module')
      webpackModule.buildInfo = {}
      webpackModule.buildMeta = {}
      webpackModule.hash = ''
      chunk.addModule(webpackModule)

      for (const format of Object.values(this.options.formats)) {
        const css = await this.requestFontsCSS(format)
        compilation.assets[format + '.css'] = {
          source: () => css,
          size: () => Buffer.byteLength(css, 'utf8')
        }
      }

      compilation.hooks.optimizeAssets.tapAsync(GoogleFontsWebpackPlugin.pluginName, async (assets, callback) => {
        for (const format of Object.values(this.options.formats)) {
          const file = format + '.css'
          const css = await this.encodeFonts(assets[file].source())

          compilation.assets[file] = {
            source: () => css,
            size: () => Buffer.byteLength(css, 'utf8')
          }
        }

        callback()
      })

      compilation.hooks.afterOptimizeChunkAssets.tap(GoogleFontsWebpackPlugin.pluginName, () => {
        const chunk = compilation.chunks.filter(chunk => chunk.name === this.options.chunkName)[0]
        for (const format of Object.values(this.options.formats)) {
          chunk.files.push(format + '.css')
        }
      })

      compilation.hooks.chunkHash.tap(GoogleFontsWebpackPlugin.pluginName, (chunk, chunkHash) => {
        if (chunk.name === this.options.chunkName) {
          chunkHash.digest = this.createHash.bind(this)
        }
      })

      callback()
    })

    compiler.hooks.emit.tap(GoogleFontsWebpackPlugin.pluginName, (compilation) => {
      const chunk = compilation.chunks.filter(chunk => chunk.name === this.options.chunkName)[0]
      delete compilation.assets[chunk.files[0]]
    })

    compiler.hooks.afterCompile.tap(GoogleFontsWebpackPlugin.pluginName, (compilation) => {
      if (this.optionsFile) {
        compilation.contextDependencies.add(this.optionsFile)
      }
    })
  }
}

module.exports = GoogleFontsWebpackPlugin
