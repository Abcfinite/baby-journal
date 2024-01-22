import HttpApiClient from '../http-api-client'
import PendingBetsParser from './src/parsers/pendingBetsParser'
import { PendingBets } from './src/types/responses'

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
}