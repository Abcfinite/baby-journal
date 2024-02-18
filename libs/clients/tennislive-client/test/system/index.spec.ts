import TennisliveClient from '../../index'

describe('TennisliveClient', () => {
  describe('getPlayer', () => {
    it('should return response', async () => {
      const result = await new TennisliveClient().getPlayer('august holmgren')

      // expect(result.pendingBetCounts).toBe(3)
      expect(result).not.toBeNull
    })
  })
})