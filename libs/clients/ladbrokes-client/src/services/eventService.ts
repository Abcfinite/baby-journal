import HttpApiClient from '@abcfinite/http-api-client'
import EventParser from '../parsers/eventParser'
import { Bet, Event } from '../types/responses'
import { category } from '../types/category';

export default class EventService {

  constructor() {
  }

  async getFutureEvents(requestCategory: string) : Promise<Array<Event>>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const params = {
      id: Object.entries(category).find(([_key, value]) => value == requestCategory) ,
      include_any_team_vs_any_team_events: true
    }
    const httpApiClient = new HttpApiClient()
    const result = await httpApiClient.get(
      process.env.LADBROKES_HOST!,
      process.env.LADBROKES_EVENT_REQUEST_PATH,
      headers,
      params,
    )

    console.log('>>>>>result')
    console.log(result)

    // const event: Event | null = EventParser.parse(result.value as any)

    return []
  }

  async getEvent(eventId: string) : Promise<Event | null>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const params = {
      id: eventId
    }
    const httpApiClient = new HttpApiClient()
    const result = await httpApiClient.get(
      process.env.LADBROKES_HOST!,
      process.env.LADBROKES_EVENT_CARD_PATH,
      headers,
      params,
    )

    const event: Event | null = EventParser.parse(result.value as any)

    return event
  }

  async getEvents(bets: Array<Bet>) : Promise<Array<Bet>> {
    const betsResult = Promise.all(
      bets.map(async bet => {
        bet.event = await this.getEvent(bet.event.id)
        return bet
      })
    )

    return betsResult
  }
}
