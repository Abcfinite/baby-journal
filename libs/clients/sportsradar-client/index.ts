// manually find sport event
// fetch info on the sport event

import { SportEvent } from "./src/types/sportEvent";
import EventService from "./src/services/eventService";

export default class SportsradarClient {

  constructor() {
  }

  async getEvent(sportEventId: string) : Promise<SportEvent>{
    const event = new EventService().getEvent(sportEventId)
    return event
  }
}