import HttpApiClient from '@abcfinite/http-api-client'
import { Player } from '../types/player'
import PlayerParser from '../parsers/playerParser'

export default class PlayerService {

  constructor() {
  }

  async getProfile(competitorId: string) : Promise<Player> {
    const headers = {
      'Content-Type': 'application/json'
    }

    const params = {
      api_key: process.env.SPORTBROKER_API_KEY,
    }

    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      process.env.SPORTBROKER_HOST!,
      process.env.SPORTBROKER_PLAYER_PROFILE_PATH.replace('{id}', competitorId),
      headers,
      params,
    )

    console.log('>>>>>>>getProfile')
    console.log(result)

    return PlayerParser.parse(result.value as any)
  }
}
