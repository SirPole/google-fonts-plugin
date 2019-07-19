import axios from 'axios'
import Options from '../Options/Options'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import Plugin from '../Plugin/Plugin'

export default class Stats {
  private static UA_CODE: string = 'UA-37249277-1'

  private static HOST: string = 'https://www.google-analytics.com'

  private static PATH: string = '/collect'

  private readonly clientId: number

  public constructor() {
    this.clientId = new Date().getTime()
  }

  public track = async (options: Options): Promise<boolean> => {
    let response = null
    try {
      response = await axios({
        method: 'POST',
        baseURL: Stats.HOST,
        url: Stats.PATH,
        params: {
          v: 1,
          tid: Stats.UA_CODE,
          cid: this.clientId,
          t: 'event',
          ec: Plugin.getPluginName(),
          ea: 'initialize',
          el: JSON.stringify({
            version: JSON.parse(readFileSync(resolve(__dirname, '..', '..', 'package.json'), 'utf8')).version,
            fonts: options.fonts,
            formats: options.formats,
            fontDisplay: options.fontDisplay,
            encode: options.encode,
            cache: options.cache,
            chunkName: options.chunkName,
            filename: options.filename
          })
        }
      })
    } catch (e) {}

    return response !== null && response.status === 200
  }
}
