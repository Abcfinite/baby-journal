import MatchAdapter from '../../index'

describe('MatchAdapter', () => {
  describe('similarMatch', () => {
    it('should return response', async () => {
      const result = await new MatchAdapter().similarMatch()

      expect(result).not.toBeNull
    })
  })
})