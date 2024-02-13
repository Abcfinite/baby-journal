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

    console.log('>>>>>>>SPORTBROKER_SPORT_EVENT_PATH')
    console.log(process.env.SPORTBROKER_SPORT_EVENT_PATH)

    const path = process.env.SPORTBROKER_SPORT_EVENT_PATH.replace('{id}', 'test')

    console.log('>>>>>>>path')
    console.log(path)

    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      process.env.SPORTBROKER_HOST!,
      process.env.SPORTBROKER_SPORT_EVENT_PATH,
      headers,
      params,
    )

    // Object.values(result.value['events']).map(event => {
    //   events.push(
    //     EventParser.parse(null,
    //       event as any,
    //       result.value['entrants'],
    //       result.value['markets'],
    //       result.value['prices'],
    //     )
    //   )
    // })

    return {} as any
  }
}
