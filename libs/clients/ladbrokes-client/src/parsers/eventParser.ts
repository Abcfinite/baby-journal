import _ from 'lodash'
import { Event } from '../types/responses'

export default class EventParser {
  static parse(bodyJson: object): Event {
    const eventsBody =  Object.values(_.get(bodyJson, 'events'))[0]
    const entrants = _.get(bodyJson, 'entrants')
    const mainMarketId = _.get(eventsBody, 'main_markets[0]')
    const markets = _.get(bodyJson, 'markets')
    const marketDetails = _.get(markets, mainMarketId)
    const entrantsIds = _.get(marketDetails, 'entrant_ids')

    console.log('>>>>>entrantsIds')
    console.log(entrants)
    console.log(entrantsIds)
    console.log(_.get(entrants, entrantsIds[0]))

    return {
      id: _.get(eventsBody, 'id'),
      player1: _.get(entrants, `name`, 'please check'),
      player2: _.get(entrants, `name`, 'please check'),
      player1Odd: mainMarketId,
      player2Odd: _.get(bodyJson, 'id'),
      tournament: _.get(eventsBody, 'competition.name', 'please check'),
    }
  }
}