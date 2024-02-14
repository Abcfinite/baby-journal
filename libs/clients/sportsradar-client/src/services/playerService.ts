import SportEventParser from '../parsers/sportEventParser'
import HttpApiClient from '@abcfinite/http-api-client'
import { Player } from '../types/player'
import PlayerParser from '../parsers/playerParser'

export default class CompetitorService {

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

    return PlayerParser.parse(result.value as any)
  }

//   async getSummary(competitorId: string) : Promise<Player>{
//     console.log('>>>>>>>getEvent')
//     const headers = {
//       'Content-Type': 'application/json'
//     }

//     const params = {
//       api_key: process.env.SPORTBROKER_API_KEY,
//     }

//     const httpApiClient = new HttpApiClient()

//     const result = await httpApiClient.get(
//       process.env.SPORTBROKER_HOST!,
//       process.env.SPORTBROKER_SPORT_EVENT_PATH.replace('{id}', sportEventId),
//       headers,
//       params,
//     )

//     return SportEventParser.parse(result.value as any)
//   }
}
