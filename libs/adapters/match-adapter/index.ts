import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"
import { Player } from '../../clients/tennislive-client/src/types/player';
import PlayerAdapter from '../player-adapter/index';
import Analysis from "./src/utils/analysis";
import { Match } from "@abcfinite/tennislive-client/src/types/match";

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

    // const wlScore = this.winLoseScore(player1, player2)
    const winLoseRanking = {
      player1: player1WL,
      player2: player2WL,
    }

    const analysisResult = {
      winLoseRanking: winLoseRanking,
      winLoseScore: this.winLoseScore(player1, player2),,
      // knn: await new Analysis().knn(player1, player2, wlScore, winLoseRanking),
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

  winLoseScore(player1: Player, player2: Player) {
    return {
      player1: this.wlScore(player1),
      player2: this.wlScore(player2),
    }
  }

  wlScore(player: Player) {
    const playerAvgRanking = Analysis.avgRanking(player.currentRanking, player.highestRanking)
    var pScore = 0
    player.parsedPreviousMatches.slice(0,9).forEach((pm, index) => {

      var matchScore = 0
      if (pm.result === 'win') {
        if(pm.player.currentRanking > player.currentRanking) {
          matchScore = 2
        } else {
          matchScore = 1
        }

        matchScore = matchScore * this.stageMultiplier(pm, true)
      } else {
        if(pm.player.currentRanking > player.currentRanking) {
          matchScore = 1
        } else {
          matchScore = 2
        }

        matchScore = matchScore * this.stageMultiplier(pm, true)
      }

      pScore = pScore + matchScore
    })

    return pScore
  }

  stageMultiplier(match: Match, won: boolean) : number {
    switch(match.stage) {
      case 'q 2' :
        return won ? 2 : 9
      case 'qual.' :
        return won ? 3 : 8
      case '1st round' :
        return won ? 4 : 7
      case '2nd round' :
        return won ? 5 : 6
      case '3rd round' :
        return won ? 6 : 5
      case '4tth round' :
        return won ? 7 : 4
      case '1/4' :
        return won ? 8 : 3
      case '1/2' :
        return won ? 9 : 2
      case 'fin' :
        return won ? 10 : 1
    }

    return won ? 1 : 10
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
    let uIntersection = Array.from(new Set(intersection))

    const p1Win = _.get(player1, 'parsedPreviousMatches', []).filter(pm => uIntersection.includes(pm.player.name) && pm.result === 'win')
    const p2Win = _.get(player2, 'parsedPreviousMatches', []).filter(pm => uIntersection.includes(pm.player.name) && pm.result === 'win')

    return {
      names: intersection,
      player1Score: p1Win.length ,
      player2Score: p2Win.length,
      total: uIntersection.length
    }
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