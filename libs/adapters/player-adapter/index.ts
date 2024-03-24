import _ from "lodash"
import TennisliveClient from '@abcfinite/tennislive-client'
import S3ClientCustom from '@abcfinite/s3-client-custom'
import MatchAdapter from '@abcfinite/match-adapter'
import { Player } from '../../clients/tennislive-client/src/types/player';
import { getHigherRanking, getRankingDiff,
  winPercentage, wonL20, wonL10, wonL5, lostToLowerRanking,
  lostToLowerRankingThanOpponent, winFromHigherRankingThanOpponent,
  winfromHigherRanking } from './src/utils/comparePlayer';

export default class PlayerAdapter {
  async checkPlayer(player1Name: string, player2Name: string, player1Odd: number, Player2Odd: number) {

    const result = await this.matchesSummary(player1Name, player2Name, player1Odd, Player2Odd)

    result.analysis = await new MatchAdapter().similarMatch(result)

    return result
  }

  async matchesSummary(player1Name: string, player2Name: string, player1Odd: number, Player2Odd: number) {

    const tennisLiveClient = new TennisliveClient()
    const player1 = await tennisLiveClient.getPlayer(player1Name)
    const player2 = await tennisLiveClient.getPlayer(player2Name)

    const date = new Date();
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const result = {
      stage: '',
      type: player1.type,
      date: formattedDate,
      analysis: {},
      higherRanking: getHigherRanking(player1, player2),
      rankingDifferent: getRankingDiff(player1, player2),
      winPercentage: winPercentage(player1, player2),
      wonL5: wonL5(player1, player2),
      wonL10: wonL10(player1, player2),
      wonL20: wonL20(player1, player2),
      lostToLowerRanking: lostToLowerRanking(player1, player2),
      lostToLowerRankingThanOpponent: lostToLowerRankingThanOpponent(player1, player2),
      winfromHigherRanking: winfromHigherRanking(player1, player2),
      winFromHigherRankingThanOpponent: winFromHigherRankingThanOpponent(player1, player2),
      odds: {
        player1: player1Odd,
        player2: Player2Odd
      },
      player1: player1,
      player2: player2
    }

    return result
  }
}