import { Player } from '@abcfinite/tennislive-client/src/types/player'
import Analysis from '../../src/utils/analysis'
import { playerData } from '../fixtures/playerData'

describe('Analysis', () => {
  describe('playerLabel', () => {
    it('should return response', async () => {
        var result = new Analysis().playerLabel(playerData.player1 as Player)
        expect(result.lastWon.player.name).toEqual('Cristian Garin')
        expect(result.lastLost.player.name).toEqual('Andrea Vavassori')
    })
  })
})