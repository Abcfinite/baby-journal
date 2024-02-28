import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { dobToAge } from "./src/utils/conversion"

export default class MatchAdapter {
  async similarMatch() {
    const compareFileList = await new S3ClientCustom().getFileList('tennis-match-compare')
    const dataFileList = await  new S3ClientCustom().getFileList('tennis-match-data')

    const compareFileJson = await new S3ClientCustom().getFile('tennis-match-compare', compareFileList[0])

    const currentRankingDifferent = _.get(JSON.parse(compareFileJson), 'rankingDifferent', '')
    const currentType = _.get(JSON.parse(compareFileJson), 'type', '')

    const player1Age = dobToAge(_.get(JSON.parse(compareFileJson), 'player1.dob', ''))
    const player2Age = dobToAge(_.get(JSON.parse(compareFileJson), 'player2.dob', ''))

    let closestDiff = 1000
    let fileNo = null

    await Promise.all(
      dataFileList.map(async data => {
        const dataFileJson = await new S3ClientCustom().getFile('tennis-match-data', data)
        const rankingDifferentData = _.get(JSON.parse(dataFileJson), 'rankingDifferent', '')
        const type =  _.get(JSON.parse(dataFileJson), 'type', '')
        if (currentType === type && closestDiff > Math.abs(rankingDifferentData - currentRankingDifferent)) {
          closestDiff = Math.abs(rankingDifferentData - currentRankingDifferent)
          fileNo = data
        }
      })
    )

    console.log('>>>>>player1Age : ', player1Age)
    console.log('>>>>>player2Age : ', player2Age)
    console.log('>>closestDiff>>', closestDiff)
    console.log('>>fileNo>>', fileNo)
  }
}