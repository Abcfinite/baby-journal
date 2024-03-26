import { Player } from "@abcfinite/tennislive-client/src/types/player";
import PlayerAdapter from "../../../player-adapter";

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

    return [
      p1_v_p1won,
      p2_v_p1won,
      p2_v_p2won,
      p1_v_p2won
    ]

    return {
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
}