import _ from "lodash"
import { Bet } from "@/types/bet";

export default class BetParser {
  static parse(bodyJson: object): Bet {
    return {
      Id: _.get(bodyJson, 'Id.S', ''),
      EventId: _.get(bodyJson, 'EventId.S', ''),
      Player1: _.get(bodyJson, 'Player1.S', ''),
      Player2: _.get(bodyJson, 'Player2.S', ''),
      Player1Odd: _.get(bodyJson, 'Player1Odd.N'),
      Player2Odd: _.get(bodyJson, 'Player2Odd.N'),
      Tournament: _.get(bodyJson, 'Tournament.S', ''),
      OddCorrect: _.get(bodyJson, 'OddCorrect.BOOL', true),
      Category: _.get(bodyJson, 'Category.S'),
      PlayDateTime: _.get(bodyJson, 'PlayDateTime.N'),
      RatingPlayer1End: _.get(bodyJson, 'RatingPlayer1End.N'),
      RatingPlayer1Start: _.get(bodyJson, 'RatingPlayer1Start.N'),
      RatingPlayer2End: _.get(bodyJson, 'RatingPlayer2End.N'),
      RatingPlayer2Start: _.get(bodyJson, 'RatingPlayer2Start.N'),
      H2hDraw: _.get(bodyJson, 'H2hDraw.N'),
      H2hPlayer1Win: _.get(bodyJson, 'H2hPlayer1Win.N'),
      H2hPlayer2Win: _.get(bodyJson, 'H2hPlayer2Win.N'),
    }
  }
}