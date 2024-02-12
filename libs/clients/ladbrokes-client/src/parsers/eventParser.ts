import _ from 'lodash'
import { Event } from '../types/responses'
import { category } from '../types/category'

export default class EventParser {
  static parse(bodyJson?: object,
    event?: object,
    entrantsParam?: object,
    marketsParam?: object,
    pricesParam?: object,
  ): Event {


    const eventsBody = event || Object.values(_.get(bodyJson, 'events'))[0]
    const entrants = entrantsParam || _.get(bodyJson, 'entrants')
    const mainMarketId = _.get(eventsBody, 'main_markets[0]')

    if(!mainMarketId) { return null }

    const markets = marketsParam || _.get(bodyJson, 'markets')
    const marketDetails = _.get(markets, mainMarketId)
    const entrantsIds = _.get(marketDetails, 'entrant_ids')
    const prices = pricesParam || _.get(bodyJson, 'prices')

    const entrant1PriceKey = Object.keys(prices).find(key => key.match(entrantsIds[0]) !== null)
    const entrant2PriceKey = Object.keys(prices).find(key => key.match(entrantsIds[1]) !== null)
    const entrant1Odd = _.get(prices, `${entrant1PriceKey}.odds`)
    const entrant2Odd = _.get(prices, `${entrant2PriceKey}.odds`)

    return {
      id: _.get(eventsBody, 'id'),
      player1: _.get(entrants, `${entrantsIds[0]}.name`, 'please check'),
      player2: _.get(entrants, `${entrantsIds[1]}.name`, 'please check'),
      player1Odd: _.get(entrant1Odd, 'numerator', 0) / _.get(entrant1Odd, 'denominator', 1) + 1,
      player2Odd: _.get(entrant2Odd, 'numerator', 0) / _.get(entrant2Odd, 'denominator', 1) + 1,
      tournament: _.get(eventsBody, 'competition.name', 'please check'),
      category: category[_.get(eventsBody, 'category_id', 'unknown')],
      advertisedStart: new Date(_.get(eventsBody, 'advertised_start', Date.now())),
    }
  }
}