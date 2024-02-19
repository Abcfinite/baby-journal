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
    const categoryIds = Object.entries(category).find(([_key, value]) => value == requestCategory)[0]
    const params = {
      category_ids: `["${categoryIds}"]`,
      include_any_team_vs_any_team_events: true
    }
    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      process.env.LADBROKES_HOST!,
      process.env.LADBROKES_EVENT_REQUEST_PATH,
      headers,
      params,
    )

    const events = []

    Object.values(result.value['events']).map(event => {
      events.push(
        EventParser.parse(null,
          event as any,
          result.value['entrants'],
          result.value['markets'],
          result.value['prices'],
        )
      )
    })

    return events
  }

  async getEvent(eventId: string) : Promise<Event | null> {
    console.log('>> getEvent for : ', eventId)
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

    console.log('>> getEvent result : ', result)
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
