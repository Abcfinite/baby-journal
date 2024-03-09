// manually find sport event
// fetch info on the sport event

import { Player } from "./src/types/player";
import PlayerService from "./src/services/playerService";
import MatchesDetailParser from "./src/parsers/matchesDetailParser";

export default class TennisliveClient {

  constructor() {
  }

  async getPlayer(playerName: string) : Promise<Player>{
    let playerDetailUrl = null
    if (playerName === 'li tu') {
      playerDetailUrl = 'https://www.tennislive.net/atp/li-tu/'
    } else if (playerName === 'lin zhu') {
      playerDetailUrl = 'https://www.tennislive.net/wta/lin-zhu/'
    } else if (playerName === 'ipek oz') {
      playerDetailUrl = 'https://www.tennislive.net/wta/ipek-oz/'
    } else if (playerName === 'luca nardi') {
      playerDetailUrl = 'https://www.tennislive.net/atp/luca-nardi/'
    }
    else {
      playerDetailUrl = await new PlayerService().getPlayerUrl(playerName)
    }

    if (playerDetailUrl === null || playerDetailUrl === undefined) return {} as any

    const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)
    new MatchesDetailParser().parse(player)

    await Promise.all(
      player.parsedPreviousMatches.map(async (prevMatch, index) => {
        let newPlayerData = null

        try {
          newPlayerData = await new PlayerService().getPlayerDetailHtml(prevMatch.player.url, false)
        } catch(ex) {
          console.error(ex)
        }

        if (newPlayerData !== null) {
          player.parsedPreviousMatches[index].player = newPlayerData
        } else {
          player.parsedPreviousMatches = player.parsedPreviousMatches.filter(pm => pm.date !== prevMatch.date )
        }
      })
    )

    return player
  }
}