// manually find sport event
// fetch info on the sport event

import { Player } from "./src/types/player";
import PlayerService from "./src/services/playerService";

export default class TennisliveClient {

  constructor() {
  }

  async getPlayer(playerName: string) : Promise<Player>{
    const playerDetailUrl = await new PlayerService().getPlayerUrl(playerName)

    if (playerDetailUrl !== null || playerDetailUrl !== undefined) {
      const player = await new PlayerService().getPlayerDetailHtml(playerDetailUrl)
    }

    return {} as any
  }
}