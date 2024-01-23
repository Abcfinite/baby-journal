import HttpApiClient from '../../../http-api-client'
import BetCollectionParser from '../parsers/betCollectionParser'
import { Bet } from '../types/responses'

export default class EventService {

  constructor() {
  }

  // async getEvents() : Promise<Array<Event>>{
  //   const headers = {
  //     'Content-Type': 'application/json'
  //   }
  //   const params = {
  //   }
  //   const httpApiClient = new HttpApiClient()
  //   const result = await httpApiClient.get(
  //     process.env.LADBROKES_HOST!,
  //     process.env.LADBROKES_EVENT_CARD_PATH,
  //     headers,
  //     params,
  //   )

  //   const pendingBets = BetCollectionParser.parse(result.value['data'] as any)

  //   return pendingBets
  // }
}