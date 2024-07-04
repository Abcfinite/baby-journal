import PagingParser from './src/parsers/pagingParser';
import HttpApiClient from '../http-api-client'
import { Event } from './src/types/event';
import EventParser from './src/parsers/eventParser';
import { parse } from 'node-html-parser';

export default class BetapiClient {

  constructor() {
  }

  async getEvents() : Promise<Array<Event>>{
    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      'https://api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: '13', token: '196561-yXe5Z8ulO9UAvk' }
    )

    let fullIncomingEvents: Array<Event> = []

    const paging = PagingParser.parse(result.value['pager'])
    const numberOfPageTurn = Math.floor(paging.total / paging.perPage)

    const pageOneEvents = result.value['results'].map(r => {
      return EventParser.parse(r)
    })

    fullIncomingEvents = fullIncomingEvents.concat(pageOneEvents)

    // let fetchPageActions = []
    // for (let page=0; page < numberOfPageTurn; page++) {
    //   fetchPageActions.push(this.getEveryPage(page, fullIncomingEvents))
    // }

    // fullIncomingEvents = await Promise.all(fetchPageActions)

    return fullIncomingEvents
  }

  async getEveryPage(pageNo: number, fullIncomingEvents: Array<Event>) {
    const httpApiClient = new HttpApiClient()
    const loopResult = await httpApiClient.get(
      'https://api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: '13', token: '196561-yXe5Z8ulO9UAvk', page: 2+pageNo }
    )

    const parsedEvents = loopResult.value['results'].map(r => {
      return EventParser.parse(r)
    })

    fullIncomingEvents = fullIncomingEvents.concat(parsedEvents)

    return fullIncomingEvents
  }
}