import TennisliveClient from '../../index'

describe('TennisliveClient', () => {
  describe('getPlayer', () => {
    it('should return response', async () => {
      const result = await new TennisliveClient().getPlayer('anca alexia todoni')

      expect(result).not.toBeNull
    })
  })
})