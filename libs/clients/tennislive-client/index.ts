// manually find sport event
// fetch info on the sport event

import { Player } from './src/types/player';
import { SportEvent } from './src/types/sportEvent';
import MatchesParser from './src/parsers/matchesParser';
import PlayerService from './src/services/playerService';
import FinishedService from './src/services/finishedService';
import MatchDetailService from './src/services/matchDetailService';

export default class TennisliveClient {

  constructor() {
  }

  async getPlayerUrl(playerName?: string) : Promise<string> {
    return new PlayerService().getPlayerUrl(playerName)
  }

  async getPlayer(playerUrl?: string) : Promise<Player>{
    let playerDetailUrl = playerUrl

    const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)
    new MatchesParser().parse(player)

    if (player.incomingMatchUrl !== null) {
      const matchDetail = await new MatchDetailService().getMatchDetail(player.incomingMatchUrl)
      player.h2h = player.name === matchDetail.p1Name ? matchDetail.p1H2h : matchDetail.p2H2h
      player.form = player.name === matchDetail.p1Name ? matchDetail.p1Form : matchDetail.p2Form
    }

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

  async getFinished() : Promise<SportEvent[]> {
    const finishedSportEvents = await new FinishedService().getFinished()

    finishedSportEvents.forEach(se => {
      se.url
    })

    return finishedSportEvents
  }
}