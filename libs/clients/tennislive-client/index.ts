// manually find sport event
// fetch info on the sport event

import { Player } from "./src/types/player";
import PlayerService from "./src/services/playerService";
import MatchesDetailParser from "./src/parsers/matchesDetailParser";

export default class TennisliveClient {

  constructor() {
  }

  async getPlayer(playerName: string) : Promise<Player>{
    const playerDetailUrl = await new PlayerService().getPlayerUrl(playerName)

    if (playerDetailUrl === null || playerDetailUrl === undefined) return {} as any

    const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)
    new MatchesDetailParser().parse(player)

    await Promise.all(
      player.parsedPreviousMatches.map(async (prevMatch, index) => {
        const newPlayerData = await new PlayerService().getPlayerDetailHtml(prevMatch.player.url, false)
        player.parsedPreviousMatches[index].player = newPlayerData
      })
    )

    console.log('>>>player')
    console.log(JSON.stringify(player))

    return {} as any
  }
}