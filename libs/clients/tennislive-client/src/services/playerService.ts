import HttpApiClient from '@abcfinite/http-api-client'
import { Player } from '../types/player'
import PlayerListParser from '../parsers/playerListParser';
import PlayerDetailParser from '../parsers/playerDetailParser';
import PlayerNotFound from '../errors/PlayerNotFound';
import { v4 as uuidv4 } from 'uuid';

export default class PlayerService {

  constructor() {
  }

  async getPlayerUrl(playerName: string) : Promise<string> {
    const headers = {
      Host: 'www.tennislive.net',
      Referer: process.env.TENNISLIVE_HOST,
      'Cookie': uuidv4()
    }

    const httpApiClient = new HttpApiClient()


    const playerUrl = '/tmpl/search.php?qe='+playerName

    const result = await httpApiClient.getNative('www.tennislive.net',
      playerUrl, headers)

    return PlayerListParser.parse(result.value as string, playerName)
  }

  async getPlayerDetailHtml(playerDetailUrl: string, keepPreviousMatches: boolean = true) : Promise<Player> {
    const headers = {
      Host: 'www.tennislive.net',
      Referer: process.env.TENNISLIVE_HOST,
      'Cookie': uuidv4()
    }

    const httpApiClient = new HttpApiClient()

    let result = null

    try {
      // result = await httpApiClient.get(
      //   process.env.TENNISLIVE_HOST!,
      //   playerDetailUrl.replace(process.env.TENNISLIVE_HOST!, '') ,
      //   headers,
      // )

      result = await httpApiClient.getNative('www.tennislive.net',
        playerDetailUrl.replace(process.env.TENNISLIVE_HOST!, ''), headers)

    } catch(ex) {
      // if (ex.response.status == 404) {
      //   throw new PlayerNotFound()
      // }
      console.log('>>>error fetch player detail')
      console.log(ex)
    }

    return PlayerDetailParser.parse(result.value as string, keepPreviousMatches)
  }
}
