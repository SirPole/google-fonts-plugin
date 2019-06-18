const { readFileSync } = require('fs')
const neon = require('neon-js')
const pkgUp = require('pkg-up')

class Options {
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
        ],
        text: ''
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
    fontDisplay: 'swap',
    cache: true,
    filename: '[name].css'
  }

  constructor (input) {
    this.input = input
    this.file = null
  }

  parseJson = file => JSON.parse(file)

  parseNeon = file => neon.decode(file.replace(/\r\n/g, '\n'), 'object')

  get = () => {
    let parsedOptions = {}

    if (typeof this.input === 'object') {
      parsedOptions = this.input
    } else if (typeof this.input === 'string') {
      parsedOptions = this.getFromFile(this.input)
    } else {
      parsedOptions = this.getFromPackage()
    }

    Object.assign(this, Options.defaultOptions, parsedOptions)
    return Object.assign({}, Options.defaultOptions, parsedOptions)
  }

  getFromFile = input => {
    this.file = input
    const file = readFileSync(this.file, 'utf8')
    let fileOptions = {}

    if (/\.neon$/.test(this.file)) {
      fileOptions = this.parseNeon(file)
    } else {
      fileOptions = this.parseJson(file)
    }

    return this.crawl(fileOptions)
  }

  getFromPackage = () => {
    this.file = pkgUp.sync()
    const file = readFileSync(this.file, 'utf8')

    return this.crawl(this.parseJson(file))
  }

  crawl = options => {
    for (let key of Object.keys(options)) {
      if (key === Options.pluginName) {
        return options[key]
      } else if (options[key] instanceof Object && Object.keys(options[key]).length !== 0) {
        const result = this.crawl(options[key])

        if (result) {
          return result
        }
      }
    }
  }
}

module.exports = Options
