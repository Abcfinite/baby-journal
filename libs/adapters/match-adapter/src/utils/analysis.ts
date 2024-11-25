import { Player } from "@abcfinite/tennislive-client/src/types/player";
import _ from "lodash";
import S3ClientCustom from "@abcfinite/s3-client-custom";

export default class Analysis {
  playerLabel(player: Player) {
    const lastWonMatch = player.parsedPreviousMatches.filter(match => match.result === 'win')[0]
    const lastLostMatch = player.parsedPreviousMatches.filter(match => match.result === 'lost')[0]

    return {
      lastWon: lastWonMatch,
      lastLost: lastLostMatch,
    }
  }

  async knn(player1: Player, player2: Player, players: {}, wlRanking: {}) {
    const finishedHtmlfileList = await new S3ClientCustom().getFileList('tennis-match-finished')

    const isPlayer1AvgRankingHigher = Analysis.avgRanking(player1.currentRanking, player1.highestRanking) >
      Analysis.avgRanking(player2.currentRanking, player2.highestRanking)
    const isPlayer1WlRankingHigher = wlRanking['player1'] > wlRanking['player2']

    const distances = await Promise.all(
      finishedHtmlfileList.map(async file => {
        const content = await new S3ClientCustom().getFile('tennis-match-finished', file)
        const contentJson = JSON.parse(content)

        let distance = 1000000

        let correctWlRanking = false
        if (contentJson['analysis'] !== null && contentJson['analysis'] !== undefined) {
          const p1Gap = Math.abs(players['player-1'] - contentJson['analysis']['winLoseScore']['player-1'])
          const p2Gap = Math.abs(players['player-2'] - contentJson['analysis']['winLoseScore']['player-2'])
          distance = Math.hypot(p1Gap, p2Gap)

          correctWlRanking = contentJson['analysis']['winLoseRanking']['player1'] < contentJson['analysis']['winLoseRanking']['player2']
          if (isPlayer1WlRankingHigher) {
            correctWlRanking = contentJson['analysis']['winLoseRanking']['player1'] > contentJson['analysis']['winLoseRanking']['player2']
          }
        }

        let correctRanking = Analysis.avgRanking(contentJson['player1']['currentRanking'], contentJson['player1']['highestRanking']) <
          Analysis.avgRanking(contentJson['player2']['currentRanking'], contentJson['player2']['highestRanking'])
        if (isPlayer1AvgRankingHigher) {
          correctRanking = Analysis.avgRanking(contentJson['player1']['currentRanking'], contentJson['player1']['highestRanking']) >
            Analysis.avgRanking(contentJson['player2']['currentRanking'], contentJson['player2']['highestRanking'])
        }

        return { id: file, distance: distance, correctRanking: correctRanking, correctWlRanking: correctWlRanking }
      })
    )

    return distances.filter(dis => dis.correctRanking === true && dis.correctWlRanking === true).sort((a, b) => {
      return a.distance - b.distance
    }).splice(0, 3)
  }

  static avgRanking(currentRanking: number, highestRanking: number) {
    return highestRanking + ((currentRanking - highestRanking) / 4)
  }
}