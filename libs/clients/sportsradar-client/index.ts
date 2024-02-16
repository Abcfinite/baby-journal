// manually find sport event
// fetch info on the sport event

import { SportEvent } from "./src/types/sportEvent";
import EventService from "./src/services/eventService";
import PlayerService from "./src/services/playerService";

export default class SportsradarClient {

  constructor() {
  }

  async getEvent(sportEventId: string) : Promise<SportEvent>{
    var sportEvent: SportEvent = await new EventService().getEvent(sportEventId)
    sportEvent.player1 = await new PlayerService().getProfile(sportEvent.player1.id)
    sportEvent.player2 = await new PlayerService().getProfile(sportEvent.player2.id)

    return {} as any
  }
}