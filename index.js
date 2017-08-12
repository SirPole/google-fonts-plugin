'use strict'

import axios from 'axios'
import fs from 'fs'
import neon from 'neon-js'
import path from 'path'

const PLUGIN_NAME = 'google-fonts-webpack-plugin'

class GoogleFontsWebpackPlugin {
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
    }
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
      let file        = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
      let fileOptions = JSON.parse(file)
      Object.assign(this.options, GoogleFontsWebpackPlugin.defaultOptions, this.getConfig(fileOptions))
    }
  }

  getConfig (options) {
    for (let key of Object.keys(options)) {
      if (key === PLUGIN_NAME) {
        return options[ key ]
      } else if (typeof options[ key ] === 'object' && options[ key ]) {
        return this.getConfig(options[ key ])
      }
    }
  }

  createRequestStrings () {
    return this.options.fonts.map(item => {
      if (item.family) {
        let requestString = 'https://fonts.googleapis.com/css?'
        requestString += 'family=' + item.family.replace(/\s/gi, '+')
        if (item.variants) {
          requestString += ':' + item.variants.reduce((variants, variant) => {
            return variants + ',' + variant
          })
        }
        if (item.subsets) {
          requestString += '&subset=' + item.subsets.reduce((subsets, subset) => {
            return subsets + ',' + subset
          })
        }
        return requestString
      }
      return null
    })
  }

  requestFontsCSS (format) {
    return Promise.all(this.createRequestStrings().map(async requestString => {
      const response = await axios({
        url     : requestString,
        headers : {
          'User-Agent' : this.options.formatAgents[ format ]
        }
      })
      return response.data
    }))
  }
}

export default GoogleFontsWebpackPlugin
