import PagingParser from './src/parsers/pagingParser';
import HttpApiClient from '../http-api-client'
import { Event } from './src/types/event';
import EventParser from './src/parsers/eventParser';
import CacheService from './src/services/cache-service';

export default class BetapiClient {

  constructor() {
  }

  async getEvents() : Promise<Array<Event>>{
    const eventCache = await new CacheService().getEventCache()

    if (eventCache !== null && eventCache !== undefined) {
      return JSON.parse(eventCache)
    }

    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.get(
      'https://api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: '13', token: '196561-oNn4lPf9A9Hwcu' }
    )

    let fullIncomingEvents: Array<Event> = []

    const paging = PagingParser.parse(result.value['pager'])
    const numberOfPageTurn = Math.floor(paging.total / paging.perPage)

    const pageOneEvents = result.value['results'].map(r => {
      return EventParser.parse(r)
    })

    fullIncomingEvents = fullIncomingEvents.concat(pageOneEvents)

    let fetchPageActions = []
    for (let page=0; page < numberOfPageTurn; page++) {
      fetchPageActions.push(this.getEveryPage(page))
      // fullIncomingEvents = fullIncomingEvents.concat(await this.getEveryPage(page))
    }

    let parsedEvents: Array<Array<Event>> = await Promise.all(fetchPageActions)

    parsedEvents.map(pe => fullIncomingEvents = fullIncomingEvents.concat(pe))

    new CacheService().setEventCache(JSON.stringify(fullIncomingEvents))

    return fullIncomingEvents
  }

  async getEveryPage(pageNo: number) {
    const httpApiClient = new HttpApiClient()
    const loopResult = await httpApiClient.get(
      'https://api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: '13', token: '196561-oNn4lPf9A9Hwcu', page: 2+pageNo }
    )

    const parsedEvents = loopResult.value['results'].map(r => {
      return EventParser.parse(r)
    })

    return parsedEvents
  }
}