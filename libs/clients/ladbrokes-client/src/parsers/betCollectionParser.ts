import _ from "lodash"
import { Bet } from "../types/responses"

export default class BetCollectionParser {
  static parse(bodyJson: object): Array<Bet> {
    const bets: object[] = _.get(bodyJson, 'bets', [])
    const betLegs: object[] = _.get(bodyJson, 'bet_legs', [])
    const betLegSelections: object[] = _.get(bodyJson, 'bet_leg_selections', [])

    const betCollection: Array<Bet> = Object.entries(bets).map(([key, _value]) => {

      const betLegKey = Object.keys(betLegs).find(legKey => betLegs[legKey]['bet_id'] === key);
      const betLegSelection = Object.entries(betLegSelections).find(([_legSelectionKey, legSelectionValue]) => legSelectionValue['bet_leg_id'] === betLegKey);

      return {
        id: key,
        event: {
          id: betLegSelection[1]['event_id'],
          player1: null,
          player2: null,
          player1Odd: null,
          player2Odd: null,
          tournament: null,
          advertisedStart: null,
        }
      }
    })

    return betCollection
  }
}