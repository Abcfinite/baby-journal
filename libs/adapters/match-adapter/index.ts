import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"

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

    console.log('>>>player1 win lose :', player1WL)
    console.log('>>>player2 win lose :', player2WL)
    console.log('>>>>>player1Age : ', player1Age)
    console.log('>>>>>player2Age : ', player2Age)
    console.log('>>historyGap>>', historyGap)
    console.log('>>winClosestDiff>>', winClosestDiff)
    console.log('>>closestRankingFileNo>>', closestRankingFileNo)
    console.log('>>closestRankingFileNo>>', closestRankingFileNo)
  }
}