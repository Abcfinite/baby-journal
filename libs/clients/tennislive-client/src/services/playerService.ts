import HttpApiClient from '@abcfinite/http-api-client'
import { Player } from '../types/player'
import PlayerListParser from '../parsers/playerListParser'
import PlayerDetailParser from '../parsers/playerDetailParser'
import { v4 as uuidv4 } from 'uuid'

export default class PlayerService {
  async getPlayerUrl(playerName: string): Promise<string> {
    const headers = {
      Host: 'www.tennislive.net',
      Referer: process.env.TENNISLIVE_HOST,
      'Cookie': uuidv4()
    }

    const httpApiClient = new HttpApiClient()


    const playerUrl = '/tmpl/search.php?qe=' + playerName

    const result = await httpApiClient.getNative('www.tennislive.net',
      playerUrl, headers)

    return PlayerListParser.parse(result.value as string)
  }

  async getPlayerDetailHtml(playerDetailUrl: string, keepPreviousMatches = true): Promise<Player> {
    const headers = {
      Host: 'www.tennislive.net',
      Referer: process.env.TENNISLIVE_HOST,
      'Cookie': uuidv4()
    }

    const httpApiClient = new HttpApiClient()

    let result = null

    try {
      result = await httpApiClient.getNative('www.tennislive.net',
        playerDetailUrl.replace(process.env.TENNISLIVE_HOST!, ''), headers)

    } catch (ex) {
      console.log('>>>error fetch player detail')
      console.log(ex)
    }

    return PlayerDetailParser.parse(result.value as string, keepPreviousMatches)
  }
}
