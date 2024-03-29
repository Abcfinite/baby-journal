import _ from "lodash"
import { putItem } from '@abcfinite/dynamodb-client'
import S3ClientCustom from '@abcfinite/s3-client-custom'
import TennisliveClient from '@abcfinite/tennislive-client'
import { Player } from '../../clients/tennislive-client/src/types/player'
import { SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent"
import PlayerAdapter from '@abcfinite/player-adapter'

export default class ScheduleAdapter {
  async getSchedule() {
    const sportEvents = await new TennisliveClient().getSchedule()

    const fileList = await new S3ClientCustom().getFileList('tennis-match-schedule')

    const fileListIds = fileList.map(file => file.replace('.json', ''))
    const sportEventIds = sportEvents.map(se => se.id)
    const sportEventIdsNotCheckedYet = sportEventIds.filter(id => !fileListIds.includes(id))

    // get first sportEvent that not checked
    const sportEventsNeedCheck = sportEvents.filter(spe => sportEventIdsNotCheckedYet.includes(spe.id))

    console.log('>>>>sportEventsNeedCheck>>>',sportEventsNeedCheck.length)

    var result

    if (sportEventsNeedCheck.length == 0) {
      const fileContent = []
      await Promise.all(
        fileList.map( async file => {
          const content = await new S3ClientCustom().getFile('tennis-match-schedule', file)
          fileContent.push(JSON.parse(content))
        })
      )

      const sorted = fileContent.sort((a,b) => {
        const a_p1vp1wonP1 =  _.get(a, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1', 0)
        const a_p2vp1wonP2 =  _.get(a, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p2', 0)
        const a_p2vp2wonP2 =  _.get(a, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2', 0)
        const a_p1vp2wonP1 =  _.get(a, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p1', 0)


        const b_p1vp1wonP1 =  _.get(b, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1', 0)
        const b_p2vp1wonP2 =  _.get(b, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p2', 0)
        const b_p2vp2wonP2 =  _.get(b, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2', 0)
        const b_p1vp2wonP1 =  _.get(b, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p1', 0)

        const aCal = (Math.abs(a_p1vp1wonP1 - a_p2vp1wonP2) + Math.abs(a_p2vp2wonP2 - a_p1vp2wonP1)) / 2
        const bCal = (Math.abs(b_p1vp1wonP1 - b_p2vp1wonP2) + Math.abs(b_p2vp2wonP2 - b_p1vp2wonP1)) / 2

        return bCal - aCal
      })

      return sorted.filter(e =>
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p2', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p1', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1Won', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p1Won', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2Won', 0) !== 0 &&
        _.get(e, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p2Won', 0) !== 0
      )

    } else {
      try {
        result = await new PlayerAdapter().checkPlayerObject(
          sportEventsNeedCheck[0].player1, sportEventsNeedCheck[0].player2)

        await new S3ClientCustom()
          .putFile('tennis-match-schedule',
            sportEventsNeedCheck[0].id+'.json',
            JSON.stringify(result))
      } catch(ex) {
        result = 'error'
        await new S3ClientCustom()
          .putFile('tennis-match-schedule',
            sportEventsNeedCheck[0].id+'.json',
            JSON.stringify('{}'))
      }
    }

    return result
  }
}