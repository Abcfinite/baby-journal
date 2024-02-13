import SportsradarClient from '../../index'

describe('SportsradarClient', () => {
  describe('getEvent', () => {
    it('should return response', async () => {
      const result = await new SportsradarClient().getEvent('asdas')

      // expect(result.pendingBetCounts).toBe(3)
      expect(result).not.toBeNull
    })
  })
})