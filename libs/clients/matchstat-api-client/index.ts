import { HttpResponse } from '@abcfinite/http-api-client/src/types/http-response';
import MatchService from './services/match-service';
import EventsParser from './parsers/events-parser';

export default class MatchstatApiClient {

  constructor() {}

  async getTodayMatches() {
    let resultCols: Array<HttpResponse> = []
    let result: HttpResponse
    let pageNo = 1
    do {
      result = await new MatchService().getTodayMatch(pageNo.toString())
      resultCols.push(result)
      pageNo++
    } while(result.value['hasNextPage'])

    const events = new EventsParser().parse(resultCols)
  }
}