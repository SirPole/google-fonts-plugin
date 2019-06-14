const { createHash } = require('crypto')
const findCacheDir = require('find-cache-dir')
const { existsSync, readFileSync, writeFileSync } = require('fs')

class Cache {
  static pluginName = 'google-fonts-plugin'

  static get = (key, encoding) => {
    const file = findCacheDir({
      name: Cache.pluginName,
      thunk: true
    })(key)

    if (!existsSync(file)) {
      return
    }

    return readFileSync(file, encoding)
  }

  static key = (requestUrl, format) => `${format}-${createHash('sha1').update(requestUrl).digest('hex')}`

  static save = (key, contents, encoding) => {
    const file = findCacheDir({
      name: Cache.pluginName,
      create: true,
      thunk: true
    })(key)
    return writeFileSync(file, contents, encoding)
  }
}

module.exports = Cache
