import _ from 'lodash'
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
      p1Form: null,
      p2Form: null,
    }

    const parsedMatchHtml = parse(matchHtml)

    var h2h = parsedMatchHtml.getElementsByTagName("div").find(div => div.attributes.class === 'players_h2h').text.trim()
    const playerNames = parsedMatchHtml.getElementsByTagName("div").filter(div => div.attributes.class === 'players_name').map(el => el.getElementsByTagName('a')[0].getAttribute('title'))

    if (h2h === null || h2h === undefined) {
      h2h = '0:0'
    }

    matchDetail.p1Name = playerNames[0]
    matchDetail.p2Name = playerNames[1]
    matchDetail.p1H2h = Number(h2h.split(':')[0])
    matchDetail.p2H2h = Number(h2h.split(':')[1])

    var matchHtmlTrimmed = matchHtml.replace(/[\r\n]+/g,'')

    const re = new RegExp(/,(-?\d+)]        \]\);/g)
    var formTables = matchHtmlTrimmed.match(re)

    matchDetail.p1Form = Number(formTables[0].replace(']        ]);', '').replace(',', ''))
    matchDetail.p2Form = Number(formTables[1].replace(']        ]);', '').replace(',', ''))

    return matchDetail
  }
}