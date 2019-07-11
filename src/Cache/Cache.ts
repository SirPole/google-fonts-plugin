import {createHash} from 'crypto'
import {existsSync, readFileSync, writeFileSync} from 'fs'
import Plugin from '../Plugin/Plugin'
import * as findCacheDir from 'find-cache-dir'

export default class Cache {
  public static get = (key : string, encoding : string) : string => {
    const thunk = findCacheDir({
      name: Plugin.getPluginName(),
      thunk: true
    })

    if (!thunk || !existsSync(thunk(key))) {
      return ''
    }

    return readFileSync(thunk(key), encoding)
  }

  public static key = (requestUrl : string, format : string) : string => `${format}-${createHash('sha1').update(requestUrl).digest('hex')}`

  public static save = (key : string, contents : string, encoding : string) : void => {
    const thunk = findCacheDir({
      name: Plugin.getPluginName(),
      create: true,
      thunk: true
    })

    if (!thunk) {
      return
    }

    return writeFileSync(thunk(key), contents, encoding)
  }
}
