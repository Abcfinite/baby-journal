import TennisliveClient from '../../index'

describe('TennisliveClient', () => {
  describe('getPlayer', () => {
    it('should return response', async () => {
      const result = await new TennisliveClient().getPlayer('alexander shevchenko')

      expect(result).not.toBeNull
    })
  })
})