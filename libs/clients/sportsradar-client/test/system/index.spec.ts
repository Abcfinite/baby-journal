import SportsradarClient from '../../index'

describe('SportsradarClient', () => {
  describe('getEvent', () => {
    it('should return response', async () => {
      const result = await new SportsradarClient().getEvent('sr:sport_event:47679859')

      // expect(result.pendingBetCounts).toBe(3)
      expect(result).not.toBeNull
    })
  })
})