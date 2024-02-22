import HttpApiClient from '@abcfinite/http-api-client'
import BetCollectionParser from '../parsers/betCollectionParser'
import { Bet } from '../types/responses'

export default class Socket {

  constructor() {
  }

  async getPendingBetDetails() : Promise<Array<Bet>>{
    console.log('>>>>>getPendingBetDetails>>>1')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': process.env.LADBROKES_BEARER_TOKEN
    }

    console.log('>>>>>getPendingBetDetails>>>2')
    const params = {
      method: 'transactionsbyclientidwithfilters',
      'client_id': 'c0616a90-07cd-435c-ac7f-4476857c6c1e',
      'transaction_type_ids': '["3a71227e-727c-4180-984d-87bf92f0f456"]',
      'bet_status_ids': '["6d91cb72-215e-47d1-93d0-e2105db3165c"]',
      'compact_combo_bets': true,
    }

    console.log('>>>>>getPendingBetDetails>>>3')
    const httpApiClient = new HttpApiClient()
    const result = await httpApiClient.get(
      process.env.LADBROKES_SOCKET_HOST!,
      process.env.LADBROKES_SOCKET_TRANSACTION_PATH,
      headers,
      params,
    )

    console.log('>>>>>getPendingBetDetails>>>4')
    const pendingBets = BetCollectionParser.parse(result.value!['data'] as any)
    console.log('>>>>>getPendingBetDetails>>>5')

    return pendingBets
  }
}