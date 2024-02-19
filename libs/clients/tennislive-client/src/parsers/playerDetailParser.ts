import _ from 'lodash'
import { Player } from '../types/player'
import { parse } from 'node-html-parser';

export default class PlayerDetailParser {
  static parse(html: string): Player {
    const root = parse(html);
    const playerStatsElement = root.getElementsByTagName("div").find(div => div.attributes.class === "player_stats")
    const player = {
      id: '',
      name: '',
      country: '',
      dob: '',
      currentRanking: 1000,
      highestRanking: 1000,
      total: 0,
      won: 0,
      previousMatches: []
    }

    let post=0
    playerStatsElement.childNodes.forEach(element => {
      if (element.rawText.trim() === 'Name:') {
        player['name'] = playerStatsElement.childNodes[post + 1].rawText.trim()
      }

      if (element.rawText.trim() === 'Country:') {
        player['country'] = playerStatsElement.childNodes[post + 1].rawText.trim()
      }
      ++post
    });

    console.log('>>>>player : ', player)

    return player
  }
}