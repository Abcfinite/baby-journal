import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"
import { Player } from '../../clients/tennislive-client/src/types/player';
import PlayerAdapter from '../player-adapter/index';
import Analysis from "./src/utils/analysis";

export default class MatchAdapter {

  async similarMatch(playerDetail: object) {

    const player1Age = dobToAge(_.get(playerDetail, 'player1.dob', ''))
    const player2Age = dobToAge(_.get(playerDetail, 'player2.dob', ''))

    const player1WinFromHigherRankingThanOpponent = _.get(playerDetail, 'winFromHigherRankingThanOpponent.player1.number', 0)
    const player2WinFromHigherRankingThanOpponent = _.get(playerDetail, 'winFromHigherRankingThanOpponent.player2.number', 0)

    const player1LostToLowerRankingThanOpponent = _.get(playerDetail, 'lostToLowerRankingThanOpponent.player1.number', 0)
    const player2LostToLowerRankingThanOpponent = _.get(playerDetail, 'lostToLowerRankingThanOpponent.player2.number', 0)

    const player1WL = player1WinFromHigherRankingThanOpponent - player1LostToLowerRankingThanOpponent
    const player2WL = player2WinFromHigherRankingThanOpponent - player2LostToLowerRankingThanOpponent

    const player1 = _.get(playerDetail, 'player1', {}) as Player
    const player2 = _.get(playerDetail, 'player2', {}) as Player

    const analysisResult = {
      winLoseRanking: {
        player1: player1WL,
        player2: player2WL,
      },
      similarOpponent: this.similarOpponent(player1, player2),
      highLowRanking: this.highLowRanking(player1, player2),
      betAgainstOdd: {
        nonFavPlayerWonToHigherLevelThanFav: this.nonFavPlayerWonToHigherLevelThanFav(playerDetail)
      },
      redFlag: {
        doNotBet: {
          favPlayerLostToLowerLevelThanNonFav: this.favHasLostToLowerRankingThanOpponent(playerDetail)
        },
        justLostFromLowerRanking: this.justLostFromLowerRanking(playerDetail),
      },
      yellowFlag: {
        playedBefore: this.playedBefore(player1, player2),
        manualCheck: [
          'retired InTheLast 60 days',
          'non fav highest ranking is top 20'
        ]
      },
      benchmarkPlayer: {
        bothPlayed: this.benchmarkPlayer(player1, player2),
        previousPlayers: await new Analysis().previousPlayersBenchmark(player1, player2),
      },
      age: {
        player1: player1Age,
        player2: player2Age,
      },
    }

    analysisResult['gap'] = new Analysis().getGap(analysisResult)

    return analysisResult
  }

  similarOpponent(player1: Player, player2: Player) {
    var player1AvgRanking = this.avgRanking(player1.currentRanking, player1.highestRanking)
    var player2AvgRanking = this.avgRanking(player2.currentRanking, player2.highestRanking)
    var p1prevMatches = []
    var p2prevMatches = []

    player1.parsedPreviousMatches.forEach(pm => {
      pm['avg_ranking_gap'] = Math.abs(player2AvgRanking - this.avgRanking(pm.player.currentRanking, pm.player.highestRanking))
      p1prevMatches.push(pm)
    })

    player2.parsedPreviousMatches.forEach(pm => {
      pm['avg_ranking_gap'] = Math.abs(player1AvgRanking - this.avgRanking(pm.player.currentRanking, pm.player.highestRanking))
      p2prevMatches.push(pm)
    })

    const p1Sorted = p1prevMatches.sort((a, b) => {
      return a['avg_ranking_gap'] - b['avg_ranking_gap']
    })

    const p2Sorted = p2prevMatches.sort((a, b) => {
      return a['avg_ranking_gap'] - b['avg_ranking_gap']
    })

    return {
      player1: p1Sorted[0],
      player2: p2Sorted[0]
    }
  }

  avgRanking(currentRanking: number, highestRanking: number) {
    return currentRanking + ((currentRanking + highestRanking)/2)
  }

  // to test : /checkPlayer?player1=Genaro Alberto Olivieri&player2=Francesco Passaro
  playedBefore(player1: Player, player2: Player) {
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

    return {
      player1 : findDuplicates(player1.parsedPreviousMatches.map(p => p.player.name)),
      Player2 : findDuplicates(player2.parsedPreviousMatches.map(p => p.player.name)),
    }
  }

