import EventParser from '../parsers/eventParser'
import PagingParser from '../parsers/pagingParser'
import HttpApiClient from '@abcfinite/http-api-client'
import CacheService from './cache-service'

export default class EndedService {
    constructor() {}

    getEndedEventBasedOnPlayerId = async (playerId: string) => {
        const resultFirstPage = await new HttpApiClient().get(this.getPlayerEndedMatchUrl(playerId, 1))

        const paging = PagingParser.parse(resultFirstPage.value['pager'])
        const numberOfPageTurn = Math.floor(paging.total / paging.perPage)

        let fullEndedEvents: Array<Event> = []

        const pageOneEvents = resultFirstPage.value['results'].map(r => {
          return new EventParser().parse(r)
        })

        fullEndedEvents = fullEndedEvents.concat(pageOneEvents)

        let fetchPageActions = []
        for (let page=0; page < numberOfPageTurn; page++) {
          fetchPageActions.push(this.getEveryPage(page, playerId))
        }

        let parsedEvents: Array<Array<Event>> = await Promise.all(fetchPageActions)

        parsedEvents.map(pe => fullEndedEvents = fullEndedEvents.concat(pe))

        new CacheService().setEventCache(JSON.stringify(fullEndedEvents))

        return fullEndedEvents
    }

    getPlayerEndedMatchUrl = (playerId: string, pageNo: number): string => `https://api.b365api.com/v3/events/ended?sport_id=13&token=196561-oNn4lPf9A9Hwcu&team_id=${playerId}&page=${pageNo}`

    async getEveryPage(pageNo: number, playerId: string) {
        const httpApiClient = new HttpApiClient()
        const loopResult = await httpApiClient.get(
          'https://api.b365api.com',
          '/v3/ended/upcoming',
          null,
          { sport_id: '13', token: '196561-oNn4lPf9A9Hwcu', team_id: playerId, page: 2+pageNo }
        )

        const parsedEvents = loopResult.value['results'].map(r => {
          return new EventParser().parse(r)
        })

        return parsedEvents
    }
}