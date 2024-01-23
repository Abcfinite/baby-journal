import HttpApiClient from '../../../http-api-client'
import BetCollectionParser from '../parsers/betCollectionParser'
import { Bet } from '../types/responses'

export default class Socket {

  constructor() {
  }

  async getPendingBetDetails() : Promise<Array<Bet>>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': process.env.LADBROKES_BEARER_TOKEN
    }
    const params = {
      method: 'transactionsbyclientidwithfilters',
      'client_id': 'c0616a90-07cd-435c-ac7f-4476857c6c1e',
      'transaction_type_ids': '["3a71227e-727c-4180-984d-87bf92f0f456"]',
      'bet_status_ids': '["6d91cb72-215e-47d1-93d0-e2105db3165c"]',
      'compact_combo_bets': true,
    }
    const httpApiClient = new HttpApiClient()
    const result = await httpApiClient.get(
      process.env.LADBROKES_SOCKET_HOST!,
      process.env.LADBROKES_SOCKET_TRANSACTION_PATH,
      headers,
      params,
    )

    const pendingBets = BetCollectionParser.parse(result.value['data'] as any)

    return pendingBets
  }
}