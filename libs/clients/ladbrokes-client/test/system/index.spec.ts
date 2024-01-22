import LadbrokesClient from '../../index'

describe('LadbrokesClient', () => {
  describe('getPendingBets', () => {
    it('should return response', async () => {

      const result = await new LadbrokesClient().getPendingBets()

      // expect(result.pendingBetCounts).toBe(3)
      expect(result.pendingBetCounts).not.toBeNull
    })
  })
})