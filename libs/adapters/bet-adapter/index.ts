import LadbrokesClient from '@abcfinite/ladbrokes-client';
import { executeScan, putItem } from '@abcfinite/dynamodb-client';
import { Bet } from "./src/types/bet";
import BetParser from './src/parsers/betParser';
import { Summary } from './src/types/summary';
import { category } from '../../clients/ladbrokes-client/src/types/category';

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
            Category: bet.event.category,
            PlayDateTime: bet.event.advertisedStart.getTime(),
          }

          await putItem('Bets', betRecord)
        }
      })
    )
  }

  async getSummary(sport: string) : Promise<Summary>{
    const queryResponse = await executeScan({sport});
    const sportRecords = queryResponse.Items.map(res => BetParser.parse(res))

    let biggestWinningOdd = 0
    sportRecords.map(rec => {
      if (rec.OddCorrect && Math.min(rec.Player2Odd, rec.Player1Odd) > biggestWinningOdd ) {
        biggestWinningOdd = Math.min(rec.Player2Odd, rec.Player1Odd)
      }
    })

    let smallestWinningOdd = 100
    sportRecords.map(rec => {
      if (rec.OddCorrect && Math.min(rec.Player2Odd, rec.Player1Odd) < smallestWinningOdd ) {
        smallestWinningOdd = Math.min(rec.Player2Odd, rec.Player1Odd)
      }
    })

    let biggestWinningOddDiff = 0
    sportRecords.map(rec => {
      if (rec.OddCorrect && Math.abs(rec.Player2Odd - rec.Player1Odd) > biggestWinningOddDiff ) {
        biggestWinningOddDiff = Math.abs(rec.Player2Odd - rec.Player1Odd)
      }
    })

    let smallestWinningOddDiff = 100
    sportRecords.map(rec => {
      if (rec.OddCorrect && Math.abs(rec.Player2Odd - rec.Player1Odd) < smallestWinningOddDiff ) {
        smallestWinningOddDiff = Math.abs(rec.Player2Odd - rec.Player1Odd)
      }
    })

    return {
      biggestWinningOdd,
      smallestWinningOdd,
      biggestWinningOddDiff,
      smallestWinningOddDiff
    }
  }
}