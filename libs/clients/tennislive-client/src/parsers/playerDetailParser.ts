import _ from 'lodash'
import { Player } from '../types/player'
import { parse } from 'node-html-parser';

export default class PlayerDetailParser {
  static parse(html: string, keepPreviousMatches: boolean = true): Player {
    const root = parse(html);
    const playerStatsElement = root.getElementsByTagName("div").find(div => div.attributes.class === "player_stats")
    const player = {
      id: '',
      name: '',
      country: '',
      dob: '',
      currentRanking: 0,
      highestRanking: 0,
      matchesTotal: 0,
      matchesWon: 0,
      url: '',
      previousMatches: null,
      parsedPreviousMatches: null
    }

    if (keepPreviousMatches) {
      player['previousMatches'] = root.getElementsByTagName("table")
        .findLast(table => table.attributes.class === "table_pmatches")
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
        player['dob'] = dobAge.split(',')[0]
      }

      if (element.rawText.trim() === 'ATP ranking' || element.rawText.trim() === 'WTA ranking') {
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

    player['id'] = player['name'].toLocaleLowerCase().replaceAll(' ', '') + '#' + player['dob']

    return player
  }
}