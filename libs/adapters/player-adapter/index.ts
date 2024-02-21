import _ from "lodash"
import TennisliveClient from '@abcfinite/tennislive-client'
import { getHigherRanking, getRankingDiff, winPercentage, wonL20, beatenByLowerRanking } from './src/utils/comparePlayer';

export default class PlayerAdapter {
  async checkPlayer(player1Name: string, player2Name: string) {

    const tennisLiveClient = new TennisliveClient()
    const player1 = await tennisLiveClient.getPlayer(player1Name)
    const player2 = await tennisLiveClient.getPlayer(player2Name)

    return {
      higherRanking: getHigherRanking(player1, player2),
      rankingDifferent: getRankingDiff(player1, player2),
      winPercentage: winPercentage(player1, player2),
      wonL20: wonL20(player1, player2),
      lostToLowerRanking: beatenByLowerRanking(player1, player2),
      player1: player1,
      player2: player2
    }
  }
}