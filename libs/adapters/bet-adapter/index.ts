import LadbrokesClient from '@abcfinite/ladbrokes-client';
import { executeQuery, putItem } from '@abcfinite/dynamodb-client';
import { Bet } from "./src/types/bet";

export default class BetAdapter {
  constructor() {
  }

  async logBets() {
    const pendingBetDetails = await new LadbrokesClient().getPendingBetsDetail()

    Promise.all(
      pendingBetDetails.map(async bet => {

        if (bet.event) {
          const betRecord: Bet = {
            Id: bet.id,
            EventId: bet.event.id,
            Player1: bet.event.player1,
            Player2: bet.event.player2,
            Player1Odd: bet.event.player1Odd,
            Player2Odd: bet.event.player2Odd,
            Tournament: bet.event.tournament,
            OddCorrect: true,
            Category: 'tennis',
            PlayDateTime: bet.event.advertisedStart.getTime(),
            RatingPlayer1End: 0,
            RatingPlayer1Start: 0
          }

          await putItem('Bets', betRecord)
        }
      })
    )
  }

  async getVolleyBallMetrics() {
    const queryResponse = await executeQuery();

    console.log('>>>>>queryResponse')
    console.log(queryResponse)

    return queryResponse
  }
}