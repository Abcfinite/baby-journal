import _ from "lodash"
import LadbrokesClient from '@abcfinite/ladbrokes-client'
import { executeScan, putItem, countTable } from '@abcfinite/dynamodb-client'
import { Bet } from "./src/types/bet"
import { EventRecord } from "./src/types/eventRecord"
import BetParser from './src/parsers/betParser'
import { Summary } from './src/types/summary'
import SportsradarClient from '../../clients/sportsradar-client/index';

export default class BetAdapter {
  static favOddSet = [
    [1, 1.05], //0
    [1.05, 1.1], //1
    [1.1, 1.15], //2
    [1.15, 1.2], //3
    [1.2, 5], //4
  ]

  static nonFavOddSet = [
    [1, 5], //0
    [5, 6], //1
    [6, 7], //2
    [7, 8], //3
    [8, 9], //4
    [9, 10], //5
    [10, 11], //6
    [11, 12], //7
    [13, 100], //8
  ]
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

  async logEvents() {
    const allEventDetails = await new LadbrokesClient().getIncomingMatch()

    Promise.all(
      allEventDetails.map(async event => {
        const eventRecord: EventRecord = {
          Id: event.id,
          Player1: event.player1,
          Player2: event.player2,
          Player1Odd: event.player1Odd,
          Player2Odd: event.player2Odd,
          Tournament: event.tournament,
          OddCorrect: true,
          Category: event.category,
          PlayDateTime: event.advertisedStart.getTime(),
        }

        await putItem('Events', eventRecord)
      })
    )
  }

  async logEvent() {
    const eventDetail = await new SportsradarClient().getEvent

    return eventDetail
  }

  async getSummary(sport: string) : Promise<Summary> {
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

    const scannedCount = _.get(queryResponse, 'ScannedCount', 0)

    return {
      biggestWinningOdd,
      smallestWinningOdd,
      biggestWinningOddDiff,
      smallestWinningOddDiff,
      oddsPercentage: this.oddsPercentageCollection(queryResponse.Items),
      scannedCount
    }
  }

  async betTableTotalNumber() : Promise<number> {
    const countResponse = await countTable()
    return countResponse.Count
  }

  oddsPercentageCollection(betHistory: Array<object>) : object {
    const correctOddBets = betHistory.filter(bet => _.get(bet, 'OddCorrect.BOOL') == true )
    const wrongOddBets = betHistory.filter(bet => _.get(bet, 'OddCorrect.BOOL') == false )

    const correctOddMatrix = this.getMatrix(correctOddBets)
    const wrongOddMatrix = this.getMatrix(wrongOddBets)

    const matrix = this.processMatrix(correctOddMatrix, wrongOddMatrix)
    console.log('>>>>matrix')
    console.log(matrix)

    return {
      correct_odd_bets: correctOddBets.length,
      wrong_odd_bets: wrongOddBets.length,
      matrix: matrix
    }
  }

  processMatrix(correctOddMatrix: Array<Array<number>>,
    wrongOddMatrix: Array<Array<number>>) : Array<Array<number>> {

    var matrix = [];
    for(var i = 0; i <= 4; ++i) {
      matrix[i] = []
      for(var j = 0; j <= 8; ++j) {
        matrix[i][j] = correctOddMatrix[i][j] / (correctOddMatrix[i][j] + wrongOddMatrix[i][j])
      }
    }

    return matrix
  }

  getMatrix(betHistory: Array<object>) : Array<Array<number>> {
    var totalBet = 0

    var matrix = [];
    for(var i = 0; i <= BetAdapter.favOddSet.length; ++i) {
      matrix[i] = [ ];
      for(var j = 0; j <= BetAdapter.nonFavOddSet.length ; ++j) {
        matrix[i][j] = 0; // a[i] is now an array so this works.
      }
    }

    for (var x = 0; x < betHistory.length; x++) {
      const player1Odd = _.get(betHistory[x], 'Player1Odd.N', 0)
      const player2Odd = _.get(betHistory[x], 'Player2Odd.N', 0)
      let favOdd = 0
      let nonFavOdd = 0
      let favOddLocation = 0
      let nonFavOddLocation = 0

      if(player1Odd > player2Odd) {
        favOdd = player2Odd
        nonFavOdd = player1Odd
      } else {
        favOdd = player1Odd
        nonFavOdd = player2Odd
      }

      for (var i = 0; i < BetAdapter.favOddSet.length; i++) {
        if (favOdd > BetAdapter.favOddSet[i][0] && favOdd <= BetAdapter.favOddSet[i][1]) {
          favOddLocation = i
          break
        }
      }

      for (var i = 0; i < BetAdapter.nonFavOddSet.length; i++) {
        if (nonFavOdd > BetAdapter.nonFavOddSet[i][0] && nonFavOdd <= BetAdapter.nonFavOddSet[i][1]) {
          nonFavOddLocation = i
          break
        }
      }

      matrix[favOddLocation][nonFavOddLocation] = matrix[favOddLocation][nonFavOddLocation] + 1
      totalBet++
    }

    return matrix
  }
}