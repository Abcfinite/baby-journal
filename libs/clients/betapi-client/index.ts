import PagingParser from './src/parsers/pagingParser';
import TableTennisParser from './src/parsers/tableTennisParser';
import HttpApiClient from '../http-api-client'
import { Event } from './src/types/event';
import EventParser from './src/parsers/eventParser';
import CacheService from './src/services/cache-service';
import EndedService from './src/services/ended-service';

export default class BetapiClient {

  constructor() {
  }

  async getPlayerEndedMatches(playerId: string): Promise<Array<Event>> {
    return await new EndedService().getEndedEventBasedOnPlayerId(playerId)
  }

  async getEvents(sportId: string): Promise<Array<Event>> {
    const eventCache = await new CacheService().getEventCache(sportId)

    if (eventCache !== null && eventCache !== undefined) {
      return JSON.parse(eventCache)
    }

    const httpApiClient = new HttpApiClient()

    const result = await httpApiClient.getNative(
      'api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: sportId, token: '196561-oNn4lPf9A9Hwcu' }
    )

    let fullIncomingEvents: Array<Event> = []

    const data = JSON.parse(result.value.toString())
    const paging = PagingParser.parse(data['pager'])
    const numberOfPageTurn = Math.floor(paging.total / paging.perPage)

    const pageOneEvents = data['results'].map(r => {
      return new EventParser().parse(r)
    })

    fullIncomingEvents = fullIncomingEvents.concat(pageOneEvents)


    for (let page = 0; page < numberOfPageTurn; page++) {
      fullIncomingEvents = fullIncomingEvents.concat(await this.getEveryPage(page, sportId))
    }


    await new CacheService().setEventCache(sportId, JSON.stringify(fullIncomingEvents))

    return fullIncomingEvents
  }

  async getEveryPage(pageNo: number, sportId: string) {
    const httpApiClient = new HttpApiClient()
    const loopResult = await httpApiClient.getNative(
      'api.b365api.com',
      '/v3/events/upcoming',
      null,
      { sport_id: sportId, token: '196561-oNn4lPf9A9Hwcu', page: `${2 + pageNo}` }
    )

    const data = JSON.parse(loopResult.value.toString())
    const parsedEvents = data['results'].map(r => {
      return new EventParser().parse(r)
    })

    return parsedEvents
  }

  parseTableTennisEvent = async (htmlResponse: string) => new TableTennisParser().parse(htmlResponse)

}