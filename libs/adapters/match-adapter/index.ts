import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"
import { Player } from '../../clients/tennislive-client/src/types/player';

export default class MatchAdapter {

  // The historian: looking for similar match in the past.
  // Compare several key variables: ranking different, ranking position,
  // age, type, stage, winning records.
  async similarMatch(playerDetail: object) {
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
    const player1WinFromHigherRanking = _.get(jsonData, 'winfromHigherRanking.player1.number', 0)
    const player2WinFromHigherRanking = _.get(jsonData, 'winfromHigherRanking.player2.number', 0)
    const player1LostToLowerRankingThanOpponent = _.get(jsonData, 'lostToLowerRankingThanOpponent.player1.number', 0)
    const player2LostToLowerRankingThanOpponent = _.get(jsonData, 'lostToLowerRankingThanOpponent.player2.number', 0)
    const player1LostToLowerRanking = _.get(jsonData, 'lostToLowerRanking.player1.number', 0)
    const player2LostToLowerRanking = _.get(jsonData, 'lostToLowerRanking.player2.number', 0)

    const player1WL = player1WinFromHigherRankingThanOpponent - player1LostToLowerRankingThanOpponent
    const player2WL = player2WinFromHigherRankingThanOpponent - player2LostToLowerRankingThanOpponent

    let winFilteredfileNo = []

    await Promise.all(
      dataFileList.map(async data => {
        const dataFileJson = await new S3ClientCustom().getFile('tennis-match-data', data)
        const compareData = JSON.parse(dataFileJson)

        const cPlayer1WinFromHigherRankingThanOpponent = _.get(compareData, 'winFromHigherRankingThanOpponent.player1.number', 0)
        const cPlayer2WinFromHigherRankingThanOpponent = _.get(compareData, 'winFromHigherRankingThanOpponent.player2.number', 0)
        const cPlayer1WinFromHigherRanking = _.get(compareData, 'winfromHigherRanking.player1.number', 0)
        const cPlayer2WinFromHigherRanking = _.get(compareData, 'winfromHigherRanking.player2.number', 0)
        const cPlayer1LostToLowerRankingThanOpponent = _.get(compareData, 'lostToLowerRankingThanOpponent.player1.number', 0)
        const cPlayer2LostToLowerRankingThanOpponent = _.get(compareData, 'lostToLowerRankingThanOpponent.player2.number', 0)
        const cPlayer1LostToLowerRanking = _.get(compareData, 'lostToLowerRanking.player1.number', 0)
        const cPlayer2LostToLowerRanking = _.get(compareData, 'lostToLowerRanking.player2.number', 0)

        const winFromHigherRankingTO = (player1WinFromHigherRankingThanOpponent === cPlayer1WinFromHigherRankingThanOpponent &&
          player2WinFromHigherRankingThanOpponent === cPlayer2WinFromHigherRankingThanOpponent) ||
            (player1WinFromHigherRankingThanOpponent === cPlayer2WinFromHigherRankingThanOpponent &&
              player2WinFromHigherRankingThanOpponent === cPlayer1WinFromHigherRankingThanOpponent)
        // const winFromHigherRanking = (player1WinFromHigherRanking === cPlayer1WinFromHigherRanking &&
        //   cPlayer2WinFromHigherRanking === player2WinFromHigherRanking) || (
        //     player1WinFromHigherRanking === cPlayer2WinFromHigherRanking &&
        //       player2WinFromHigherRanking === cPlayer1WinFromHigherRanking )
        const lostFromLowerRankingTO = ( player1LostToLowerRankingThanOpponent === cPlayer1LostToLowerRankingThanOpponent &&
          player2LostToLowerRankingThanOpponent === cPlayer2LostToLowerRankingThanOpponent ) || ( player1LostToLowerRankingThanOpponent === cPlayer2LostToLowerRankingThanOpponent &&
            player2LostToLowerRankingThanOpponent === cPlayer1LostToLowerRankingThanOpponent )
        // const lostToLowerRankingTO = ( player1LostToLowerRanking === cPlayer1LostToLowerRanking && player2LostToLowerRanking === cPlayer1LostToLowerRanking) ||
        // ( player2LostToLowerRanking === cPlayer1LostToLowerRanking && player1LostToLowerRanking === cPlayer2LostToLowerRanking)

        const type =  _.get(compareData, 'type', '')
        if (currentType === type && winFromHigherRankingTO && lostFromLowerRankingTO) {
        // if (currentType === type && winFromHigherRankingTO && winFromHigherRanking && lostFromLowerRankingTO && lostToLowerRankingTO) {
          winFilteredfileNo.push(data)
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
      redFlag: {
        playedBefore: this.playedBefore(player1, player2),
        justLostFromLowerRanking: this.justLostFromLowerRanking(playerDetail),
        startWith0: player1WL === 0 || player2WL === 0,
        manualCheck: [
          'retired InTheLast 60 days'
        ]
      },
      benchmarkPlayer: this.benchmarkPlayer(player1, player2),
      historian: {
        fileNo: winFilteredfileNo,
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

  justLostFromLowerRanking(playerDetail: object) {
    const p1LostToLowerRanking = _.get(playerDetail, 'lostToLowerRanking.player1.order', [])
    const p2LostToLowerRanking = _.get(playerDetail, 'lostToLowerRanking.player2.order', [])

    return {
      player1: p1LostToLowerRanking.includes(0) || p1LostToLowerRanking.includes(1),
      player2: p2LostToLowerRanking.includes(0) || p2LostToLowerRanking.includes(1)
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