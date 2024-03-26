import { Player } from "@abcfinite/tennislive-client/src/types/player";

export default class Analysis {
  previousPlayersBenchmark(player1: Player, player2: Player) {

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