import HttpApiClient from '../http-api-client'
import PendingBetsParser from './src/parsers/pendingBetsParser'
import EventService from './src/services/eventService';
import Socket from './src/services/socket'
import { Event, Bet, PendingBets } from './src/types/responses';

export default class LadbrokesClient {

  constructor() {
  }

  async getPendingBets() : Promise<PendingBets>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': process.env.LADBROKES_BEARER_TOKEN
    }
    const httpApiClient = new HttpApiClient()
    const result = await httpApiClient.get(
      process.env.LADBROKES_HOST!,
      process.env.LADBROKES_PENDING_BETS_PATH,
      headers,
    )

    const pendingBets = PendingBetsParser.parse(result.value as any)

    return pendingBets
  }

  async getPendingBetsDetail() : Promise<Array<Bet>> {
    const pendingBets = await new Socket().getPendingBetDetails()
    const betDetailList = await new EventService().getEvents(pendingBets)

    return betDetailList
  }

  async getIncomingMatch() : Promise<Array<Event>> {
    const incomingMatch = await new EventService().getFutureEvents('tennis')

    return incomingMatch
  }
}