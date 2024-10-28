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
      currentRanking: 1000,
      highestRanking: 1000,
      matchesTotal: 0,
      matchesWon: 0,
      url: '',
      type: '',
      previousMatches: null,
      incomingMatchUrl: null,
      parsedPreviousMatches: null,
      h2h: 0
    }

    var matchesTable = root.getElementsByTagName("table")
      .filter(table => table.attributes.class === "table_pmatches")

    if (keepPreviousMatches) {
      player['previousMatches'] = matchesTable.pop()

      if (matchesTable.length > 0) {
        //table, tbody, tr
        player['incomingMatchUrl'] = matchesTable[0]
          .childNodes[1].childNodes[5].childNodes[0]
          .childNodes[0].parentNode.getAttribute('href')
      }
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

      if (element.rawText.trim() === 'ATP ranking') {
        player.type = 'atp'
      }

      if (element.rawText.trim() === 'WTA ranking') {
        player.type = 'wta'
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