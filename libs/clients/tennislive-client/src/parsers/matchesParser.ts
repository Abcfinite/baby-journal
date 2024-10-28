import _ from 'lodash'
import { Player } from '../types/player'
import { Match } from '../types/match';
import { parse } from 'node-html-parser';

export default class MatchesParser {

  parse(startPlayerData: Player): Player {

    const matchesShown = startPlayerData.previousMatches.getElementsByTagName("tr")
    startPlayerData.previousMatches = null
    const matchesShownLength = matchesShown.length < 20 ? matchesShown.length : 20
    const matches = []

    Array.from(matchesShown).slice(0, matchesShownLength).forEach(element => {
      const player : Player = {
        id: '',
        type: '',
        name: '',
        country: '',
        dob: '',
        currentRanking: 0,
        highestRanking: 0,
        matchesTotal: 0,
        matchesWon: 0,
        url: null,
        previousMatches: null,
        incomingMatchUrl: null,
        parsedPreviousMatches: null,
        h2h: 0,
      }

      const match : Match = {
        date: '',
        player: player,
        stage: '',
        score: '',
        result: 'lost'
      }

      element.childNodes.forEach((td, index) => {
        td.childNodes.forEach(content => {
          const attributes = (content as HTMLElement).attributes
          if ( _.get(attributes, 'title', null) === '') {
            player.url = (content as HTMLElement).attributes['href']
          }

          const alt = _.get(attributes, 'alt', null)
          if ( alt !== null && (alt === 'win' || alt === 'lost')) {
              match.result = (content as HTMLElement).attributes['alt']
          }

          if (content.textContent !== null) {
            const dateRegexResult = content.textContent.match(/[0-9]{2}.[0-9]{2}.[0-9]{2}/)
            if (dateRegexResult !== null && dateRegexResult[0] !== null) {
              match.date = content.textContent
            }

            if (content.textContent.includes(',')) {
              match.score = content.textContent.replaceAll(' ','')
            }

            ['q 1', 'q 2', 'qual.', 'round', '1/2', '1/4', 'fin'].forEach(r => {
              if (content.textContent.includes(r)) {
                match.stage = content.textContent
                if (element.innerHTML.includes('2<sup>nd</sup> round')) {
                  match.stage = '2nd round'
                } else if (element.innerHTML.includes('1<sup>st</sup> round')) {
                  match.stage = '1st round'
                } else if (element.innerHTML.includes('3<sup>rd</sup> round')) {
                  match.stage = '3rd round'
                } else if (element.innerHTML.includes('4<sup>th</sup> round')) {
                  match.stage = '4th round'
                }
              }
            })
          }
        })
      })

      matches.push(match)
    })
    startPlayerData.parsedPreviousMatches = matches

    return startPlayerData
  }
}