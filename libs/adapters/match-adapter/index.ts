import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"
import { Player } from '../../clients/tennislive-client/src/types/player';

export default class MatchAdapter {

  // The historian: looking for similar match in the past.
  // Compare several key variables: ranking different, ranking position,
  // age, type, stage, winning records.
  async similarMatch() {
    const compareFileList = await new S3ClientCustom().getFileList('tennis-match-compare')
    const dataFileList = await  new S3ClientCustom().getFileList('tennis-match-data')

    const compareFileJson = await new S3ClientCustom().getFile('tennis-match-compare', compareFileList[0])
    const jsonData = JSON.parse(compareFileJson)

    const currentRankingDifferent = _.get(jsonData, 'rankingDifferent', '')
    const currentType = _.get(jsonData, 'type', '')

    const player1Age = dobToAge(_.get(jsonData, 'player1.dob', ''))
    const player2Age = dobToAge(_.get(jsonData, 'player2.dob', ''))

    const player1WinFromHigherRankingThanOpponent = _.get(jsonData, 'winFromHigherRankingThanOpponent.player1.number', 0)
    const player2WinFromHigherRankingThanOpponent = _.get(jsonData, 'winFromHigherRankingThanOpponent.player2.number', 0)
    const player1LostToLowerRankingThanOpponent = _.get(jsonData, 'lostToLowerRankingThanOpponent.player1.number', 0)
    const player2LostToLowerRankingThanOpponent = _.get(jsonData, 'lostToLowerRankingThanOpponent.player2.number', 0)
    const player1WL = player1WinFromHigherRankingThanOpponent - player1LostToLowerRankingThanOpponent
    const player2WL = player2WinFromHigherRankingThanOpponent - player2LostToLowerRankingThanOpponent
    const gapplayer1WLplayer2WL = Math.abs(player1WL - player2WL)

    let winClosestDiff = 1000
    let historyGap = 0
    let winFilteredfileNo = []

    await Promise.all(
      dataFileList.map(async data => {
        const dataFileJson = await new S3ClientCustom().getFile('tennis-match-data', data)
        const compareData = JSON.parse(dataFileJson)

        const cPlayer1WinFromHigherRankingThanOpponent = _.get(compareData, 'winFromHigherRankingThanOpponent.player1.number', 0)
        const cPlayer2WinFromHigherRankingThanOpponent = _.get(compareData, 'winFromHigherRankingThanOpponent.player2.number', 0)
        const cPlayer1LostToLowerRankingThanOpponent = _.get(compareData, 'lostToLowerRankingThanOpponent.player1.number', 0)
        const cPlayer2LostToLowerRankingThanOpponent = _.get(compareData, 'lostToLowerRankingThanOpponent.player2.number', 0)
        const cPlayer1WL = cPlayer1WinFromHigherRankingThanOpponent - cPlayer1LostToLowerRankingThanOpponent
        const cPlayer2WL = cPlayer2WinFromHigherRankingThanOpponent - cPlayer2LostToLowerRankingThanOpponent
        const cGapplayer1WLplayer2WL = Math.abs(cPlayer1WL - cPlayer2WL)

        const type =  _.get(compareData, 'type', '')
        if (currentType === type) {

          if (winClosestDiff > Math.abs(gapplayer1WLplayer2WL - cGapplayer1WLplayer2WL)) {
            winClosestDiff = Math.abs(gapplayer1WLplayer2WL - cGapplayer1WLplayer2WL)
            historyGap = cGapplayer1WLplayer2WL
            winFilteredfileNo = []
            winFilteredfileNo.push(data)
          } else if (winClosestDiff === Math.abs(gapplayer1WLplayer2WL - cGapplayer1WLplayer2WL)) {
            winFilteredfileNo.push(data)
          }
        }
      })
    )

    let closestRankingFileNo = '0.json'
    let closestRankingGap = 1000
    await Promise.all(
      winFilteredfileNo.map(async data => {
        const dataFileJson = await new S3ClientCustom().getFile('tennis-match-data', data)
        const compareData = JSON.parse(dataFileJson)
        const rankingDifferentData =  _.get(compareData, 'rankingDifferent', '')

        if (closestRankingGap > Math.abs(rankingDifferentData - currentRankingDifferent)) {
          closestRankingGap = Math.abs(rankingDifferentData - currentRankingDifferent)
          closestRankingFileNo = data
        }
      })
    )

    const player1 = _.get(jsonData, 'player1', '')
    const player2 = _.get(jsonData, 'player2', '')

    return {
      winLoseRanking: {
        player1: player1WL,
        player2: player2WL,
      },
      redFlag: { playedBefore: this.playedBefore(player1, player2) },
      benchmarkPlayer: this.benchmarkPlayer(player1, player2),
      historian: {
        gap: historyGap,
        winLostRankingGap: winClosestDiff,
        fileNo: closestRankingFileNo,
      },
      age: {
        player1: player1Age,
        player2: player2Age,
      },
    }
  }

  // to test : /checkPlayer?player1=Genaro Alberto Olivieri&player2=Francesco Passaro
  playedBefore(player1: Player, player2: Player) {
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

    return {
      player1 : findDuplicates(player1.parsedPreviousMatches.map(p => p.player.name)),
      Player2 : findDuplicates(player2.parsedPreviousMatches.map(p => p.player.name)),
    }
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