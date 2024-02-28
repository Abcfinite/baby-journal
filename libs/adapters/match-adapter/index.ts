import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'

export default class MatchAdapter {
  async similarMatch() {
    const compareFileList = await new S3ClientCustom().getFileList('tennis-match-compare')
    const dataFileList = await  new S3ClientCustom().getFileList('tennis-match-data')

    const compareFileJson = await new S3ClientCustom().getFile('tennis-match-compare', compareFileList[0])

    const currrentRankingDifferent = _.get(JSON.parse(compareFileJson), 'rankingDifferent', '')
    let closestDiff = 1000
    let fileNo = null

    await Promise.all(
      dataFileList.map(async (data, idx) => {
        const dataFileJson = await new S3ClientCustom().getFile('tennis-match-data', data)
        const rankingDifferentData = _.get(JSON.parse(dataFileJson), 'rankingDifferent', '')
        if (closestDiff > Math.abs(rankingDifferentData - currrentRankingDifferent)) {
          closestDiff = Math.abs(rankingDifferentData - currrentRankingDifferent)
          fileNo = data
        }
      })
    )

    console.log('>>closestDiff>>', closestDiff)
    console.log('>>fileNo>>', fileNo)
  }
}