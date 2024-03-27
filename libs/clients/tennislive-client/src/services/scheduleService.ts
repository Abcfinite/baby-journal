import { SportEvent } from "../types/sportEvent"
import HttpApiClient from "@abcfinite/http-api-client"

export default class ScheduleService {

  constructor() {
  }

  async getSchedule() : Promise<SportEvent[]> {
    const headers = {
      Host: 'www.tennislive.net',
      Referer: process.env.TENNISLIVE_HOST
    }

    const httpApiClient = new HttpApiClient()

    let result = await httpApiClient.get(
        process.env.TENNISLIVE_HOST!,
        '/tennis_livescore.php?t=np' ,
        headers,
      )

    return []
  }

}