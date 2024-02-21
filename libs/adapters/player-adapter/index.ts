import _ from "lodash"
import TennisliveClient from '@abcfinite/tennislive-client'

export default class PlayerAdater {
  async checkPlayer(player1Name: string, player2Name: string) {

    console.log('>>>>player1Name')
    console.log(player1Name)
    console.log('>>>>player2Name')
    console.log(player2Name)


    const tennisLiveClient = new TennisliveClient()
    const player1 = await tennisLiveClient.getPlayer(player1Name)
    console.log('>>>>player1')
    console.log(player1)

    const player2 = await tennisLiveClient.getPlayer(player2Name)
    console.log('>>>>player2')
    console.log(player2)
  }
}