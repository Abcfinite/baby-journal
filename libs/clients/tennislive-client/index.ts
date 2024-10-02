// manually find sport event
// fetch info on the sport event

import { Player } from './src/types/player';
import { SportEvent } from "@/types/sportEvent";
import MatchesDetailParser from "./src/parsers/matchesDetailParser";
import PlayerService from "./src/services/playerService";
import ScheduleService from "./src/services/scheduleService";
import FinishedService from './src/services/finishedService';
import BetapiClient from '../betapi-client';

export default class TennisliveClient {

  constructor() {
  }

  async getPlayerUrl(playerName?: string) : Promise<string> {
    return new PlayerService().getPlayerUrl(playerName)
  }

  async getPlayer(playerUrl?: string) : Promise<Player>{

    let playerDetailUrl = playerUrl

    const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)
    new MatchesDetailParser().parse(player)

    await Promise.all(
      player.parsedPreviousMatches.map(async (prevMatch, index) => {
        let newPlayerData = null

        newPlayerData = await new PlayerService().getPlayerDetailHtml(prevMatch.player.url, false)

        if (newPlayerData !== null) {
          player.parsedPreviousMatches[index].player = newPlayerData
        } else {
          player.parsedPreviousMatches = player.parsedPreviousMatches.filter(pm => pm.date !== prevMatch.date )
        }
      })
    )

    return player
  }

  // async getSchedule() : Promise<SportEvent[]> {
  //   // const result = await new ScheduleService().getSchedule()
  //   // const result = await new ScheduleService().getMatchstatCompareSchedule()

  //   const events = await new BetapiClient().getEvents()

  //   return result
  // }

  async getFinished() : Promise<SportEvent[]> {
    const finishedSportEvents = await new FinishedService().getFinished()

    finishedSportEvents.forEach(se => {
      se.url
    })

    return finishedSportEvents
  }
}