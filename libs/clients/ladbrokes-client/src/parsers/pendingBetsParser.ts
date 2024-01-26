import _ from "lodash";
import { PendingBets } from "../types/responses";

export default class PendingBetsParser {
  static parse(bodyJson: object): PendingBets {
    const pendingBetCounts: number = _.get(bodyJson, 'pending_bet_count')

    return {
      pendingBetCounts
    }
  }
}