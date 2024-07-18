import { HttpResponse } from '@abcfinite/http-api-client/src/types/http-response'
import MatchService from './src/services/match-service'
import EventsParser from './src/parsers/events-parser'
import { Event } from './src/types/event'

export default class MatchstatApiClient {

  constructor() {}

  getTodayMatches = async (): Promise<Array<Event>> =>{
    let completeEvents = []
    console.log('info: start fetch events')

    const wtaEvents = await this.getMatchesBasedOnType('wta')
    completeEvents = completeEvents.concat(wtaEvents)
    console.log(`info: wta ${wtaEvents.length} events`)

    const atpEvents = await this.getMatchesBasedOnType('atp')
    completeEvents = completeEvents.concat(atpEvents)
    console.log(`info: atp ${atpEvents.length} events`)

    // const itfEvents = await this.getMatchesBasedOnType('itf')
    // completeEvents = completeEvents.concat(itfEvents)
    // console.log(`info: itf ${itfEvents.length} events`)

    return completeEvents
  }

  getMatchesBasedOnType = async (type: 'wta' | 'atp' | 'itf'): Promise<Array<Event>> => {
    let resultCols: Array<HttpResponse> = []
    let result: HttpResponse
    let pageNo = 1
    do {
      result = await new MatchService().getTodayMatch(type, pageNo.toString())
      resultCols.push(result)
      pageNo++
    } while(result.value['hasNextPage'])

    const events = new EventsParser().parse(resultCols)

    return events
  }
}