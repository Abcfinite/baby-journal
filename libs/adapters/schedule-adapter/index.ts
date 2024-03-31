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

    // if (sportEventsNeedCheck.length == 0) {
      const fileContent = []
      await Promise.all(
        fileList.map( async file => {
          const content = await new S3ClientCustom().getFile('tennis-match-schedule', file)
          fileContent.push(JSON.parse(content))
        })
      )

      const filtered = fileContent.filter(e => {
        const wlP1 = _.get(e, 'analysis.winLoseRanking.player1', 0)
        const wlP2 = _.get(e, 'analysis.winLoseRanking.player2', 0)

        return wlP1 !== wlP2
      })


      const sorted = filtered.sort((a,b) => {
        // var gapA = this.getGap(a)
        // var gapB = this.getGap(b)
        // console.log('>>>>>gapA>>>', gapA)
        // console.log('>>>>>gapB>>>', gapB)
        return this.getGap(b) - this.getGap(a)
      })

      sorted.map(s => {
        console.log('>>>>gap>>>', s.gap)
      })

      return sorted
    // }
    // else {
    //   try {
    //     result = await new PlayerAdapter().checkPlayerObject(
    //       sportEventsNeedCheck[0].player1, sportEventsNeedCheck[0].player2)

    //     await new S3ClientCustom()
    //       .putFile('tennis-match-schedule',
    //         sportEventsNeedCheck[0].id+'.json',
    //         JSON.stringify(result))
    //   } catch(ex) {
    //     result = 'error'
    //     await new S3ClientCustom()
    //       .putFile('tennis-match-schedule',
    //         sportEventsNeedCheck[0].id+'.json',
    //         JSON.stringify('{}'))
    //   }
    // }

    // return result
  }

  getGap(sportEventAnalysis: {}) {
    const wlP1 = _.get(sportEventAnalysis, 'analysis.winLoseRanking.player1', 0)
    const wlP2 = _.get(sportEventAnalysis, 'analysis.winLoseRanking.player2', 0)

    const gap = Math.abs(wlP1 - wlP2)

    const p1vp1wonp1 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1', 0)
    const p2vp1wonp2 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p2', 0)
    const p2vp2wonp2 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2', 0)
    const p1vp2wonp1 = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p1', 0)
    const p1vp1wonp1Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p1won.p1Won', 0)
    const p2vp1wonp2Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p1won.p1Won', 0)
    const p2vp2wonp2Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p2_v_p2won.p2Won', 0)
    const p1vp2wonp1Won = _.get(sportEventAnalysis, 'analysis.benchmarkPlayer.previousPlayers.numbers.p1_v_p2won.p2Won', 0)

    var cal1 = (p2vp1wonp2 - p2vp1wonp2Won) - (p1vp1wonp1 - p1vp1wonp1Won)
    var cal2 = (p2vp2wonp2 - p2vp2wonp2Won) - (p1vp2wonp1 - p1vp2wonp1Won)

    if (wlP1 > wlP2) {
      cal1 = (p1vp1wonp1 - p1vp1wonp1Won) - (p2vp1wonp2 - p2vp1wonp2Won)
      cal2 = (p1vp2wonp1 - p1vp2wonp1Won) - (p2vp2wonp2 - p2vp2wonp2Won)
    }

    const result = gap - cal1 > gap - cal2 ? gap - cal2 : gap - cal1

    sportEventAnalysis['gap'] = result

    return result
  }
}