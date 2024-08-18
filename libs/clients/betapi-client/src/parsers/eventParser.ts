import _ from 'lodash'
import { Event } from '../types/event'

export default class EventParser {
  parse(event?: object): Event {
    const homePlayerData = {
      id: _.get(event, 'home.id', ''),
      name: _.get(event, 'home.name', ''),
      country: _.get(event, 'home.cc', '')
    }

    const awayPlayerData = {
      id: _.get(event, 'away.id', ''),
      name: _.get(event, 'away.name', ''),
      country: _.get(event, 'away.cc', '')
    }

    const isP1Won = this.isPlayer1Won(_.get(event, 'ss'))

    return {
        id: _.get(event, 'id', ''),
        time: _.get(event, 'time', ''),
        player1: homePlayerData,
        player2: awayPlayerData,
        stage: _.get(event, 'round', ''),
        score: _.get(event, 'ss'),
        player1won: isP1Won,
        retired: isP1Won == null && _.get(event, 'ss') === 'away' ? 1 : 2,
    }
  }

  isPlayer1Won = (score?: string) : boolean => {
    if (score === null || score === undefined) {
      return null
    }

    const sets = score.split(',')

    if (sets === null || sets === undefined) {
      return null
    }

    var p1Set = 0
    var p2Set = 0
    sets.forEach(set => {
      var pSet = set.split('-')
      if (pSet[0] > pSet[1]) {
        p1Set = p1Set + 1
      } else {
        p2Set = p2Set + 1
      }
    })

    return p1Set > p2Set
  }
}