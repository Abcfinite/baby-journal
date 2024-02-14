import SportEventParser from '../parsers/sportEventParser'
import { SportEvent } from '../types/sportEvent'
import HttpApiClient from '@abcfinite/http-api-client'

export default class EventService {

  constructor() {
  }

  async getEvent(sportEventId: string) : Promise<SportEvent>{
    console.log('>>>>>>>getEvent')
    const headers = {
      'Content-Type': 'application/json'
    }

    const params = {
      api_key: process.env.SPORTBROKER_API_KEY,
    }

    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      process.env.SPORTBROKER_HOST!,
      process.env.SPORTBROKER_SPORT_EVENT_PATH.replace('{id}', sportEventId),
      headers,
      params,
    )

    return SportEventParser.parse(result.value as any)
  }
}
