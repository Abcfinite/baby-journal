import MatchAdapter from '../../index'

describe('MatchAdapter', () => {
  describe('similarMatch', () => {
    it('should return response', async () => {
      const result = await new MatchAdapter().similarMatch({})

      expect(result).not.toBeNull
    })
  })

  describe('analyzeAge', () => {
    it.only('should return response', async () => {
      const result = await new MatchAdapter().analyzeAge(false)

      expect(result).not.toBeNull
    })
  })
})