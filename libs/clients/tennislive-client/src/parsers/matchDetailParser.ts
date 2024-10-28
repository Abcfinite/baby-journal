import _ from 'lodash'
import { Player } from '../types/player'
import { Match } from '../types/match';
import { parse } from 'node-html-parser';
import { MatchDetail } from '@/types/matchDetail';

export default class MatchDetailParser {

  parse(matchHtml: string): MatchDetail {
    var matchDetail = {
      date: '',
      competition: '',
      p1Name: '',
      p2Name: '',
      p1H2h: 0,
      p2H2h: 0,
    }

    const parsedMatchHtml = parse(matchHtml)

    const h2h = parsedMatchHtml.getElementsByTagName("div").find(div => div.attributes.class === 'players_h2h').text.trim()
    const playerNames = parsedMatchHtml.getElementsByTagName("div").filter(div => div.attributes.class === 'players_name').map(el => el.getAttribute('title'))

    console.log('>>>h2h score>>>', h2h)

    console.log('>>>>playerNames')
    for (const name in playerNames) {
      console.log(name)
    }

    return matchDetail
  }
}