import { Player } from "@abcfinite/tennislive-client/src/types/player";
import PlayerAdapter from "../../../player-adapter";
import _ from "lodash";

export default class Analysis {
  async previousPlayersBenchmark(player1: Player, player2: Player) {

    const playerLabels = {
      player1: this.playerLabel(player1),
      player2: this.playerLabel(player2)
    }


    /// p1 vs p1 won
    let result = await new PlayerAdapter().matchesSummary(
      player1.name,
      playerLabels.player1.lastWon.player.name,
      1, 1)

    const p1_v_p1won = {
      p1: result.winFromHigherRankingThanOpponent.player1.number - result.lostToLowerRankingThanOpponent.player1.number,
      p1Won: result.winFromHigherRankingThanOpponent.player2.number - result.lostToLowerRankingThanOpponent.player2.number
    }


    /// p2 vs p1 won
    result = await new PlayerAdapter().matchesSummary(
      player2.name,
      playerLabels.player1.lastWon.player.name,
      1, 1)

    const p2_v_p1won = {
      p2: result.winFromHigherRankingThanOpponent.player1.number - result.lostToLowerRankingThanOpponent.player1.number,
      p1Won: result.winFromHigherRankingThanOpponent.player2.number - result.lostToLowerRankingThanOpponent.player2.number
    }

    /// p2 vs p2 won
    result = await new PlayerAdapter().matchesSummary(
      player2.name,
      playerLabels.player2.lastWon.player.name,
      1, 1)

    const p2_v_p2won = {
      p2: result.winFromHigherRankingThanOpponent.player1.number - result.lostToLowerRankingThanOpponent.player1.number,
      p2Won: result.winFromHigherRankingThanOpponent.player2.number - result.lostToLowerRankingThanOpponent.player2.number
    }

    /// p1 vs p2 won
    result = await new PlayerAdapter().matchesSummary(
      player1.name,
      playerLabels.player2.lastWon.player.name,
      1, 1)

    const p1_v_p2won = {
      p1: result.winFromHigherRankingThanOpponent.player1.number - result.lostToLowerRankingThanOpponent.player1.number,
      p2Won: result.winFromHigherRankingThanOpponent.player2.number - result.lostToLowerRankingThanOpponent.player2.number
    }

    return {
      players: {
        p1LastWon: playerLabels.player1.lastWon.player.name,
        p2LastWon: playerLabels.player2.lastWon.player.name
      },
      numbers: {
        p1_v_p1won,
        p2_v_p1won,
        p2_v_p2won,
        p1_v_p2won
      },
    }
  }

  playerLabel(player: Player) {
    const lastWonMatch = player.parsedPreviousMatches.filter(match => match.result === 'win')[0]
    const lastLostMatch = player.parsedPreviousMatches.filter(match => match.result === 'lost')[0]

    return {
      lastWon: lastWonMatch,
      lastLost: lastLostMatch,
    }
  }

  getGap(sportEventAnalysis: {}) {
    const wlP1 = _.get(sportEventAnalysis, 'analysis.winLoseRanking.player1', 0)
    const wlP2 = _.get(sportEventAnalysis, 'analysis.winLoseRanking.player2', 0)

    const gap = Math.abs(wlP1 - wlP2)

    const p1vp1wonp1 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1', 0)
    const p2vp1wonp2 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p2', 0)
    const p2vp2wonp2 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2', 0)
    const p1vp2wonp1 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p1', 0)
    const p1vp1wonp1Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1Won', 0)
    const p2vp1wonp2Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p1Won', 0)
    const p2vp2wonp2Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2Won', 0)
    const p1vp2wonp1Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p2Won', 0)

    var cal1 = (p2vp1wonp2 - p2vp1wonp2Won) - (p1vp1wonp1 - p1vp1wonp1Won)
    var cal2 = (p2vp2wonp2 - p2vp2wonp2Won) - (p1vp2wonp1 - p1vp2wonp1Won)

    if (wlP1 > wlP2) {
      cal1 = (p1vp1wonp1 - p1vp1wonp1Won) - (p2vp1wonp2 - p2vp1wonp2Won)
      cal2 = (p1vp2wonp1 - p1vp2wonp1Won) - (p2vp2wonp2 - p2vp2wonp2Won)
    }

    var gapCal1 = cal1 < 0 ? cal1 - gap : gap - cal1
    var gapCal2 = cal2 < 0 ? cal2 - gap : gap - cal2

    const result = gapCal1 > gapCal2 ? gapCal2 : gapCal1

    return result
  }
}