  justLostFromLowerRanking(playerDetail: object) {
    const p1LostToLowerRanking = _.get(playerDetail, 'lostToLowerRanking.player1.order', [])
    const p2LostToLowerRanking = _.get(playerDetail, 'lostToLowerRanking.player2.order', [])

    return {
      player1: p1LostToLowerRanking.includes(0) || p1LostToLowerRanking.includes(1),
      player2: p2LostToLowerRanking.includes(0) || p2LostToLowerRanking.includes(1)
    }
  }

  highLowRanking(player1: Player, player2: Player) {
    const p1Lost = _.get(player1, 'parsedPreviousMatches', []).filter(pm => pm.result === 'lost')
    const p2Lost = _.get(player2, 'parsedPreviousMatches', []).filter(pm => pm.result === 'lost')
    const p1Win = _.get(player1, 'parsedPreviousMatches', []).filter(pm => pm.result === 'win')
    const p2Win = _.get(player2, 'parsedPreviousMatches', []).filter(pm => pm.result === 'win')

    return {
      player1: {
        ranking: player1.currentRanking,
        lostLowest: Math.max(...p1Lost.map(pm => pm.player.currentRanking)),
        winHighest: Math.min(...p1Win.map(pm => pm.player.currentRanking))
      },
      player2: {
        ranking: player2.currentRanking,
        lostLowest: Math.max(...p2Lost.map(pm => pm.player.currentRanking)),
        winHighest: Math.min(...p2Win.map(pm => pm.player.currentRanking))
      },
      rankingDiff: Math.abs(player1.currentRanking - player2.currentRanking),
    }
  }

  nonFavPlayerWonToHigherLevelThanFav(playerDetail: object) {
    const p1WinToHigherRankingThanOpponent = _.get(playerDetail, 'winFromHigherRankingThanOpponent.player1.number', 0)
    const p2WinToHigherRankingThanOpponent = _.get(playerDetail, 'winFromHigherRankingThanOpponent.player2.number', 0)
    const player1Odd = _.get(playerDetail, 'odds.player1', 0)
    const player2Odd = _.get(playerDetail, 'odds.player2', 0)

    return (player1Odd > player2Odd && p1WinToHigherRankingThanOpponent > 0) ||
      (player2Odd > player1Odd && p2WinToHigherRankingThanOpponent > 0)
  }

  favHasLostToLowerRankingThanOpponent(playerDetail: object) {
    const p1LostToLowerRankingThanOpponent = _.get(playerDetail, 'lostToLowerRankingThanOpponent.player1.number', 0)
    const p2LostToLowerRankingThanOpponent = _.get(playerDetail, 'lostToLowerRankingThanOpponent.player2.number', 0)
    const player1Odd = _.get(playerDetail, 'odds.player1', 0)
    const player2Odd = _.get(playerDetail, 'odds.player2', 0)

    return (player1Odd < player2Odd && p1LostToLowerRankingThanOpponent > 0) ||
      (player2Odd < player1Odd && p2LostToLowerRankingThanOpponent > 0)
  }

  benchmarkPlayer(player1: Player, player2: Player) {
    const p1names = player1.parsedPreviousMatches.map(p => p.player.name)
    const p2names = player2.parsedPreviousMatches.map(p => p.player.name)
    let intersection = p1names.filter(x => p2names.includes(x));

    return intersection
  }

  async analyzeAge(isATP: boolean = true) {
    const winningAge = {}
    const losingAge = {}
    const matchType = isATP ? 'atp' : 'wta'
    const dataFileList = await  new S3ClientCustom().getFileList('tennis-match-data')

    await Promise.all(
      dataFileList.map(async data => {

        console.log('>>data>>', data)

        const dataFile = await new S3ClientCustom().getFile('tennis-match-data', data) as any
        const dataFileJson = JSON.parse(dataFile)
        if (_.get(dataFileJson, 'type', '') === matchType ) {
          const player1Age = dobToAge(_.get(dataFileJson, 'player1.dob', ''))
          const player2Age = dobToAge(_.get(dataFileJson, 'player2.dob', ''))
          const winningPlayer = _.get(dataFileJson, 'winner', 0)

          if (winningPlayer === 1) {
            const wonNumber = winningAge[player1Age] || 0
            const lostNumber = winningAge[player2Age] || 0
            winningAge[player1Age] = wonNumber + 1
            losingAge[player2Age] = lostNumber + 1
          } else {
            const wonNumber = winningAge[player2Age] || 0
            const lostNumber = winningAge[player1Age] || 0
            winningAge[player2Age] = wonNumber + 1
            losingAge[player1Age] = lostNumber + 1
          }
        }
      })
    )

    const result = {
      winningAge,
      losingAge
    }
    console.log(result)

    return result
  }
}