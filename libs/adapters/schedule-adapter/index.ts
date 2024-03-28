import _ from "lodash"
import { putItem } from '@abcfinite/dynamodb-client'
import TennisliveClient from '@abcfinite/tennislive-client'
import { Player } from '../../clients/tennislive-client/src/types/player';
import { SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent";

export default class ScheduleAdapter {
  async getSchedule() {
    const sportEvents = await new TennisliveClient().getSchedule()

    console.log('>>sportEvents>>length:',sportEvents.length)

    //safe to dynamodb
    Promise.all(
      sportEvents.map(async event => {
        const sportEvent = event as SportEvent
        const eventRecord = {
          Id: sportEvent.id,
          Player1Name: sportEvent.player1.name,
          Player2Name: sportEvent.player2.name,
          Player1Url: sportEvent.player1.url,
          Player2Url: sportEvent.player2.url,
        }

        await putItem('Sport-Events', eventRecord)
      })
    )

    return sportEvents
  }
}