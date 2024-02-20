import _ from 'lodash'
import { uuid } from 'uuidv4';
import { Player } from '../types/player'
import { parse } from 'node-html-parser';

export default class PlayerDetailParser {
  static parse(html: string): Player {
    const root = parse(html);
    const playerStatsElement = root.getElementsByTagName("div").find(div => div.attributes.class === "player_stats")
    const player = {
      id: uuid(),
      name: '',
      country: '',
      dob: '',
      currentRanking: 0,
      highestRanking: 0,
      matchesTotal: 0,
      matchesWon: 0,
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

      if (element.rawText.trim() === 'Birthdate:') {
        const dobAge = playerStatsElement.childNodes[post + 1].rawText.trim()
        player['dob'] = dobAge.split(',')[0].replaceAll('.','/')
      }

      if (element.rawText.trim() === 'ATP ranking') {
        player['currentRanking'] = Number(playerStatsElement.childNodes[post + 2].rawText.trim())
      }

      if (element.rawText.trim() === "TOP ranking's position:") {
        player['highestRanking'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim())
      }

      if (element.rawText.trim() === 'Matches total:') {
        player['matchesTotal'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim())
      }

      if (element.rawText.trim() === 'Win:') {
        player['matchesWon'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim())
      }
      ++post
    });

    console.log('>>>>player : ', player)

    return player
  }
}