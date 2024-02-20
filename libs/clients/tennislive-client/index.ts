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

    if (playerDetailUrl !== null || playerDetailUrl !== undefined) {
      const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)

      new MatchesDetailParser().parse(player)

      console.log('>>>>>player')
      console.log(player)
    }

    return {} as any
  }
}