import _ from 'lodash'
import { Player } from '../types/player'

export default class PlayerParser {
  static parse(bodyJson?: object): Player {

    console.log('>>>>>parse')
    console.log(bodyJson)


    return {} as any
  }
}