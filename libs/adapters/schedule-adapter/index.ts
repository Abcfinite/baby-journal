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

    const result = await new PlayerAdapter().checkPlayerObject(
      sportEventsNeedCheck[0].player1, sportEventsNeedCheck[0].player2)

    await new S3ClientCustom()
      .putFile('tennis-match-schedule',
        sportEventsNeedCheck[0].id+'.json',
        JSON.stringify(result))

    return result
  }
}