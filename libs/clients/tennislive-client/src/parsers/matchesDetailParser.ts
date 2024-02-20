import _ from 'lodash'
import { Player } from '../types/player'
import { Match } from '../types/match';

export default class MatchesDetailParser {

  parse(startPlayerData: Player): Player {

    const matchesShown = startPlayerData.previousMatches.getElementsByTagName("tr")
    const matchesShownLength = matchesShown.length < 10 ? matchesShown.length : 10

    Array.from(matchesShown).slice(0, matchesShownLength).forEach(element => {
      element.childNodes.forEach(td => {
        td.childNodes.forEach(content => {
          console.log((content as HTMLElement).attributes)
        })
      })
    })



    return startPlayerData
  }

  // parseSingleMatch() : Match {

  // }
}