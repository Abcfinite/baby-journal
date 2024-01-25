import HttpApiClient from '../../../http-api-client'
import EventParser from '../parsers/eventParser'
import { Bet, Event } from '../types/responses'

export default class EventService {

  constructor() {
  }

  async getEvent(eventId: string) : Promise<Event>{
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

    console.log('>>>params>>>', params)
    // console.log('>>>>>getEventService>>>', result.value)

    const event: Event = EventParser.parse(result.value as any)

    return event
  }

  async getEvents(bets: Array<Bet>) : Promise<Array<Bet>> {
    console.log('>>>>getEvents')
    const betsResult = Promise.all(
      bets.map(async bet => {
        console.log('>>>>bet.event.id>>>', bet.event.id)
        bet.event = await this.getEvent(bet.event.id)
        return bet
      })
    )

    return betsResult
  }
}
